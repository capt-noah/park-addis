import { eq } from "drizzle-orm";
import { db } from "../db";
import { wallets } from "../schema/wallets";
import { walletTransactions } from "../schema/walletTransactions";
import { initializeChapaPayment } from "./payment.service";
import { reservationPayments } from "../schema/reservationPayments";
import crypto from "crypto"

import Decimal from 'decimal.js'
import { users } from "../schema/users";


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

export async function topUpWallet(userId: string, amount: string) {
    
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
        
        const email = user.email

        return {
            email,
            walletTrRes
        }
        

    })

        // const chapaPayment = await initializeChapaPayment({ amount, email, tx_ref })
        
        // if (chapaPayment.status !== 'SUCCESS') throw new Error("Payment Failed")
        
        const validateTopUp = await confirmTopUp(response.walletTrRes.referenceId)

        return validateTopUp ?? null
        // return validateTopUp.success? {validateTopUp, chapaPayment} : null
}

export async function confirmTopUp(tx_ref: string) {
    const walletTx = await db.select()
                             .from(walletTransactions)
                             .where(eq(walletTransactions.referenceId, tx_ref))
                             .then(r => r[0])

    if (!walletTx) throw new Error("Transaction not found" + walletTx);

    if (!walletTx.walletId) throw new Error("Wallet transaction does not have a walletId");

    const wallet = await db.select()
                           .from(wallets)
                           .where(eq(wallets.id, walletTx.walletId))
                           .then(r => r[0])
                           
    if (!wallet) throw new Error("Wallet not found");

    const updatedWallet = await db.transaction(async (tx) => {

        const current = new Decimal(wallet.balance);
        const newBalance = current.plus(walletTx.amount).toString();

        const response = await tx.update(wallets)
                                      .set({ balance: newBalance })
                                      .where(eq(wallets.id, wallet.id))
                                      .returning()
                                      .then(r => r[0])

        await tx.update(walletTransactions)
                .set({ status: 'SUCCESS' })
                .where(eq(walletTransactions.id, walletTx.id));
                
        return response
    });

    return { success: true, balance: updatedWallet.balance };
}

export async function payReservationFromWallet(userId: string, reservationId: string, amount: string) {

    const wallet = await db.select()
                           .from(wallets)
                           .where(eq(wallets.userId, userId))
                           .then(r => r[0])
                           
    if (!wallet) throw new Error("Wallet not found");

    if (new Decimal(wallet.balance).lt(amount)) throw new Error("Insufficient funds");

    const negatedAmount = new Decimal(amount).negated().toString()

    await db.transaction(async (tx) => {

        const tx_id = crypto.randomUUID();
        const walletTx = await tx.insert(walletTransactions)
                                 .values({
                                    walletId: wallet.id,
                                    amount: negatedAmount,
                                    type: 'RESERVATION_PAYMENT',
                                    status: 'SUCCESS',
                                    referenceId: tx_id
                                 })
                                 .returning()
                                 .then(r => r[0]);


        const newBalance = new Decimal(wallet.balance).minus(amount).toString();

        await tx.update(wallets)
                .set({ balance: newBalance })
                .where(eq(wallets.id, wallet.id));


        await tx.insert(reservationPayments)
                .values({
                    reservationId,
                    walletTransactionId: walletTx.id,
                    amount,
                });
    });

    return { success: true, balance: new Decimal(wallet.balance).minus(amount).toString() };
}