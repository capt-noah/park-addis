import express from "express";
import {
  registerAndSetupUser,
  validateUser,
  createSession,
  deleteSession,
  toSafeUserDTO,
} from "../services/auth.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware";
import { sanitizeError } from "../utils/errors";
import "../utils/logger";

const authRouter = express.Router();

const isProduction = process.env.NODE_ENV === "production";

authRouter.post(
  "/register",
  rateLimitMiddleware("register", 5, 3600),
  async (req, res) => {
    try {
      console.log(
        "[AUTH] POST /register - New registration attempt for:",
        req.body?.email
      );

      const { fullName, email, password, phoneNumber, role, car } = req.body || {};

      if (!fullName || !email || !password || !phoneNumber) {
        return res.status(400).json({
          error: "Full name, email, password, and phone number are required.",
          code: "MISSING_REQUIRED_FIELDS",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long.",
          code: "WEAK_PASSWORD",
        });
      }

      const { plateNumber, carModel, color } = car || {};

      const result = await registerAndSetupUser(
        fullName.trim(),
        email.trim().toLowerCase(),
        password,
        phoneNumber.trim(),
        role || "user",
        plateNumber ? plateNumber.trim() : undefined,
        carModel ? carModel.trim() : undefined,
        color ? color.trim() : undefined
      );

      if (!result) {
        return res.status(400).json({
          error: "Unable to complete registration. Please check your details.",
          code: "REGISTRATION_FAILED",
        });
      }

      const { user, sessionId } = result;

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("[AUTH] POST /register - Successfully registered:", email);

      return res.status(201).json({
        ok: true,
        message: "User registered successfully.",
        user,
        sessionId,
      });
    } catch (error: any) {
      const sanitized = sanitizeError(error);
      console.error("[AUTH] POST /register - Registration Error:", error?.message || error);
      return res.status(sanitized.statusCode).json({
        error: sanitized.error,
        code: sanitized.code,
      });
    }
  }
);

authRouter.post(
  "/login",
  rateLimitMiddleware("login", 10, 900),
  async (req, res) => {
    try {
      console.log("[AUTH] POST /login - Login attempt for:", req.body?.email);
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required.",
          code: "MISSING_CREDENTIALS",
        });
      }

      const validationResult = await validateUser(
        String(email).trim(),
        String(password)
      );

      if (!validationResult) {
        console.log("[AUTH] POST /login - Invalid credentials for identifier:", email);
        return res.status(401).json({
          error: "Invalid email or password.",
          code: "INVALID_CREDENTIALS",
        });
      }

      const safeUser = validationResult.entity;
      const sessionId = await createSession(safeUser.id, validationResult.type);

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("[AUTH] POST /login - Successfully logged in:", email);

      return res.status(200).json({
        ok: true,
        user: safeUser,
        sessionId,
      });
    } catch (error: any) {
      const sanitized = sanitizeError(error);
      console.error("[AUTH] POST /login - Login Error:", error?.message || error);
      return res.status(sanitized.statusCode).json({
        error: sanitized.error,
        code: sanitized.code,
      });
    }
  }
);

authRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized access.",
        code: "UNAUTHORIZED",
      });
    }

    const safeUser = toSafeUserDTO(user);

    return res.status(200).json(safeUser);
  } catch (error: any) {
    const sanitized = sanitizeError(error);
    console.error("[AUTH] GET /me - Error:", error?.message || error);
    return res.status(sanitized.statusCode).json({
      error: sanitized.error,
      code: sanitized.code,
    });
  }
});

authRouter.get("/logout", async (req, res) => {
  try {
    let sessionId = req.cookies?.sessionId;
    if (!sessionId && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        sessionId = authHeader.substring(7);
      }
    }

    if (sessionId) {
      await deleteSession(sessionId);
    }

    res.clearCookie("sessionId", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isProduction,
    });

    return res.status(200).json({
      ok: true,
      message: "Logged out successfully.",
    });
  } catch (error: any) {
    const sanitized = sanitizeError(error);
    console.error("[AUTH] GET /logout - Logout Error:", error?.message || error);
    return res.status(sanitized.statusCode).json({
      error: sanitized.error,
      code: sanitized.code,
    });
  }
});

export default authRouter;
