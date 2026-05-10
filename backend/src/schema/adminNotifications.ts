import { pgTable, uuid, timestamp, text, boolean } from "drizzle-orm/pg-core"

export const adminNotifications = pgTable(
    "admin_notifications",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        type: text("type").notNull().default('INFO'), // 'ALERT', 'INFO', 'SYSTEM'
        message: text("message").notNull(),
        isRead: boolean("is_read").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull()
    }
)
