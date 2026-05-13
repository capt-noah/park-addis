import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { isClerk } from "../middleware/role.middleware";
import { registerAndSetupUser, validateEmployee, createSession, registerEmployee } from "../services/auth.service";
import { reserveSpot } from "../services/reservation.service";
import crypto from "crypto";
import { db } from "../db";
import { parkingSpots } from "../schema/parkingSpots";
import { eq } from "drizzle-orm";
import { reservations } from "../schema/reservations";
import { payments } from "../schema/payments";

const clerkRouter = express.Router();

// --- 0. Clerk Authentication (Public) ---

clerkRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await validateEmployee(email, password);

    if (!result) {
      return res.status(401).json({ error: "Invalid Clerk Credentials" });
    }

    const sessionId = await createSession(result.entity.id, "employee");

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ user: result.entity, sessionId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

clerkRouter.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, assignedLocationId, shiftStartTime, shiftEndTime } = req.body;
    const newEmployee = await registerEmployee(fullName, email, password, phoneNumber, assignedLocationId, shiftStartTime, shiftEndTime);
    
    const sessionId = await createSession(newEmployee.id, "employee");

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res.status(201).json({ user: newEmployee, sessionId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// --- Authenticated Routes ---
clerkRouter.use(authMiddleware);
clerkRouter.use(isClerk);

// POST /api/clerk/register-walkin
clerkRouter.post("/register-walkin", async (req, res) => {
  try {
    const { fullName, phoneNumber, plateNumber, carModel, color } = req.body;
    
    if (!phoneNumber || !plateNumber) {
        return res.status(400).json({ error: "Phone number and plate number are required" });
    }

    // Generate a placeholder email and password for walk-ins
    const email = `walkin_${Date.now()}@parkaddis.local`;
    const password = crypto.randomBytes(8).toString('hex');

    const result = await registerAndSetupUser(
      fullName || "Walk-in User",
      email,
      password,
      phoneNumber,
      "user",
      plateNumber,
      carModel || "Unknown",
      color || "Unknown"
    );

    if (!result) {
      return res.status(400).json({ error: "Failed to register walk-in user" });
    }

    return res.status(201).json({ 
        message: "Walk-in registered successfully", 
        user: result.user 
    });
  } catch (error: any) {
    console.error("[CLERK] /register-walkin Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/clerk/create-reservation
clerkRouter.post("/create-reservation", async (req, res) => {
  try {
    const { userId, vehicleId } = req.body;
    const clerkProfile = res.locals.employee;

    if (!userId || !vehicleId) {
        return res.status(400).json({ error: "userId and vehicleId are required" });
    }

    if (!clerkProfile.assignedLocationId) {
        return res.status(400).json({ error: "Clerk does not have an assigned location to create reservations in" });
    }

    const availableSpot = await db.select().from(parkingSpots)
        .where(eq(parkingSpots.locationId, clerkProfile.assignedLocationId))
        .limit(1)
        .then(r => r[0]);

    if (!availableSpot) {
        return res.status(400).json({ error: "No spots found for this location" });
    }

    const startTime = new Date();
    const endTime = new Date(Date.now() + 60 * 60 * 1000); 

    const reservation = await reserveSpot(userId, availableSpot.id, vehicleId, startTime, endTime);

    if (!reservation) {
        return res.status(400).json({ error: "Failed to create reservation (Location might be full)" });
    }

    return res.status(201).json({
        message: "Reservation created successfully",
        reservation
    });

  } catch (error: any) {
    console.error("[CLERK] /create-reservation Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/clerk/verify-payment
clerkRouter.post("/verify-payment", async (req, res) => {
    try {
        const { qrToken, reservationId } = req.body;

        if (!qrToken && !reservationId) {
            return res.status(400).json({ error: "qrToken or reservationId required" });
        }

        let reservation;
        if (qrToken) {
            reservation = await db.select().from(reservations).where(eq(reservations.qrToken, qrToken)).limit(1).then(r => r[0]);
        } else {
            reservation = await db.select().from(reservations).where(eq(reservations.id, reservationId)).limit(1).then(r => r[0]);
        }

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        const payment = await db.select().from(payments).where(eq(payments.reservationId, reservation.id)).limit(1).then(r => r[0]);

        return res.status(200).json({
            reservationId: reservation.id,
            status: reservation.status,
            paymentStatus: payment?.status || "PENDING",
            amount: payment?.amount || "0.00"
        });

    } catch (error: any) {
        console.error("[CLERK] /verify-payment Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default clerkRouter;
