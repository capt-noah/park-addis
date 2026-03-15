import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users"


export const vehicles = pgTable(
    "vehicles",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id").notNull().references(() => users.id),
        plateNumber: text("plate_number").notNull().unique(),
        carModel: text("car_model").notNull(),
        color: text("color").notNull(),
        isPrimary: boolean("is_primary").default(false),
        createdAt: timestamp("created_at").defaultNow()
    }

)