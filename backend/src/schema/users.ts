import { text, uuid, uniqueIndex, timestamp, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", 
    {
        id: uuid("id").primaryKey().defaultRandom(),
        fullName: text("full_name").notNull(),
        email: text("email").notNull(),
        passwordHash: text("password_hash").notNull(),
        phoneNumber: text("phone_number").unique().notNull(),
        role: text("role").default("user"),
        createdAt: timestamp("created_at").defaultNow()
    },
    (table) => ({
        emailIndex: uniqueIndex("users_email_idx").on(table.email)
    })
)