import express from "express";
import {
  registerUserAndCar,
  validateUser,
  createSession,
} from "../services/auth.service";
import { authMiddleware } from "@/backend/src/middleware/auth.middleware";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { fullName, email, password, phoneNumber, role, car } = req.body;
  const { plateNumber, carModel, color } = car;

  const user = await registerUserAndCar(
    fullName,
    email,
    password,
    phoneNumber,
    role,
    plateNumber,
    carModel,
    color,
  );

  if (!user) res.status(301).json({ error: "Unable To Create User" });

  const sessionId = await createSession(user.id);

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
  });
  return res.status(201).json({ message: "User Created Successfully" });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await validateUser(email, password);

  if (!user) return res.status(401).json({ error: "Invalid Credentials" });

  const sessionId = await createSession(user.id);

  res.cookie("sessionId", sessionId, { httpOnly: true, sameSite: "lax" });

  return res.status(200).json({ user });
});

authRouter.get("/me", authMiddleware, async (req, res) => {
  const user = res.locals.user;

  if (!user) res.status(401).json({ error: "Unauthorized User" });

  return res.status(200).json({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });
});

export default authRouter;
