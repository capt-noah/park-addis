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

    const reservedSpot = await reserveSpot(
      userId,
      spotId,
      vehicleId,
      start,
      end,
    );
    if (!reservedSpot) {
      console.log("[RESERVATION] POST / - Failed to reserve spot:", spotId, "for user:", userId);
      return res.status(400).json({ error: "Unable to Reserve Parking Spot" });
    }
    console.log("[RESERVATION] POST / - Reservation created successfully for user:", userId);
    return res.status(200).json({ reservedSpot });
  } catch (error: any) {
    console.log("[RESERVATION] POST / - Error:", error.message);
    return res
      .status(500)
  try {
    const { userId, spotId, vehicleId, startTime, endTime } = req.body;
    console.log("[RESERVATION] POST /reserve - Creating reservation for user:", userId, "spot:", spotId);
    
    const reservedSpot = await reserveSpot(
      userId,
      spotId,
      vehicleId,
      startTime,
      endTime,
    );
    if (!reservedSpot) {
      console.log("[RESERVATION] POST /reserve - Failed to reserve spot:", spotId);
      return res.status(301).json({ error: "Unable to Reserve Parking Spot" });
    }
    console.log("[RESERVATION] POST /reserve - Reservation created successfully for user:", userId);
    return res.status(200).json({ reservedSpot });
  } catcole.log("[RESERVATION] GET / - Fetching reservations for user:", userId);
    
    const reservations = await getUserReservations(userId);
    if (!reservations) {
      console.log("[RESERVATION] GET / - No reservations found for user:", userId);
      return res.status(404).json({ error: "No Reservations Found" });
    }
    console.log("[RESERVATION] GET / - Retrieved", reservations.length, "reservations for user:", userId);
    return res.status(200).json({ reservations });
  } catch (error: any) {
    console.log("[RESERVATION] GET / - Error:", error.message
  if (!reservedSpot)
    return res.status(301).json({ error: "Unable to Reserve Parking Spot" });
  return res.status(200).json({ reservedSpot });
});

// 2. List User Reservations
reservationRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("[RESERVATION] POST /reservations - Fetching reservations for user:", userId);
    
    const reservations = await getUserReservations(userId);
    if (!reservations) {
      console.log("[RESERVATION] POST /reservations - No reservations found for user:", userId);
      return res.status(301).json({ error: "No Reservations Found" });
    }
    console.log("[RESERVATION] POST /reservations - Retrieved", reservations.length, "reservations for user:", userId);
    return res.status(200).json({ reservations });
  } catcole.log("[RESERVATION] GET /active - Fetching active reservation for user:", userId);
    
    const active = await getActiveReservation(userId);
    if (!active) {
      console.log("[RESERVATION] GET /active - No active reservation for user:", userId);
      return res.status(200).json(null);
    }
    console.log("[RESERVATION] GET /active - Active reservation found for user:", userId);
    return res.status(200).json(active);
  } catch (error: any) {
    console.log("[RESERVATION] GET /active - Error:", error.message
  } catch (error) {
    console.error("List reservations error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error during reservation retrieval" });
  }
});

reservationRouter.post("/reservations", async (req, res) => {
  const { userId } = req.body;
  const reservations = await getUserReservations(userId);
  if (!reservations)
    return res.status(301).json({ error: "No Reservations Found" });
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
reservationRouter.get("/active", authMiddleware, async (req, res) => {
  try {
    coconsole.log("[RESERVATION] DELETE / - Missing reservation ID");
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
    console.log("[RESERVATION] DELETE / - Error:", error.message
        error: "Internal Server Error during active reservation retrieval",
      });
  }
});

reservationRouter.post("/active", async (req, res) => {
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
  try {
    const { qrToken } = req.body;
    console.log("[RESERVATION] POST /validate - Validating QR token");
    
    const response = await validateQRToken(qrToken);
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

export default reservationRoutertry {
    const reservationId =
      typeof req.query.id === "string"
        ? req.query.id
        : Array.isArray(req.query.id)
          ? req.query.id[0]
          : req.body?.reservationId;

    if (!reservationId) {
      return res.status(400).json({ error: "Reservation ID is required" });
    }

    const isCancelled = await cancelReservation(reservationId);
    if (!isCancelled)
      return res.status(404).json({ error: "Unable To Cancel Reservation" });
    return res.status(200).json(isCancelled);
  } catch (error: any) {
    console.error("Cancel reservation error:", error);
    return res
      .status(500)
      .json({
        error:
          error?.message ||
          "Internal Server Error during reservation cancellation",
      });
  }
});

reservationRouter.post("/cancel", async (req, res) => {
  const { reservationId } = req.body;
  const isCancelled = await cancelReservation(reservationId);
  if (!isCancelled)
    return res.status(301).json({ error: "Unable To Cancel Reservation" });
  return res.status(200).json({ isCancelled });
});

// 5. Validation and Session Management
reservationRouter.post("/validate", async (req, res) => {
  const { qrToken } = req.body;
  const response = await validateQRToken(qrToken);
  if (!response) return res.status(401).json({ error: "Invalid Token" });
  return res.status(200).json(response);
});

reservationRouter.post("/start", async (req, res) => {
  const { reservationId } = req.body;
  const response = await startSession(reservationId);
  if (!response)
    return res.status(401).json({ error: "Unable to Start Session" });
  return res.status(200).json(response);
});

reservationRouter.post("/complete", async (req, res) => {
  const { reservationId } = req.body;
  const response = await completeSession(reservationId);
  if (!response)
    return res.status(401).json({ error: "Unable to Complete Session" });
  return res.status(200).json(response);
});

// 6. Extend Session
reservationRouter.post("/extend", async (req, res) => {
  const { reservationId, extraMinutes } = req.body;
  const success = await extendReservation(reservationId, extraMinutes);
  if (!success)
    return res.status(400).json({ error: "Unable To Extend Reservation" });
  return res.status(200).json({ success });
});

export default reservationRouter;
