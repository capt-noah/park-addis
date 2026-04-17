import { and, eq, sql, desc } from "drizzle-orm";
import { db } from "../db";
import { wallets } from "../schema/wallets";
import { walletTransactions } from "../schema/walletTransactions";
import { initializeChapaPayment } from "./payment.service";
import { reservationPayments } from "../schema/reservationPayments";
import crypto from "crypto";

import Decimal from "decimal.js";
import { users } from "../schema/users";
import { reservations } from "../schema/reservations";

export async function createWallet(userId: string) {
  const balance = new Decimal("0").toString();
  const response = await db
    .insert(wallets)
    .values({ userId, balance })
    .returning()
    .then((r) => r[0]);

  return response ?? null;
}

export async function getWallet(userId: string) {
  const userWallet = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .then((r) => r[0]);

  return userWallet ?? null;
}

export async function getWalletTransactions(walletId: string) {
  const walletTrx = await db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.walletId, walletId));

  return walletTrx ?? null;
}

export async function topUpWallet(
  userId: string,
  amount: string,
  returnUrl?: string,
) {
  const response = await db.transaction(async (tx) => {
    const tx_ref = crypto.randomUUID();

    const user = await tx
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .then((r) => r[0]);

    const userWallet = await tx
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .then((r) => r[0]);

    const walletTrRes = await tx
      .insert(walletTransactions)
      .values({
        walletId: userWallet.id,
        amount,
        type: "TOPUP",
        status: "PENDING",
        referenceId: tx_ref,
      })
      .returning()
      .then((r) => r[0]);

    return {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      tx_ref,
    };
  });

  const paymentCallback = "wallet";
  const chapaPayment = await initializeChapaPayment({
    amount,
    email: response.email,
    fullName: response.fullName,
    phone_number: response.phoneNumber,
    tx_ref: response.tx_ref,
    paymentCallback,
    returnUrl,
  });

  return chapaPayment ?? null;
}

export async function calculateBalanceFromHistory(walletId: string, tx?: any) {
  const database = tx || db;
  const [result] = await database
    .select({
      total: sql<string>`SUM(
            CASE 
                WHEN type = 'TOPUP' THEN amount 
                WHEN type = 'RESERVATION_CHARGE' THEN -amount 
                WHEN type = 'RESERVATION_HOLD' THEN -amount 
                WHEN type = 'RESERVATION_REFUND' THEN amount 
                ELSE 0 
            END
        )`,
    })
    .from(walletTransactions)
    .where(
      and(
        eq(walletTransactions.walletId, walletId),
        eq(walletTransactions.status, "SUCCESS"),
      ),
    );

  return parseFloat(result?.total || "0");
}

export async function syncWalletBalance(walletId: string, tx?: any) {
  const database = tx || db;
  const historicalBalance = await calculateBalanceFromHistory(
    walletId,
    database,
  );

  const [updatedWallet] = await database
    .update(wallets)
    .set({ balance: historicalBalance.toString() })
    .where(eq(wallets.id, walletId))
    .returning();

  return updatedWallet;
}

export async function refundReservationFee(reservationId: string, tx?: any) {
  const database = tx || db;

  const refundRecord = await database
    .select({
      walletId: walletTransactions.walletId,
      amount: reservationPayments.amount,
    })
    .from(reservationPayments)
    .innerJoin(
      walletTransactions,
      eq(reservationPayments.walletTransactionId, walletTransactions.id),
    )
    .where(
      and(
        eq(reservationPayments.reservationId, reservationId),
        eq(walletTransactions.status, "SUCCESS"),
      ),
    )
    .orderBy(desc(reservationPayments.createdAt))
    .limit(1)
    .then((r: any) => r[0]);

  if (!refundRecord) return null;

  const refundTx = await database
    .insert(walletTransactions)
    .values({
      walletId: refundRecord.walletId,
      amount: new Decimal(refundRecord.amount).toString(),
      type: "RESERVATION_REFUND",
      status: "SUCCESS",
      referenceId: crypto.randomUUID(),
      completedAt: new Date(),
    })
    .returning()
    .then((r: any) => r[0]);

  if (!refundTx) return null;

  return await syncWalletBalance(refundRecord.walletId, database);
}

export async function confirmTopUp(tx_ref: string) {
  const walletTx = await db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.referenceId, tx_ref))
    .then((r) => r[0]);

  if (!walletTx) throw new Error("Transaction not found");
  if (walletTx.status === "SUCCESS")
    return { success: true, alreadyProcessed: true };
  if (!walletTx.walletId)
    throw new Error("Wallet transaction does not have a walletId");

  const result = await db.transaction(async (tx) => {
    const currentTx = await tx
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.id, walletTx.id))
      .then((r: any) => r[0]);

    if (!currentTx || currentTx.status !== "PENDING") return null;

    await tx
      .update(walletTransactions)
      .set({ status: "SUCCESS", completedAt: new Date() })
      .where(eq(walletTransactions.id, walletTx.id));

    return await syncWalletBalance(walletTx.walletId!, tx);
  });

  return result
    ? { success: true, balance: result.balance }
    : { success: false, error: "Already processed" };
}

export async function failTopUp(tx_ref: string) {
  const response = await db
    .update(walletTransactions)
    .set({ status: "FAILED" })
    .where(
      and(
        eq(walletTransactions.referenceId, tx_ref),
        eq(walletTransactions.status, "PENDING"),
      ),
    )
    .returning()
    .then((r) => r[0]);

  return response ?? null;
}

export async function payReservationFeeFromWallet(
  userId: string,
  reservationId: string,
  amount: string,
) {
  const wallet = await getWallet(userId);
  if (!wallet) throw new Error("Wallet not found");

  if (new Decimal(wallet.balance).lt(amount))
    throw new Error("Insufficient funds");

  return await db.transaction(async (tx) => {
    const reservation = await tx
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.id, reservationId),
          eq(reservations.userId, userId),
        ),
      )
      .then((r) => r[0]);

    if (!reservation) throw new Error("Reservation not found");
    if (reservation.status !== "RESERVED")
      throw new Error("Reservation is not in a reservable state");

    const tx_id = crypto.randomUUID();

    const walletTx = await tx
      .insert(walletTransactions)
      .values({
        walletId: wallet.id,
        amount: new Decimal(amount).toString(),
        type: "RESERVATION_CHARGE",
        status: "SUCCESS",
        referenceId: tx_id,
        completedAt: new Date(),
      })
      .returning()
      .then((r) => r[0]);

    await tx.insert(reservationPayments).values({
      reservationId,
      walletTransactionId: walletTx.id,
      amount,
    });

    const updatedWallet = await syncWalletBalance(wallet.id, tx);

    if (new Decimal(updatedWallet.balance).isNegative()) {
      throw new Error(
        "Insufficient balance (concurrent transaction prevented)",
      );
    }

    return { success: true, balance: updatedWallet.balance };
  });
}

export async function payReservationFromWallet(
  userId: string,
  reservationId: string,
  amount: string,
) {
  const wallet = await getWallet(userId);
  if (!wallet) throw new Error("Wallet not found");

  if (new Decimal(wallet.balance).lt(amount))
    throw new Error("Insufficient funds");

  return await db.transaction(async (tx) => {
    const tx_id = crypto.randomUUID();

    const walletTx = await tx
      .insert(walletTransactions)
      .values({
        walletId: wallet.id,
        amount: new Decimal(amount).toString(),
        type: "RESERVATION_CHARGE",
        status: "SUCCESS",
        referenceId: tx_id,
        completedAt: new Date(),
      })
      .returning()
      .then((r) => r[0]);

    await tx.insert(reservationPayments).values({
      reservationId,
      walletTransactionId: walletTx.id,
      amount,
    });

    await tx
      .update(reservations)
      .set({ status: "PAID" })
      .where(eq(reservations.id, reservationId));

    const updatedWallet = await syncWalletBalance(wallet.id, tx);

    if (new Decimal(updatedWallet.balance).isNegative()) {
      throw new Error(
        "Insufficient balance (concurrent transaction prevented)",
      );
    }

    return { success: true, balance: updatedWallet.balance };
  });
}
