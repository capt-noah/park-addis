import express from "express";
import { getVehiclesByUserId } from "../services/cars.service";

const vehicleRouter = express.Router();

vehicleRouter.post("/user", async (req, res) => {
  const { userId } = req.body;
  const vehicles = await getVehiclesByUserId(userId);
  return res.status(200).json(vehicles);
});

export default vehicleRouter;
