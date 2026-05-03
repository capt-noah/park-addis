import { redis } from "../../redis";
import { cachedKeys } from "./cache-keys";

const TTL = 86400 * 7; // Routes can be cached for a long time (1 week)

export async function getCachedRoute(startLat: number, startLng: number, endLat: number, endLng: number) {
    try {
        const key = cachedKeys.route(startLat, startLng, endLat, endLng);
        return await redis.get(key);
    } catch (error) {
        console.error("Redis GetCachedRoute Error:", error);
        return null;
    }
}

export async function setRouteCache(startLat: number, startLng: number, endLat: number, endLng: number, data: any) {
    try {
        const key = cachedKeys.route(startLat, startLng, endLat, endLng);
        await redis.set(key, data, { ex: TTL });
    } catch (error) {
        console.error("Redis SetRouteCache Error:", error);
    }
}
