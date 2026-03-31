import { pgTable, uuid, timestamp, text, numeric } from "drizzle-orm/pg-core"
import { reservations } from "./reservations"

export const payments = pgTable(
    "payments",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        reservationId: uuid("reservation_id").notNull().references(() => reservations.id, { onDelete: 'cascade' }),
        amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
        status: text("status").notNull(), // PENDING, SUCCESS, FAILED
        transactionId: text("transaction_id"),
        createdAt: timestamp("created_at").defaultNow()
    }
)
