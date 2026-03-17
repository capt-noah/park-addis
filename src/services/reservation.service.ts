import { db } from "../db"
import { reservations } from "../schema/reservations"
import { checkParkingAvailability, updateParkingAvailability } from "./parking.service"
import { eq } from "drizzle-orm"


export async function reserveSpot(userId: string, spotId: string, startTime: Date, endTime: Date) {
	const isAvailable = await checkParkingAvailability(spotId)
	if (!isAvailable) return null
	
	const response = await db.insert(reservations)
							 .values({ userId, spotId, startTime, endTime })
							 .returning()
	if (!response[0]) return null

	const incrementSpot = await updateParkingAvailability(spotId, 1, 0)
	
	return incrementSpot ?? null
	
}

export async function getUserReservations(userId: string) {
	const userReservations = await db.select()
									 .from(reservations)
									 .where(eq(reservations.userId, userId))

	return userReservations ?? null
}

export async function cancelReservation(userId: string) {
	const reservation = await db.delete(reservations)
								.where(eq(reservations.userId, userId))
								.returning()
	if(!reservation[0]) return null

	const decrementSpot = await updateParkingAvailability(reservation[0].spotId, 0, 1)
	
	return decrementSpot ?? null
}