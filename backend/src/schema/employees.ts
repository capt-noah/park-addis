import { text, uuid, uniqueIndex, timestamp, pgTable, time } from "drizzle-orm/pg-core";
import { parkingLocations } from "./parkingLocations";

export const employees = pgTable("employees", 
    {
        id: uuid("id").primaryKey().defaultRandom(),
        fullName: text("full_name").notNull(),
        email: text("email").notNull(),
        passwordHash: text("password_hash").notNull(),
        phoneNumber: text("phone_number").unique().notNull(),
        status: text("status").default("ACTIVE"),
        role: text("role").default("employee"),
        assignedLocationId: uuid("assigned_location_id").references(() => parkingLocations.id, { onDelete: 'set null' }),
        shiftStartTime: time("shift_start_time"),
        shiftEndTime: time("shift_end_time"),
        createdAt: timestamp("created_at").defaultNow()
    },
    (table) => ({
        emailIndex: uniqueIndex("employees_email_idx").on(table.email)
    })
)
