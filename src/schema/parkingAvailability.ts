import { pgTable, uuid, integer, timestamp } from "drizzle-orm/pg-core"
import { parkingSpots } from "./parkingSpots"

export const parkingAvailability = pgTable(
    "parking_availability",
    {
        spotId: uuid("spot_id").primaryKey().notNull().references(() => parkingSpots.id),
        availableSlots: integer("available_slots").notNull(),
        updatedAt: timestamp("updated_at").defaultNow()
    }
)