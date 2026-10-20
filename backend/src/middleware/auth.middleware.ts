import { Response, Request, NextFunction } from "express";
import { findUserBySession, findSession } from "../services/auth.service";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let sessionId = req.cookies?.sessionId;

    // Robust Fallback: Check Authorization Header (Bearer Token)
    if (!sessionId && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        sessionId = authHeader.substring(7).trim();
      }
    }

    if (!sessionId) {
      return res.status(401).json({
        error: "Authentication session required.",
        code: "UNAUTHORIZED",
      });
    }

    const session = await findSession(sessionId);
    if (!session || new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({
        error: "Your session has expired. Please log in again.",
        code: "SESSION_EXPIRED",
      });
    }

    const user = await findUserBySession(sessionId);
    if (!user) {
      return res.status(401).json({
        error: "Invalid session user.",
        code: "INVALID_SESSION",
      });
    }

    res.locals.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}
