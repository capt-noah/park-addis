import { db } from "../db";
import { vehicles } from "../schema/vehicles";
import { eq } from "drizzle-orm";

export async function getVehiclesByUserId(userId: string) {
    const userVehicles = await db.select().from(vehicles).where(eq(vehicles.userId, userId));
    return userVehicles ?? [];
}