import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { wallets } from "../schema/wallets";
import { walletTransactions } from "../schema/walletTransactions";
import { initializeChapaPayment } from "./payment.service";
import { reservationPayments } from "../schema/reservationPayments";
import crypto from "crypto"

import Decimal from 'decimal.js'
import { users } from "../schema/users";
import { reservations } from "../schema/reservations";


export async function createWallet(userId: string) {
    const balance = new Decimal('0').toString()
    const response = await db.insert(wallets)
                             .values({userId, balance})
                             .returning()
                             .then(r => r[0])
                             
    return response ?? null
}

export async function getWallet(userId: string) {
    const userWallet = await db.select()
                               .from(wallets)
                               .where(eq(wallets.userId, userId))
                               .then(r => r[0])
                               
    return userWallet ?? null
}

export async function getWalletTransactions(walletId: string){
    const walletTrx = await db.select()
                              .from(walletTransactions)
                              .where(eq(walletTransactions.walletId, walletId))
                              
    
    return walletTrx ?? null
}

export async function topUpWallet(userId: string, amount: string, returnUrl?: string) {
    
    const response = await db.transaction(async (tx) => {

        const tx_ref = crypto.randomUUID()

        const user = await tx.select()
                             .from(users)
                             .where(eq(users.id, userId))
                             .then(r => r[0])

        const userWallet = await tx.select()
                                   .from(wallets)
                                   .where(eq(wallets.userId, userId))
                                   .then(r => r[0])
                                   
                                
        const walletTrRes = await tx.insert(walletTransactions)
                                    .values({
                                        walletId: userWallet.id,
                                        amount,
                                        type: 'TOPUP',
                                        status: 'PENDING',
                                        referenceId: tx_ref
                                    })
                                    .returning()
                                    .then(r => r[0])
        
        return {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            tx_ref
        }
    })

    const paymentCallback = "wallet"
    const chapaPayment = await initializeChapaPayment({ 
        amount, 
        email: response.email, 
        fullName: response.fullName, 
        phone_number: response.phoneNumber, 
        tx_ref: response.tx_ref, 
        paymentCallback,
        returnUrl
    })
    
    return chapaPayment ?? null
}

export async function calculateBalanceFromHistory(walletId: string, tx?: any) {
    const database = tx || db;
    const [result] = await database.select({
        total: sql<string>`SUM(
            CASE 
                WHEN type = 'TOPUP' THEN amount 
                WHEN type = 'RESERVATION_CHARGE' THEN -amount 
                WHEN type = 'RESERVATION_HOLD' THEN -amount 
                ELSE 0 
            END
        )`
    })
    .from(walletTransactions)
    .where(
        and(
            eq(walletTransactions.walletId, walletId),
            eq(walletTransactions.status, 'SUCCESS')
        )
    );

    return parseFloat(result?.total || "0");
}

export async function syncWalletBalance(walletId: string, tx?: any) {
    const database = tx || db;
    const historicalBalance = await calculateBalanceFromHistory(walletId, database);

    const [updatedWallet] = await database.update(wallets)
            .set({ balance: historicalBalance.toString() })
            .where(eq(wallets.id, walletId))
            .returning();

    return updatedWallet;
}

export async function confirmTopUp(tx_ref: string) {
    const walletTx = await db.select()
                             .from(walletTransactions)
                             .where(eq(walletTransactions.referenceId, tx_ref))
                             .then(r => r[0])

    if (!walletTx) throw new Error("Transaction not found");
    if (walletTx.status === 'SUCCESS') return { success: true, alreadyProcessed: true };
    if (!walletTx.walletId) throw new Error("Wallet transaction does not have a walletId");

    const result = await db.transaction(async (tx) => {
        const currentTx = await tx.select()
                                  .from(walletTransactions)
                                  .where(eq(walletTransactions.id, walletTx.id))
                                  .then(r => r[0]);
                                  
        if (!currentTx || currentTx.status !== 'PENDING') return null;

        await tx.update(walletTransactions)
                .set({ status: 'SUCCESS', completedAt: new Date() })
                .where(eq(walletTransactions.id, walletTx.id));

        return await syncWalletBalance(walletTx.walletId!, tx);
    });

    return result ? { success: true, balance: result.balance } : { success: false, error: "Already processed" };
}

export async function failTopUp(tx_ref: string) {
    const response = await db.update(walletTransactions)
                             .set({status: 'FAILED'})
                             .where(and(
                                 eq(walletTransactions.referenceId, tx_ref),
                                 eq(walletTransactions.status, 'PENDING')
                             ))
                             .returning()
                             .then(r => r[0])
                             
    return response ?? null
}

export async function payReservationFromWallet(userId: string, reservationId: string, amount: string) {
    const wallet = await getWallet(userId);
    if (!wallet) throw new Error("Wallet not found");

    if (new Decimal(wallet.balance).lt(amount)) throw new Error("Insufficient funds");

    return await db.transaction(async (tx) => {
        const tx_id = crypto.randomUUID();
        
        // 1. Record the transaction record first (Status: SUCCESS because it's wallet-to-wallet)
        // Store as positive amount; balance calculation logic handles the subtraction based on type.
        const walletTx = await tx.insert(walletTransactions)
                                 .values({
                                    walletId: wallet.id,
                                    amount: new Decimal(amount).toString(),
                                    type: 'RESERVATION_CHARGE',
                                    status: 'SUCCESS',
                                    referenceId: tx_id,
                                    completedAt: new Date()
                                 })
                                 .returning()
                                 .then(r => r[0]);

        // 2. Link the reservation payment
        await tx.insert(reservationPayments)
                .values({
                    reservationId,
                    walletTransactionId: walletTx.id,
                    amount,
                });

        // 3. Update the Reservation status to PAID
        await tx.update(reservations)
                .set({ status: 'PAID' })
                .where(eq(reservations.id, reservationId));

        // 4. Reconstruct the balance from history
        const updatedWallet = await syncWalletBalance(wallet.id, tx);

        // 4. Double-check that the operation didn't push the user into negative balance (Race condition check)
        if (new Decimal(updatedWallet.balance).isNegative()) {
            throw new Error("Insufficient balance (concurrent transaction prevented)");
        }

        return { success: true, balance: updatedWallet.balance };
    });
}