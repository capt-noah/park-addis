import { redis } from "../../redis";
import { cachedKeys } from "./cache-keys";

const TTL = 3600; // 1 hour for parking availability/nearby search

export async function getCachedNearbyParking(lat: number, lng: number, range: number) {
    try {
        const key = cachedKeys.nearByParking(lat, lng, range);
        return await redis.get(key);
    } catch (error) {
        console.error("Redis GetCachedNearbyParking Error:", error);
        return null;
    }
}

export async function setNearbyParkingCache(lat: number, lng: number, range: number, data: any) {
    try {
        const key = cachedKeys.nearByParking(lat, lng, range);
        await redis.set(key, data, { ex: TTL });
    } catch (error) {
        console.error("Redis SetNearbyParkingCache Error:", error);
    }
}

export async function getCachedParkingSearch(query: string) {
    try {
        const key = cachedKeys.searchParking(query);
        return await redis.get(key);
    } catch (error) {
        console.error("Redis GetCachedParkingSearch Error:", error);
        return null;
    }
}

export async function setParkingSearchCache(query: string, data: any) {
    try {
        const key = cachedKeys.searchParking(query);
        await redis.set(key, data, { ex: 300 }); // Short TTL (5 mins) for search results
    } catch (error) {
        console.error("Redis SetParkingSearchCache Error:", error);
    }
}

export async function clearAllNearbyParkingCache() {
    try {
        let cursor = "0";
        do {
            const [nextCursor, keys] = await redis.scan(cursor, { match: "nearby-parking:*", count: 100 });
            cursor = nextCursor;
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } while (cursor !== "0");
    } catch (error) {
        console.error("Redis ClearAllNearbyParkingCache Error:", error);
    }
}
