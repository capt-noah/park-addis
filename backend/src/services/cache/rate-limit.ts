import { redis } from "../../redis";
import { cachedKeys } from "./cache-keys";

export async function isRateLimited(ip: string, action: string, limit: number, windowSeconds: number) {
    try {
        const key = cachedKeys.rateLimit(ip, action);
        
        const count = await redis.incr(key);
        
        if (count === 1) {
            await redis.expire(key, windowSeconds);
        }
        
        return count > limit;
    } catch (error) {
        console.error("Redis IsRateLimited Error:", error);
        return false; // Fail open: allow the request if Redis is down
    }
}
