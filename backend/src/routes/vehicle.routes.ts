import express from "express";
import { getVehiclesByUserId } from "../services/cars.service";
import { authMiddleware } from "../middleware/auth.middleware";

const vehicleRouter = express.Router();

// 1. List user vehicles (session-based)
vehicleRouter.get("/", authMiddleware, async (req, res) => {
  const userId = res.locals.user.id;
  const vehicles = await getVehiclesByUserId(userId);
  return res.status(200).json(vehicles);
});

// 2. Backward compatibility
vehicleRouter.post("/user", async (req, res) => {
  const { userId } = req.body;
  const vehicles = await getVehiclesByUserId(userId);
  return res.status(200).json(vehicles);
});

export default vehicleRouter;
