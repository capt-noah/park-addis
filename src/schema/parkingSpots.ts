import { pgTable, text, numeric, integer, boolean, uuid } from "drizzle-orm/pg-core"
import { parkingLocations } from "./parkingLocations"

export const parkingSpots = pgTable(
    "parking_spots",
    {
        id: uuid("id").notNull().primaryKey().defaultRandom(),
        locationId: uuid("location_id").notNull().references(() => parkingLocations.id),
        pricePerHour: numeric("price_per_hour").notNull(),
        totalSlots: integer("total_slots").notNull(),
        active: boolean("avtive").default(true)
    }
)