import express from "express";
import {
  registerAndSetupUser,
  validateUser,
  createSession,
  deleteSession,
} from "../services/auth.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware";
import "../utils/logger";

const authRouter = express.Router();

authRouter.post(
  "/register",
  rateLimitMiddleware("register", 5, 3600),
  async (req, res) => {
    try {
      console.log(
        "[AUTH] POST /register - New registration attempt from:",
        req.body.email,
      );
      const { fullName, email, password, phoneNumber, role, car } = req.body;
      const { plateNumber, carModel, color } = car || {};

      const result = await registerAndSetupUser(
        fullName,
        email,
        password,
        phoneNumber,
        role,
        plateNumber,
        carModel,
        color,
      );

      if (!result) {
        console.log(
          "[AUTH] POST /register - Registration failed for email:",
          email,
        );
        return res.status(400).json({ error: "Unable To Create User" });
      }

      const { user, sessionId } = result;

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });

      console.log(
        "[AUTH] POST /register - User registered successfully:",
        email,
      );
      return res
        .status(201)
        .json({ ok: true, message: "User Created Successfully", sessionId });
    } catch (error: any) {
      console.log("[AUTH] POST /register - Registration Error:", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Internal Server Error" });
    }
  },
);

authRouter.post(
  "/login",
  rateLimitMiddleware("login", 10, 900),
  async (req, res) => {
    try {
      console.log("[AUTH] POST /login - Login attempt from:", req.body.email);
      const { email, password } = req.body;
      const validationResult = await validateUser(email, password);

      if (!validationResult) {
        console.log(
          "[AUTH] POST /login - Invalid credentials for email:",
          email,
        );
        return res.status(401).json({ error: "Invalid Credentials" });
      }

      const sessionId = await createSession(validationResult.entity.id, validationResult.type);

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });

      console.log("[AUTH] POST /login - User logged in successfully:", email);
      return res.status(200).json({ user: validationResult.entity, sessionId });
    } catch (error: any) {
      console.log("[AUTH] POST /login - Login Error:", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Internal Server Error" });
    }
  },
);

authRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("[AUTH] GET /me - Fetching current user info");
    const user = res.locals.user;

    if (!user) {
      console.log("[AUTH] GET /me - Unauthorized access attempt");
      return res.status(401).json({ error: "Unauthorized User" });
    }

    console.log("[AUTH] GET /me - User info retrieved for:", user.email);
    // User already has passwordHash stripped from auth service
    return res.status(200).json(user);
  } catch (error: any) {
    console.log("[AUTH] GET /me - Error:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

authRouter.get("/logout", async (req, res) => {
  try {
    console.log("[AUTH] GET /logout - User logout request");
    let sessionId = req.cookies?.sessionId;
    if (!sessionId && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) sessionId = authHeader.substring(7);
    }

    if (sessionId) {
      await deleteSession(sessionId);
      console.log("[AUTH] GET /logout - Session deleted");
    }

    res.clearCookie("sessionId", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    console.log("[AUTH] GET /logout - User logged out successfully");
    return res
      .status(200)
      .json({ ok: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.log("[AUTH] GET /logout - Logout Error:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
});

export default authRouter;
