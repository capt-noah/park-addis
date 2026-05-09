import express from "express";
import { getVehiclesByUserId } from "../services/cars.service";
import { authMiddleware } from "../middleware/auth.middleware";
import "../utils/logger";

const vehicleRouter = express.Router();

// 1. List user vehicles (session-based)
vehicleRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    console.log("[VEHICLE] GET / - Fetching vehicles for user:", userId);

    const vehicles = await getVehiclesByUserId(userId);
    console.log(
      "[VEHICLE] GET / - Retrieved",
      vehicles?.length || 0,
      "vehicles for user:",
      userId,
    );
    return res.status(200).json(vehicles);
  } catch (error: any) {
    console.log("[VEHICLE] GET / - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Backward compatibility
vehicleRouter.post("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("[VEHICLE] POST /user - Fetching vehicles for user:", userId);

    const vehicles = await getVehiclesByUserId(userId);
    console.log(
      "[VEHICLE] POST /user - Retrieved",
      vehicles?.length || 0,
      "vehicles for user:",
      userId,
    );
    return res.status(200).json(vehicles);
  } catch (error: any) {
    console.log("[VEHICLE] POST /user - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default vehicleRouter;
