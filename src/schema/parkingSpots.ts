import { pgTable, numeric, integer, boolean, uuid, timestamp } from "drizzle-orm/pg-core"
import { parkingLocations } from "./parkingLocations"

export const parkingSpots = pgTable(
    "parking_spots",
    {
        id: uuid("id").notNull().primaryKey().defaultRandom(),
        locationId: uuid("location_id").notNull().references(() => parkingLocations.id),
        pricePerHour: numeric("price_per_hour").notNull(),
        totalSlots: integer("total_slots").notNull(),
        availableSlots: integer("available_spots").notNull(),
        updatedAt: timestamp("updated_at").defaultNow(),
        active: boolean("avtive").default(true)
    }
)