import { uuid, text, timestamp, pgTable, decimal } from "drizzle-orm/pg-core";
import { wallets } from "./wallets";

export const walletTransactions = pgTable("wallet_transactions", {
    id: uuid('id').primaryKey().defaultRandom(),
    walletId: uuid('wallet_id').references(() => wallets.id),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    type: text('type').notNull(),
    status: text('status').notNull(),
    referenceId: uuid('reference_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    completedAt: timestamp('completed_at').defaultNow()
})