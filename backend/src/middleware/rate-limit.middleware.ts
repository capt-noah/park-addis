import { Request, Response, NextFunction } from "express";
import { isRateLimited } from "../services/cache/rate-limit";

export const rateLimitMiddleware = (action: string, limit: number, windowSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
        
        const limited = await isRateLimited(ip, action, limit, windowSeconds);
        
        if (limited) {
            return res.status(429).json({ error: "Too many requests, please try again later." });
        }
        
        next();
    };
};
