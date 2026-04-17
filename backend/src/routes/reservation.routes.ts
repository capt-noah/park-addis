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

const reservationRouter = express.Router();

// 1. Create Reservation
reservationRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { spotId, vehicleId, startTime, endTime } = req.body;
    const userId = res.locals.user.id;

    const start = new Date(startTime);
    const end = new Date(endTime);

    const reservedSpot = await reserveSpot(
      userId,
      spotId,
      vehicleId,
      start,
      end,
    );
    if (!reservedSpot)
      return res.status(400).json({ error: "Unable to Reserve Parking Spot" });
    return res.status(200).json({ reservedSpot });
  } catch (error) {
    console.error("Create reservation error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error during reservation creation" });
  }
});

reservationRouter.post("/reserve", async (req, res) => {
  const { userId, spotId, vehicleId, startTime, endTime } = req.body;
  const reservedSpot = await reserveSpot(
    userId,
    spotId,
    vehicleId,
    startTime,
    endTime,
  );
  if (!reservedSpot)
    return res.status(301).json({ error: "Unable to Reserve Parking Spot" });
  return res.status(200).json({ reservedSpot });
});

// 2. List User Reservations
reservationRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const reservations = await getUserReservations(userId);
    if (!reservations)
      return res.status(404).json({ error: "No Reservations Found" });
    return res.status(200).json({ reservations });
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
  return res.status(200).json({ reservations });
});

// 3. Active Reservation
reservationRouter.get("/active", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const active = await getActiveReservation(userId);
    if (!active) return res.status(200).json(null);
    return res.status(200).json(active);
  } catch (error) {
    console.error("Get active reservation error:", error);
    return res
      .status(500)
      .json({
        error: "Internal Server Error during active reservation retrieval",
      });
  }
});

reservationRouter.post("/active", async (req, res) => {
  const { userId } = req.body;
  const active = await getActiveReservation(userId);
  if (!active) return res.status(200).json(null);
  return res.status(200).json(active);
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
