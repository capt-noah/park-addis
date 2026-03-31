import { uuid, text, timestamp, pgTable, decimal } from "drizzle-orm/pg-core";
import { users } from "./users";

export const wallets = pgTable("wallets", {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id),
    balance: decimal('balance', { precision: 12, scale: 2 }).notNull(),
    status: text('status').notNull().default('ACTIVE'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
})