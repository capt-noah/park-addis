import express from "express";
import { registerAndSetupUser, validateUser, createSession } from "../services/auth.service";
import { authMiddleware } from "../middleware/auth.middleware";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
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

    if (!result) return res.status(400).json({ error: "Unable To Create User" });

    const { user, sessionId } = result;

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res.status(201).json({ ok: true, message: "User Created Successfully", sessionId });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await validateUser(email, password);

  if (!user) return res.status(401).json({ error: "Invalid Credentials" });

  const sessionId = await createSession(user.id);

  res.cookie("sessionId", sessionId, { 
    httpOnly: true, 
    sameSite: "lax", 
    path: "/" 
  });

  return res.status(200).json({ user, sessionId });
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

authRouter.get("/logout", (req, res) => {
  res.clearCookie("sessionId", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({ ok: true, message: "Logged out successfully" });
});

export default authRouter;
