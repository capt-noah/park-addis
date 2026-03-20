import { db } from "../db"
import { reservations } from "../schema/reservations"
import { parkingSpots } from "../schema/parkingSpots"
import { parkingLocations } from "../schema/parkingLocations"
import { checkParkingAvailability, updateParkingAvailability } from "./parking.service"
import { eq, and, desc } from "drizzle-orm"


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
	const userReservations = await db.select({
		id: reservations.id,
		startTime: reservations.startTime,
		endTime: reservations.endTime,
		status: reservations.status,
		createdAt: reservations.createdAt,
		spotId: reservations.spotId,
		locationName: parkingLocations.name,
		locationAddress: parkingLocations.address,
		pricePerHour: parkingSpots.pricePerHour
	})
	.from(reservations)
	.innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
	.innerJoin(parkingLocations, eq(parkingSpots.locationId, parkingLocations.id))
	.where(eq(reservations.userId, userId))
	.orderBy(desc(reservations.startTime));

	return userReservations;
}

export async function cancelReservation(reservationId: string) {
	const reservation = await db.delete(reservations)
								.where(and(eq(reservations.id, reservationId)))
								.returning()
	if(!reservation[0]) return null

	const decrementSpot = await updateParkingAvailability(reservation[0].spotId, 0, 1)
	
	return decrementSpot ?? null
}