import { pgTable, uniqueIndex, text, uuid, timestamp, customType } from "drizzle-orm/pg-core";

export const parkingLocations = pgTable(
    "parking_locations",
    {
        id: uuid("id").notNull().primaryKey().defaultRandom(),
        name: text("name").notNull(),
        address: text("address").notNull(),
        geom: text("geom").notNull(),
        createdAt: timestamp("created_at").defaultNow()
    },
    (table) => ({
        geomIndex: uniqueIndex("idx_parking_locations_geom").on(table.geom)
    })
)