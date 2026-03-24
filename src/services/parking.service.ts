import { db } from "../db";
import { parkingLocations } from "../schema/parkingLocations";
import { sql, eq, gt, and } from "drizzle-orm";
import { parkingSpots } from "../schema/parkingSpots";

import { GeoJSONFeature } from "@/types/geojson";


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
                        SELECT
                            JSON_BUILD_OBJECT(
                                'type', 'FeatureCollection',
                                'features', JSON_AGG(
                                JSON_BUILD_OBJECT(
                                    'type', 'Feature',
                                    'geometry', ST_AsGeoJson(geom)::json,
                                    'properties', JSON_BUILD_OBJECT(
                                        'id', id,
                                        'name', name,
                                        'address', address,
                                        'ratingsSum', ratings_sum,
                                        'ratingsCount', ratings_count,
                                        'ratings', ratings_sum / ratings_count,
                                        'price', display_price_per_hour,
                                        'distance', ST_Distance(geom, ST_Point(${coor.lng}, ${coor.lat}, 4326)::GEOGRAPHY),
                                        'eta', ST_Distance(geom, ST_Point(${coor.lng}, ${coor.lat}, 4326)::GEOGRAPHY) / 5 / 100 
                                    )
                                )
                                )
                            ) AS GeoJson
                        FROM parking_locations
                        WHERE ST_DWithin(geom, ST_Point(${coor.lng}, ${coor.lat}, 4326)::GEOGRAPHY, ${range})
                    `)
    
    return response[0]?.geojson ?? null
}

export async function getParkingLocation(id: string) {
    const parkingLocation = await db.select()
                                    .from(parkingLocations)
                                    .where(eq(parkingLocations.id, id))

    return parkingLocation[0] ?? null
}

export async function getParkingLocationsJson() {
    const geoJson = await db.execute(sql`
        SELECT 
              id,
              name,
              address,
              ST_AsGeoJson(geom)::JSON AS geometry
        FROM parking_locations
        `)
    
    return geoJson ?? null
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
                                .where(and(eq(parkingSpots.id, spotId), gt(parkingSpots.availableSlots, 0)))

    return parkingSpot[0] ?? null
}

export async function updateParkingAvailability(spotId: string, inc: number, dec: number) {
    const updatedSlot = await db.update(parkingSpots)
                                .set({ availableSlots: sql`${parkingSpots.availableSlots} + ${inc} - ${dec}` })
                                .where(eq(parkingSpots.id, spotId))
                                .returning()
                                
    return updatedSlot[0] ?? null
}