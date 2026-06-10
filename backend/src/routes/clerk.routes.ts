import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { isClerk } from "../middleware/role.middleware";
import "../utils/logger";
import {
  registerAndSetupUser,
  validateEmployee,
  createSession,
  registerEmployee,
  findUserByEmail,
  findUserByPhone,
} from "../services/auth.service";
import {
  assertEmployeeCanAccessReservation,
  ClerkAccessError,
  getActiveReservation,
  getLatestReservationForUserAtLocation,
  getLocationSpotStats,
  getReservationPaymentInfo,
  getReservationsByLocationId,
  reserveSpot,
} from "../services/reservation.service";
import { parkingLocations } from "../schema/parkingLocations";
import crypto from "crypto";
import { db } from "../db";
import { parkingSpots } from "../schema/parkingSpots";
import { eq } from "drizzle-orm";
import { reservations } from "../schema/reservations";
const clerkRouter = express.Router();

// --- 0. Clerk Authentication (Public) ---

clerkRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[CLERK] POST /login - Attempting clerk login for:", email);
    const result = await validateEmployee(email, password);

    if (!result) {
      console.log("[CLERK] POST /login - Invalid credentials for:", email);
      return res.status(401).json({ error: "Invalid Clerk Credentials" });
    }

    const sessionId = await createSession(result.entity.id, "employee");

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    console.log("[CLERK] POST /login - Login successful for clerk:", result.entity.id);
    return res.status(200).json({ user: result.entity, sessionId });
  } catch (error: any) {
    console.log("[CLERK] POST /login - Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

clerkRouter.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      assignedLocationId,
      shiftStartTime,
      shiftEndTime,
    } = req.body;
    console.log("[CLERK] POST /register - Registering clerk:", email);
    const newEmployee = await registerEmployee(
      fullName,
      email,
      password,
      phoneNumber,
      assignedLocationId,
      shiftStartTime,
      shiftEndTime,
    );

    const sessionId = await createSession(newEmployee.id, "employee");

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    console.log("[CLERK] POST /register - Clerk registered:", newEmployee.id);
    return res.status(201).json({ user: newEmployee, sessionId });
  } catch (error: any) {
    console.log("[CLERK] POST /register - Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// --- Authenticated Routes ---
clerkRouter.use(authMiddleware);

clerkRouter.get("/me", async (req, res) => {
  try {
    const user = res.locals.user;
    console.log("[CLERK] GET /me - Fetching profile for:", user?.id);
    if (!user || user.userType !== "employee") {
      console.log("[CLERK] GET /me - Access denied, not an employee");
      return res.status(403).json({ error: "Access Denied: Clerks Only" });
    }

    let locationName: string | null = null;
    if (user.assignedLocationId) {
      const location = await db
        .select({ name: parkingLocations.name })
        .from(parkingLocations)
        .where(eq(parkingLocations.id, user.assignedLocationId))
        .limit(1)
        .then((r) => r[0]);
      locationName = location?.name ?? null;
    }

    console.log("[CLERK] GET /me - Profile loaded for clerk:", user.id);
    return res.status(200).json({
      user: {
        ...user,
        locationName,
      },
    });
  } catch (error: any) {
    console.log("[CLERK] GET /me - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

clerkRouter.use(isClerk);

clerkRouter.get("/sessions", async (req, res) => {
  try {
    const clerk = res.locals.employee;
    console.log(
      "[CLERK] GET /sessions - Fetching sessions for clerk:",
      clerk.id,
      "location:",
      clerk.assignedLocationId,
    );

    if (!clerk.assignedLocationId) {
      console.log("[CLERK] GET /sessions - Clerk has no assigned location:", clerk.id);
      return res
        .status(400)
        .json({ error: "Clerk has no assigned location" });
    }

    const statusParam = req.query.status
      ? String(req.query.status).trim()
      : undefined;
    const paymentStatusParam = req.query.paymentStatus
      ? String(req.query.paymentStatus).trim()
      : undefined;

    const statuses = statusParam
      ? statusParam.split(",").map((value) => value.trim()).filter(Boolean)
      : undefined;

    const locationReservations = await getReservationsByLocationId(
      clerk.assignedLocationId,
      {
        statuses,
        paymentStatus: paymentStatusParam,
      },
    );

    const location = await db
      .select({
        id: parkingLocations.id,
        name: parkingLocations.name,
      })
      .from(parkingLocations)
      .where(eq(parkingLocations.id, clerk.assignedLocationId))
      .limit(1)
      .then((r) => r[0]);

    const locationStats = await getLocationSpotStats(clerk.assignedLocationId);
    const activeSessions = locationReservations.filter(
      (reservation) =>
        reservation.status === "ACTIVE" || reservation.status === "RESERVED",
    ).length;

    console.log(
      "[CLERK] GET /sessions - Retrieved",
      locationReservations.length,
      "reservations for location:",
      clerk.assignedLocationId,
    );
    return res.status(200).json({
      reservations: locationReservations,
      locationId: location?.id ?? clerk.assignedLocationId,
      locationName: location?.name ?? null,
      locationStats: {
        ...locationStats,
        activeSessions,
      },
    });
  } catch (error: any) {
    console.log("[CLERK] GET /sessions - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 0.5 Clerk User Lookup (Authenticated) ---
clerkRouter.get("/search-user", async (req, res) => {
  try {
    const email = req.query.email ? String(req.query.email).trim() : undefined;
    const phoneNumber = req.query.phoneNumber
      ? String(req.query.phoneNumber).trim()
      : undefined;

    console.log(
      "[CLERK] GET /search-user - Searching by",
      email ? `email: ${email}` : `phone: ${phoneNumber}`,
    );

    if (!email && !phoneNumber) {
      console.log("[CLERK] GET /search-user - Missing email or phoneNumber");
      return res
        .status(400)
        .json({ error: "Provide email or phoneNumber to search" });
    }

    const user = email
      ? await findUserByEmail(email)
      : await findUserByPhone(phoneNumber as string);

    if (!user) {
      console.log(
        "[CLERK] GET /search-user - No user found for",
        email || phoneNumber,
      );
      return res.status(404).json({ error: "User not found" });
    }

    const clerkProfile = res.locals.employee;
    let reservation =
      (await getActiveReservation(user.id)) as {
        id: string;
        locationId?: string;
        status?: string;
        qrToken?: string;
        plateNumber?: string;
        paymentStatus?: string;
      } | null;

    if (!reservation && clerkProfile.assignedLocationId) {
      reservation = (await getLatestReservationForUserAtLocation(
        user.id,
        clerkProfile.assignedLocationId,
      )) as typeof reservation;
    }

    let locationMismatch = false;

    if (
      reservation &&
      clerkProfile.assignedLocationId &&
      reservation.locationId &&
      reservation.locationId !== clerkProfile.assignedLocationId
    ) {
      console.log(
        "[CLERK] GET /search-user - Reservation location mismatch for user:",
        user.id,
      );
      locationMismatch = true;
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;

    console.log(
      "[CLERK] GET /search-user - User found:",
      user.id,
      "reservation:",
      reservation?.id || "none",
      "status:",
      reservation?.status || "none",
    );

    return res.status(200).json({
      user: safeUser,
      activeReservation: locationMismatch ? null : reservation,
      locationMismatch,
    });
  } catch (error: any) {
    console.log("[CLERK] GET /search-user - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/clerk/register-walkin
clerkRouter.post("/register-walkin", async (req, res) => {
  try {
    const { fullName, phoneNumber, plateNumber, carModel, color } = req.body;
    console.log(
      "[CLERK] POST /register-walkin - Registering walk-in:",
      phoneNumber,
      plateNumber,
    );

    if (!phoneNumber || !plateNumber) {
      return res
        .status(400)
        .json({ error: "Phone number and plate number are required" });
    }

    // Generate a placeholder email and password for walk-ins
    const email = `walkin_${Date.now()}@parkaddis.local`;
    const password = crypto.randomBytes(8).toString("hex");

    const result = await registerAndSetupUser(
      fullName || "Walk-in User",
      email,
      password,
      phoneNumber,
      "user",
      plateNumber,
      carModel || "Unknown",
      color || "Unknown",
    );

    if (!result) {
      console.log("[CLERK] POST /register-walkin - Registration failed");
      return res.status(400).json({ error: "Failed to register walk-in user" });
    }

    console.log(
      "[CLERK] POST /register-walkin - Walk-in registered:",
      result.user.id,
    );
    return res.status(201).json({
      message: "Walk-in registered successfully",
      user: result.user,
    });
  } catch (error: any) {
    console.log("[CLERK] POST /register-walkin - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/clerk/create-reservation
clerkRouter.post("/create-reservation", async (req, res) => {
  try {
    const { userId, vehicleId } = req.body;
    const clerkProfile = res.locals.employee;
    console.log(
      "[CLERK] POST /create-reservation - Creating reservation for user:",
      userId,
      "vehicle:",
      vehicleId,
    );

    if (!userId || !vehicleId) {
      return res
        .status(400)
        .json({ error: "userId and vehicleId are required" });
    }

    if (!clerkProfile.assignedLocationId) {
      return res
        .status(400)
        .json({
          error:
            "Clerk does not have an assigned location to create reservations in",
        });
    }

    const availableSpot = await db
      .select()
      .from(parkingSpots)
      .where(eq(parkingSpots.locationId, clerkProfile.assignedLocationId))
      .limit(1)
      .then((r) => r[0]);

    if (!availableSpot) {
      return res
        .status(400)
        .json({ error: "No spots found for this location" });
    }

    const startTime = new Date();
    const endTime = new Date(Date.now() + 60 * 60 * 1000);

    const reservation = await reserveSpot(
      userId,
      availableSpot.id,
      vehicleId,
      startTime,
      endTime,
    );

    if (!reservation) {
      console.log("[CLERK] POST /create-reservation - Failed for user:", userId);
      return res
        .status(400)
        .json({
          error: "Failed to create reservation (Location might be full)",
        });
    }

    console.log(
      "[CLERK] POST /create-reservation - Reservation created:",
      reservation.id,
    );
    return res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error: any) {
    console.log("[CLERK] POST /create-reservation - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/clerk/verify-payment
clerkRouter.post("/verify-payment", async (req, res) => {
  try {
    const { qrToken, reservationId } = req.body;
    console.log(
      "[CLERK] POST /verify-payment - Verifying payment for",
      qrToken ? `qrToken: ${qrToken}` : `reservationId: ${reservationId}`,
    );

    if (!qrToken && !reservationId) {
      console.log("[CLERK] POST /verify-payment - Missing qrToken or reservationId");
      return res
        .status(400)
        .json({ error: "qrToken or reservationId required" });
    }

    let reservation;
    if (qrToken) {
      reservation = await db
        .select()
        .from(reservations)
        .where(eq(reservations.qrToken, qrToken))
        .limit(1)
        .then((r) => r[0]);
    } else {
      reservation = await db
        .select()
        .from(reservations)
        .where(eq(reservations.id, reservationId))
        .limit(1)
        .then((r) => r[0]);
    }

    if (!reservation) {
      console.log("[CLERK] POST /verify-payment - Reservation not found");
      return res.status(404).json({ error: "Reservation not found" });
    }

    const clerkProfile = res.locals.employee;
    try {
      await assertEmployeeCanAccessReservation(
        clerkProfile.assignedLocationId,
        reservation.id,
      );
    } catch (error: any) {
      if (error instanceof ClerkAccessError) {
        console.log(
          "[CLERK] POST /verify-payment - Location access denied:",
          error.message,
        );
        return res.status(403).json({ error: error.message });
      }
      throw error;
    }

    const paymentInfo = await getReservationPaymentInfo(reservation.id);

    console.log(
      "[CLERK] POST /verify-payment - Reservation:",
      reservation.id,
      "reservationStatus:",
      paymentInfo.status,
      "paymentStatus:",
      paymentInfo.paymentStatus,
      "amount:",
      paymentInfo.amount,
    );

    return res.status(200).json({
      reservationId: reservation.id,
      status: paymentInfo.status,
      paymentStatus: paymentInfo.paymentStatus,
      amount: paymentInfo.amount,
    });
  } catch (error: any) {
    console.log("[CLERK] POST /verify-payment - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default clerkRouter;
