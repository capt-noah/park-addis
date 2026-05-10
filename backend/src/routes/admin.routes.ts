import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/role.middleware";
import { db } from "../db";
import { users } from "../schema/users";
import { employees } from "../schema/employees";
import { admins } from "../schema/admins";
import { reservations } from "../schema/reservations";
import { payments } from "../schema/payments";
import { parkingLocations } from "../schema/parkingLocations";
import { adminNotifications } from "../schema/adminNotifications";
import { eq, desc, count, sum, sql, and, ilike, inArray } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";

const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(isAdmin);

// --- 1. Global Statistics ---
adminRouter.get("/stats", async (req, res) => {
  try {
    const totalUsersResult = await db.select({ value: count() }).from(users).where(eq(users.role, "user"));
    const activeSessionsResult = await db.select({ value: count() }).from(reservations).where(eq(reservations.status, "ACTIVE"));
    const totalRevenueResult = await db.select({ value: sum(payments.amount) }).from(payments).where(eq(payments.status, "SUCCESS"));
    const clerksOnDutyResult = await db.select({ value: count() }).from(employees).where(and(eq(employees.role, "employee"), eq(employees.status, "ACTIVE")));

    return res.status(200).json({
      totalUsers: totalUsersResult[0]?.value || 0,
      activeSessions: activeSessionsResult[0]?.value || 0,
      totalRevenue: totalRevenueResult[0]?.value || "0.00",
      clerksOnDuty: clerksOnDutyResult[0]?.value || 0,
    });
  } catch (error: any) {
    console.error("[ADMIN] /stats Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 2. Employee (Clerk) Management ---
adminRouter.get("/clerks", async (req, res) => {
  try {
    const clerksData = await db.select({
      id: employees.id,
      fullName: employees.fullName,
      email: employees.email,
      phoneNumber: employees.phoneNumber,
      status: employees.status,
      assignedLocationId: employees.assignedLocationId,
      shiftStartTime: employees.shiftStartTime,
      shiftEndTime: employees.shiftEndTime,
      locationName: parkingLocations.name
    })
    .from(employees)
    .leftJoin(parkingLocations, eq(employees.assignedLocationId, parkingLocations.id))
    .where(eq(employees.role, "employee"))
    .orderBy(desc(employees.createdAt));

    return res.status(200).json(clerksData);
  } catch (error: any) {
    console.error("[ADMIN] /clerks Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.post("/clerks", async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, assignedLocationId, shiftStartTime, shiftEndTime } = req.body;
    
    if (!fullName || !email || !password || !shiftStartTime || !shiftEndTime) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newEmployee = await db.insert(employees).values({
      fullName,
      email,
      passwordHash,
      phoneNumber: phoneNumber || crypto.randomBytes(4).toString('hex'), // temp phone if not provided
      role: "employee",
      status: "ACTIVE",
      assignedLocationId: assignedLocationId || null,
      shiftStartTime,
      shiftEndTime
    }).returning().then(r => r[0]);

    return res.status(201).json({ message: "Employee created successfully", clerk: newEmployee });
  } catch (error: any) {
    console.error("[ADMIN] POST /clerks Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.put("/clerks/:id", async (req, res) => {
  try {
    const { assignedLocationId, shiftStartTime, shiftEndTime, status } = req.body;
    const clerkId = req.params.id;
      
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (assignedLocationId !== undefined) updateData.assignedLocationId = assignedLocationId;
    if (shiftStartTime !== undefined) updateData.shiftStartTime = shiftStartTime;
    if (shiftEndTime !== undefined) updateData.shiftEndTime = shiftEndTime;
    
    if (Object.keys(updateData).length > 0) {
      await db.update(employees).set(updateData).where(eq(employees.id, clerkId));
    }

    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error: any) {
    console.error("[ADMIN] PUT /clerks Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 3. Global Reservations ---
adminRouter.get("/reservations", async (req, res) => {
  try {
    const statusFilter = req.query.status as string;
    
    let query = db.select().from(reservations).orderBy(desc(reservations.createdAt));
    
    if (statusFilter) {
      // @ts-ignore
      query = db.select().from(reservations).where(eq(reservations.status, statusFilter)).orderBy(desc(reservations.createdAt));
    }

    const allReservations = await query.limit(100);
    return res.status(200).json(allReservations);
  } catch (error: any) {
    console.error("[ADMIN] /reservations Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 4. Profile & Notifications ---
adminRouter.put("/profile", async (req, res) => {
  try {
    const adminId = res.locals.user.id;
    const { fullName, email, password } = req.body;

    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length > 0) {
      await db.update(admins).set(updateData).where(eq(admins.id, adminId));
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("[ADMIN] PUT /profile Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.get("/notifications", async (req, res) => {
  try {
    const alerts = await db.select().from(adminNotifications).orderBy(desc(adminNotifications.createdAt)).limit(50);
    return res.status(200).json(alerts);
  } catch (error: any) {
    console.error("[ADMIN] GET /notifications Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.put("/notifications/read", async (req, res) => {
  try {
    const { notificationIds } = req.body;
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return res.status(400).json({ error: "notificationIds array is required" });
    }

    await db.update(adminNotifications).set({ isRead: true }).where(inArray(adminNotifications.id, notificationIds));

    return res.status(200).json({ message: "Notifications marked as read" });
  } catch (error: any) {
    console.error("[ADMIN] PUT /notifications/read Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default adminRouter;
