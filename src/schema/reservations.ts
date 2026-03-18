import { pgTable, uuid, uniqueIndex, timestamp, text } from "drizzle-orm/pg-core"
import { users } from "./users"
import { parkingSpots } from "./parkingSpots"

export const reservations = pgTable(
    "reservations",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id").notNull().references(() => users.id),
        spotId: uuid("spot_id").notNull().references(() => parkingSpots.id),
        startTime: timestamp("start_time").notNull(),
        endTime: timestamp("end_time").notNull(),
        status: text("status").default("active"),
        createdAt: timestamp("created_at").defaultNow()
    },
    (table) => ({
        reservationsUserIndex: uniqueIndex("idx_reservations_user_id").on(table.userId),
        reservationsSpotIndex: uniqueIndex("idx_reservations_spot_id").on(table.spotId)
    })
)