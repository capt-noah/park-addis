import { PgTable, timestamp, uuid, uniqueIndex, pgTable } from "drizzle-orm/pg-core";
import { users } from "@/src/schema/users"


export const sessions = pgTable(
    "sessions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id").notNull().references(() => users.id),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow()
    },
    (table) => ({
        sessionIndex: uniqueIndex("idx_sessions_user_id").on(table.userId)
    })
)