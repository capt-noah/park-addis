import express from "express";
import {
  cancelReservation,
  completeSession,
  extendReservation,
  getActiveReservation,
  getUserReservations,
  reserveSpot,
  startSession,
  validateQRToken,
} from "../services/reservation.service";
import { authMiddleware } from "../middleware/auth.middleware";
import "../utils/logger";

const reservationRouter = express.Router();

// 1. Create Reservation
reservationRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { spotId, vehicleId, startTime, endTime } = req.body;
    const userId = res.locals.user.id;

    console.log("[RESERVATION] POST / - Creating reservation for user:", userId, "spot:", spotId);

    const start = new Date(startTime);
    const end = new Date(endTime);

    const reservedSpot = await reserveSpot(userId, spotId, vehicleId, start, end);
    if (!reservedSpot) {
      console.log("[RESERVATION] POST / - Failed to reserve spot:", spotId, "for user:", userId);
      return res.status(400).json({ error: "Unable to Reserve Parking Spot" });
    }

    console.log("[RESERVATION] POST / - Reservation created successfully for user:", userId);
    return res.status(200).json({ reservedSpot });
  } catch (error: any) {
    console.log("[RESERVATION] POST / - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error during reservation creation" });
  }
});

reservationRouter.post("/reserve", async (req, res) => {
  try {
    const { userId, spotId, vehicleId, startTime, endTime } = req.body;
    console.log("[RESERVATION] POST /reserve - Creating reservation for user:", userId, "spot:", spotId);

    const reservedSpot = await reserveSpot(userId, spotId, vehicleId, startTime, endTime);
    if (!reservedSpot) {
      console.log("[RESERVATION] POST /reserve - Failed to reserve spot:", spotId);
      return res.status(301).json({ error: "Unable to Reserve Parking Spot" });
    }

    console.log("[RESERVATION] POST /reserve - Reservation created successfully for user:", userId);
    return res.status(200).json({ reservedSpot });
  } catch (error: any) {
    console.log("[RESERVATION] POST /reserve - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. List User Reservations
reservationRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    console.log("[RESERVATION] GET / - Fetching reservations for user:", userId);

    const reservations = await getUserReservations(userId);
    if (!reservations) {
      console.log("[RESERVATION] GET / - No reservations found for user:", userId);
      return res.status(404).json({ error: "No Reservations Found" });
    }

    console.log(
      "[RESERVATION] GET / - Retrieved",
      reservations.length,
      "reservations for user:",
      userId,
    );
    return res.status(200).json({ reservations });
  } catch (error: any) {
    console.log("[RESERVATION] GET / - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error during reservation retrieval" });
  }
});

reservationRouter.post("/reservations", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("[RESERVATION] POST /reservations - Fetching reservations for user:", userId);

    const reservations = await getUserReservations(userId);
    if (!reservations) {
      console.log("[RESERVATION] POST /reservations - No reservations found for user:", userId);
      return res.status(301).json({ error: "No Reservations Found" });
    }

    console.log(
      "[RESERVATION] POST /reservations - Retrieved",
      reservations.length,
      "reservations for user:",
      userId,
    );
    return res.status(200).json({ reservations });
  } catch (error: any) {
    console.log("[RESERVATION] POST /reservations - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. Active Reservation
reservationRouter.get("/active", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    console.log("[RESERVATION] GET /active - Fetching active reservation for user:", userId);

    const active = await getActiveReservation(userId);
    if (!active) {
      console.log("[RESERVATION] GET /active - No active reservation for user:", userId);
      return res.status(200).json(null);
    }

    console.log("[RESERVATION] GET /active - Active reservation found for user:", userId);
    return res.status(200).json(active);
  } catch (error: any) {
    console.log("[RESERVATION] GET /active - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error during active reservation retrieval" });
  }
});

reservationRouter.post("/active", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("[RESERVATION] POST /active - Fetching active reservation for user:", userId);

    const active = await getActiveReservation(userId);
    if (!active) {
      console.log("[RESERVATION] POST /active - No active reservation for user:", userId);
      return res.status(200).json(null);
    }

    console.log("[RESERVATION] POST /active - Active reservation found for user:", userId);
    return res.status(200).json(active);
  } catch (error: any) {
    console.log("[RESERVATION] POST /active - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4. Cancel Reservation
reservationRouter.delete("/", authMiddleware, async (req, res) => {
  try {
    const reservationId =
      typeof req.query.id === "string"
        ? req.query.id
        : Array.isArray(req.query.id)
        ? req.query.id[0]
        : req.body?.reservationId;

    if (!reservationId) {
      console.log("[RESERVATION] DELETE / - Missing reservation ID");
      return res.status(400).json({ error: "Reservation ID is required" });
    }

    console.log("[RESERVATION] DELETE / - Cancelling reservation:", reservationId);
    const isCancelled = await cancelReservation(reservationId);
    if (!isCancelled) {
      console.log("[RESERVATION] DELETE / - Failed to cancel reservation:", reservationId);
      return res.status(404).json({ error: "Unable To Cancel Reservation" });
    }

    console.log("[RESERVATION] DELETE / - Reservation cancelled successfully:", reservationId);
    return res.status(200).json(isCancelled);
  } catch (error: any) {
    console.log("[RESERVATION] DELETE / - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error during reservation cancellation" });
  }
});

reservationRouter.post("/cancel", async (req, res) => {
  try {
    const { reservationId } = req.body;
    console.log("[RESERVATION] POST /cancel - Cancelling reservation:", reservationId);

    const isCancelled = await cancelReservation(reservationId);
    if (!isCancelled) {
      console.log("[RESERVATION] POST /cancel - Failed to cancel reservation:", reservationId);
      return res.status(301).json({ error: "Unable To Cancel Reservation" });
    }

    console.log("[RESERVATION] POST /cancel - Reservation cancelled successfully:", reservationId);
    return res.status(200).json({ isCancelled });
  } catch (error: any) {
    console.log("[RESERVATION] POST /cancel - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

reservationRouter.post("/validate", authMiddleware, async (req, res) => {
  try {
    const { qrToken } = req.body;
    const employeeId = res.locals.user?.id;
    console.log("[RESERVATION] POST /validate - Validating QR token by employee:", employeeId);

    const response = await validateQRToken(qrToken, undefined, employeeId);
    if (!response) {
      console.log("[RESERVATION] POST /validate - Invalid QR token");
      return res.status(401).json({ error: "Invalid Token" });
    }

    console.log("[RESERVATION] POST /validate - QR token validated successfully");
    return res.status(200).json(response);
  } catch (error: any) {
    console.log("[RESERVATION] POST /validate - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

reservationRouter.post("/start", authMiddleware, async (req, res) => {
  try {
    const { reservationId } = req.body;
    const employeeId = res.locals.user?.id;
    console.log("[RESERVATION] POST /start - Starting session for reservation:", reservationId);

    const response = await startSession(reservationId, employeeId);
    if (!response) {
      console.log("[RESERVATION] POST /start - Unable to start session:", reservationId);
      return res.status(401).json({ error: "Unable to Start Session" });
    }

    console.log("[RESERVATION] POST /start - Session started for reservation:", reservationId);
    return res.status(200).json(response);
  } catch (error: any) {
    console.log("[RESERVATION] POST /start - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

reservationRouter.post("/complete", authMiddleware, async (req, res) => {
  try {
    const { reservationId } = req.body;
    const employeeId = res.locals.user?.id;
    console.log("[RESERVATION] POST /complete - Completing session for reservation:", reservationId);

    const response = await completeSession(reservationId, employeeId);
    if (!response) {
      console.log("[RESERVATION] POST /complete - Unable to complete session:", reservationId);
      return res.status(401).json({ error: "Unable to Complete Session" });
    }

    console.log("[RESERVATION] POST /complete - Session completed for reservation:", reservationId);
    return res.status(200).json(response);
  } catch (error: any) {
    console.log("[RESERVATION] POST /complete - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 6. Extend Session
reservationRouter.post("/extend", async (req, res) => {
  try {
    const { reservationId, extraMinutes } = req.body;
    console.log("[RESERVATION] POST /extend - Extending reservation:", reservationId, "by", extraMinutes, "minutes");

    const success = await extendReservation(reservationId, extraMinutes);
    if (!success) {
      console.log("[RESERVATION] POST /extend - Unable to extend reservation:", reservationId);
      return res.status(400).json({ error: "Unable To Extend Reservation" });
    }

    console.log("[RESERVATION] POST /extend - Reservation extended:", reservationId);
    return res.status(200).json({ success });
  } catch (error: any) {
    console.log("[RESERVATION] POST /extend - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default reservationRouter;
