import { uuid, text, timestamp, pgTable, decimal } from "drizzle-orm/pg-core";
import { reservations } from "./reservations";
import { walletTransactions } from "./walletTransactions";

export const reservationPayments = pgTable("reservation_payments", {
    id: uuid('id').primaryKey().defaultRandom(),
    reservationId: uuid('reservation_id').references(() => reservations.id),
    walletTransactionId: uuid('wallet_transaction_id').references(() => walletTransactions.id),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),

})