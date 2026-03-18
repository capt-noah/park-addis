import { db } from "../db";
import { parkingLocations } from "../schema/parkingLocations";
import { sql, eq, gt } from "drizzle-orm";
import { parkingSpots } from "../schema/parkingSpots";


export async function createParkingLocation( name: string, address: string, coor: { lng: number, lat: number } ) {
    const response = await db.execute(sql`
            INSERT INTO parking_locations(name, address, geom)
            VALUES(
                ${name}, 
                ${address},
                ST_POINT(${coor.lng}, ${coor.lat}, 4326)::GEOGRAPHY
                )
            RETURNING(id, name, address)
        `)
    
    return response[0] ?? null
}

export async function getParkingLocationsWithinRange(range: number, coor: {lng: number, lat: number}) {
    const response = await db.execute(sql`
            SELECT  id,
                    name,
                    address,
                    ratings_sum,
                    ratings_count,
                    display_price_per_hour,
                    ST_Y(geom::geometry) AS lat,
                    ST_X(geom::geometry) AS lng,
                    ST_Distance(geom, ST_Point(${coor.lng}, ${coor.lat}, 4326)::GEOGRAPHY) AS distance, 
                    ST_Distance(geom, ST_Point(${coor.lng}, ${coor.lat}, 4326)::GEOGRAPHY) / 5 / 100 AS eta
            FROM parking_locations
            WHERE ST_DWithin(geom, ST_Point(${coor.lng}, ${coor.lat}, 4326)::GEOGRAPHY, ${range})
        `)
    
    return response ?? null
}

export async function getParkingLocation(id: string) {
    const parkingLocation = await db.select()
                                    .from(parkingLocations)
                                    .where(eq(parkingLocations.id, id))

    return parkingLocation[0] ?? null
}

export async function getParkingSpot(spotId: string) {
    const parkingSpot = await db.select()
                                .from(parkingSpots)
                                .where(eq(parkingSpots.id, spotId))

    return parkingSpot[0] ?? null
}

export async function getParkingSpotFromLocationId(locationId: string) {
    const spot = await db.select().from(parkingSpots).where(eq(parkingSpots.locationId, locationId))

    return spot[0] ?? null
}

export async function checkParkingAvailability(spotId: string) {
    const parkingSpot = await db.select()
                                .from(parkingSpots)
                                .where(eq(parkingSpots.id, spotId) && gt(parkingSpots.availableSlots, 0))

    return parkingSpot[0] ?? null
}

export async function updateParkingAvailability(spotId: string, inc: number, dec: number) {
    const updatedSlot = await db.update(parkingSpots)
                                .set({ availableSlots: sql`${parkingSpots.availableSlots} + ${inc} - ${dec}` })
                                .where(eq(parkingSpots.id, spotId))
                                .returning()
                                
    return updatedSlot[0] ?? null
}