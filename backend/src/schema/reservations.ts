import { pgTable, uuid, uniqueIndex, timestamp, text } from "drizzle-orm/pg-core"
import { users } from "./users"
import { parkingSpots } from "./parkingSpots"
import { vehicles } from "./vehicles"

export const reservations = pgTable(
    "reservations",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id").notNull().references(() => users.id),
        vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
        spotId: uuid("spot_id").notNull().references(() => parkingSpots.id, { onDelete: 'cascade' }),
        startTime: timestamp("start_time").notNull(),
        endTime: timestamp("end_time").notNull(),
        actualStartTime: timestamp("actual_start_time"),
        actualEndTime: timestamp("actual_end_time"),
        status: text("status").notNull().default("RESERVED"),
        qrToken: text("qr_token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow()
    },
    (table) => ({
        reservationsUserIndex: uniqueIndex("idx_reservations_user_id").on(table.userId),
        reservationsSpotIndex: uniqueIndex("idx_reservations_spot_id").on(table.spotId)
    })
)