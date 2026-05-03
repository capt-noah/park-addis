import { redis } from "../../redis";
import { cachedKeys } from "./cache-keys";

const TTL = 3600; // 1 hour

export async function getCachedActiveReservation(userId: string) {
    try {
        const key = cachedKeys.activeReservation(userId);
        return await redis.get(key);
    } catch (error) {
        console.error("Redis GetCachedActiveReservation Error:", error);
        return null;
    }
}

export async function setActiveReservationCache(userId: string, data: any) {
    try {
        const key = cachedKeys.activeReservation(userId);
        await redis.set(key, data, { ex: TTL });
    } catch (error) {
        console.error("Redis SetActiveReservationCache Error:", error);
    }
}

export async function invalidateActiveReservationCache(userId: string) {
    try {
        const key = cachedKeys.activeReservation(userId);
        await redis.del(key);
    } catch (error) {
        console.error("Redis InvalidateActiveReservationCache Error:", error);
    }
}
