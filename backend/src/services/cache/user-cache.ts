import { redis } from "../../redis";
import { cachedKeys } from "./cache-keys"; 

const TTL = 86400

export async function getCachedUser(userId: string) {
    try {
        const key = cachedKeys.user(userId)
        return await redis.get(key)
    } catch (error) {
        console.error("Redis GetCachedUser Error:", error);
        return null;
    }
}

export async function setuserCache(userId: string, value: unknown) {
    try {
        const key = cachedKeys.user(userId)
        await redis.set(key, value, {
            ex: TTL
        })
    } catch (error) {
        console.error("Redis SetUserCache Error:", error);
    }
}