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
import { parkingSpots } from "../schema/parkingSpots";
import { vehicles } from "../schema/vehicles";
import { adminNotifications } from "../schema/adminNotifications";
import { eq, desc, count, sum, sql, and, ilike, inArray } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validateAdmin, createSession, registerAdmin } from "../services/auth.service";
import "../utils/logger";

const adminRouter = express.Router();

// --- 0. Admin Authentication (Public) ---

adminRouter.post("/login", async (req, res) => {
  const { email } = req.body;
  console.log("[ADMIN] POST /login - Attempting admin login for:", email);
  try {
    const { password } = req.body;
    const result = await validateAdmin(email, password);

    if (!result) {
      console.log("[ADMIN] POST /login - Invalid credentials for:", email);
      return res.status(401).json({ error: "Invalid Admin Credentials" });
    }

    const sessionId = await createSession(result.entity.id, "admin");

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    console.log("[ADMIN] POST /login - Login successful for admin:", result.entity.id);
    return res.status(200).json({ user: result.entity, sessionId });
  } catch (error: any) {
    console.error("[ADMIN] POST /login - Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

adminRouter.post("/register", async (req, res) => {
  const { email } = req.body;
  console.log("[ADMIN] POST /register - Registering admin:", email);
  try {
    const { fullName, password, phoneNumber } = req.body;
    const newAdmin = await registerAdmin(fullName, email, password, phoneNumber);
    
    const sessionId = await createSession(newAdmin.id, "admin");

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    console.log("[ADMIN] POST /register - Registration successful for admin:", newAdmin.id);
    return res.status(201).json({ user: newAdmin, sessionId });
  } catch (error: any) {
    console.error("[ADMIN] POST /register - Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// --- Authenticated Routes ---
adminRouter.use(authMiddleware);
adminRouter.use(isAdmin);

// --- 1. Global Statistics ---
adminRouter.get("/stats", async (req, res) => {
  console.log("[ADMIN] GET /stats - Fetching statistics for admin:", res.locals.user.id);
  try {
    const totalUsersResult = await db.select({ value: count() }).from(users).where(eq(users.role, "user"));
    const activeSessionsResult = await db.select({ value: count() }).from(reservations).where(eq(reservations.status, "ACTIVE"));
    const totalRevenueResult = await db.select({ value: sum(payments.amount) }).from(payments).where(eq(payments.status, "SUCCESS"));
    const clerksOnDutyResult = await db.select({ value: count() }).from(employees).where(and(eq(employees.role, "employee"), eq(employees.status, "ACTIVE")));

    // Calculate recent revenue (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days including today
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentPayments = await db.select({
      amount: payments.amount,
      createdAt: payments.createdAt
    }).from(payments)
    .where(and(eq(payments.status, "SUCCESS"), sql`${payments.createdAt} >= ${sevenDaysAgo.toISOString()}`));

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueDataMap: Record<string, { revenue: number, lastWeek: number, order: number }> = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      revenueDataMap[dayName] = { 
        revenue: 0, 
        lastWeek: Math.floor(Math.random() * 2000) + 1000, // mock last week for visual comparison
        order: 6 - i
      };
    }

    recentPayments.forEach(p => {
      if (p.createdAt) {
        const day = days[new Date(p.createdAt).getDay()];
        if (revenueDataMap[day]) {
          revenueDataMap[day].revenue += Number(p.amount);
        }
      }
    });

    const revenueData = Object.keys(revenueDataMap)
      .map(name => ({ name, ...revenueDataMap[name] }))
      .sort((a, b) => a.order - b.order)
      .map(({ name, revenue, lastWeek }) => ({ name, revenue, lastWeek }));

    // Top locations
    const locationsData = await db.select({
      name: parkingLocations.name,
      resCount: count(reservations.id)
    })
    .from(parkingLocations)
    .leftJoin(parkingSpots, eq(parkingLocations.id, parkingSpots.locationId))
    .leftJoin(reservations, eq(parkingSpots.id, reservations.spotId))
    .groupBy(parkingLocations.id, parkingLocations.name)
    .orderBy(desc(count(reservations.id)))
    .limit(3);

    const maxCount = locationsData.length > 0 ? Number(locationsData[0].resCount) : 1;
    const topLocations = locationsData.map((loc, index) => ({
      name: loc.name,
      score: maxCount > 0 ? Math.round((Number(loc.resCount) / maxCount) * 100) : 0,
      rank: `0${index + 1}`
    }));

    console.log("[ADMIN] GET /stats - Stats compiled successfully");
    return res.status(200).json({
      totalUsers: totalUsersResult[0]?.value || 0,
      activeSessions: activeSessionsResult[0]?.value || 0,
      totalRevenue: totalRevenueResult[0]?.value || "0.00",
      clerksOnDuty: clerksOnDutyResult[0]?.value || 0,
      revenueData,
      topLocations
    });
  } catch (error: any) {
    console.error("[ADMIN] GET /stats - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 2. Employee (Clerk) Management ---
adminRouter.get("/clerks", async (req, res) => {
  console.log("[ADMIN] GET /clerks - Fetching clerks list");
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

    console.log("[ADMIN] GET /clerks - Clerks fetched:", clerksData.length);
    return res.status(200).json(clerksData);
  } catch (error: any) {
    console.error("[ADMIN] GET /clerks - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.post("/clerks", async (req, res) => {
  const { email } = req.body;
  console.log("[ADMIN] POST /clerks - Creating clerk onboarding for:", email);
  try {
    const { fullName, password, phoneNumber, assignedLocationId, shiftStartTime, shiftEndTime } = req.body;
    
    if (!fullName || !email || !password || !shiftStartTime || !shiftEndTime) {
        console.log("[ADMIN] POST /clerks - Missing required fields for clerk creation");
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

    console.log("[ADMIN] POST /clerks - Clerk created successfully with ID:", newEmployee.id);
    return res.status(201).json({ message: "Employee created successfully", clerk: newEmployee });
  } catch (error: any) {
    console.error("[ADMIN] POST /clerks - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.put("/clerks/:id", async (req, res) => {
  const clerkId = req.params.id;
  console.log("[ADMIN] PUT /clerks/:id - Updating clerk status/hours details for ID:", clerkId);
  try {
    const { assignedLocationId, shiftStartTime, shiftEndTime, status } = req.body;
      
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (assignedLocationId !== undefined) updateData.assignedLocationId = assignedLocationId;
    if (shiftStartTime !== undefined) updateData.shiftStartTime = shiftStartTime;
    if (shiftEndTime !== undefined) updateData.shiftEndTime = shiftEndTime;
    
    if (Object.keys(updateData).length > 0) {
      await db.update(employees).set(updateData).where(eq(employees.id, clerkId));
    }

    console.log("[ADMIN] PUT /clerks/:id - Clerk updated successfully:", clerkId, updateData);
    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error: any) {
    console.error("[ADMIN] PUT /clerks/:id - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 3. Location Management ---
adminRouter.get("/locations", async (req, res) => {
  console.log("[ADMIN] GET /locations - Fetching locations list");
  try {
    const locs = await db.select({
      id: parkingLocations.id,
      name: parkingLocations.name,
      address: parkingLocations.address,
      createdAt: parkingLocations.createdAt,
      pricePerHour: parkingSpots.pricePerHour,
      totalSlots: parkingSpots.totalSlots,
      lat: sql<number>`ST_Y(${parkingLocations.geom}::geometry)`,
      lng: sql<number>`ST_X(${parkingLocations.geom}::geometry)`,
    })
    .from(parkingLocations)
    .leftJoin(parkingSpots, eq(parkingLocations.id, parkingSpots.locationId))
    .orderBy(desc(parkingLocations.createdAt));

    console.log("[ADMIN] GET /locations - Locations fetched:", locs.length);
    return res.status(200).json(locs);
  } catch (error: any) {
    console.error("[ADMIN] GET /locations - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.put("/locations/:id", async (req, res) => {
  const locationId = req.params.id;
  console.log("[ADMIN] PUT /locations/:id - Updating location details for ID:", locationId);
  try {
    const { name, address, lat, lng, pricePerHour, totalSlots } = req.body;
    
    // Update parkingLocations
    const locationUpdate: any = {};
    if (name !== undefined) locationUpdate.name = name;
    if (address !== undefined) locationUpdate.address = address;
    
    if (lat !== undefined && lng !== undefined) {
      await db.execute(sql`
        UPDATE parking_locations
        SET geom = ST_POINT(${Number(lng)}, ${Number(lat)}, 4326)::GEOGRAPHY
        WHERE id = ${locationId}
      `);
    }
    
    if (Object.keys(locationUpdate).length > 0) {
      await db.update(parkingLocations).set(locationUpdate).where(eq(parkingLocations.id, locationId));
    }
    
    // Update parkingSpots
    const spotUpdate: any = {};
    if (pricePerHour !== undefined) spotUpdate.pricePerHour = pricePerHour.toString();
    if (totalSlots !== undefined) {
      const slots = Number(totalSlots);
      spotUpdate.totalSlots = slots;
      spotUpdate.availableSlots = slots; // reset available slots to match updated total slots
    }
    
    if (Object.keys(spotUpdate).length > 0) {
      await db.update(parkingSpots).set(spotUpdate).where(eq(parkingSpots.locationId, locationId));
    }

    console.log("[ADMIN] PUT /locations/:id - Location updated successfully:", locationId);
    return res.status(200).json({ message: "Location updated successfully" });
  } catch (error: any) {
    console.error("[ADMIN] PUT /locations/:id - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.post("/locations", async (req, res) => {
  const { name } = req.body;
  console.log("[ADMIN] POST /locations - Creating location named:", name);
  try {
    const { address, lat, lng, pricePerHour, totalSlots } = req.body;
    
    if (!name || !address || !lat || !lng || !pricePerHour || !totalSlots) {
      console.log("[ADMIN] POST /locations - Missing required fields for location creation");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Use PostGIS geography point for proper geo support
    const [newLocation] = await db.execute(sql`
      INSERT INTO parking_locations(name, address, geom)
      VALUES(${name}, ${address}, ST_POINT(${Number(lng)}, ${Number(lat)}, 4326)::GEOGRAPHY)
      RETURNING id, name, address
    `);

    const slots = Number(totalSlots);
    const newSpot = await db.insert(parkingSpots).values({
      locationId: (newLocation as any).id,
      pricePerHour: pricePerHour.toString(),
      totalSlots: slots,
      availableSlots: slots,
    }).returning().then(r => r[0]);

    console.log("[ADMIN] POST /locations - Location created successfully with ID:", (newLocation as any).id);
    return res.status(201).json({ message: "Location created successfully", location: newLocation, spot: newSpot });
  } catch (error: any) {
    console.error("[ADMIN] POST /locations - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 4. Global Reservations ---
adminRouter.get("/reservations", async (req, res) => {
  const statusFilter = req.query.status as string;
  console.log("[ADMIN] GET /reservations - Fetching reservations, status filter:", statusFilter || "NONE");
  try {
    let query = db.select({
      id: reservations.id,
      userId: reservations.userId,
      userFullName: users.fullName,
      vehicleId: reservations.vehicleId,
      vehicleType: vehicles.carModel,
      vehiclePlate: vehicles.plateNumber,
      startTime: reservations.startTime,
      endTime: reservations.endTime,
      status: reservations.status,
      locationName: parkingLocations.name,
      processedByEmployeeName: employees.fullName,
      createdAt: reservations.createdAt
    })
    .from(reservations)
    .leftJoin(users, eq(reservations.userId, users.id))
    .leftJoin(vehicles, eq(reservations.vehicleId, vehicles.id))
    .leftJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .leftJoin(parkingLocations, eq(parkingSpots.locationId, parkingLocations.id))
    .leftJoin(employees, eq(reservations.processedByEmployeeId, employees.id))
    .orderBy(desc(reservations.createdAt))
    .$dynamic();
    
    if (statusFilter) {
      query = query.where(eq(reservations.status, statusFilter as any));
    }

    const allReservations = await query.limit(100);
    console.log("[ADMIN] GET /reservations - Reservations loaded:", allReservations.length);
    return res.status(200).json(allReservations);
  } catch (error: any) {
    console.error("[ADMIN] GET /reservations - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --- 4. Profile & Notifications ---
adminRouter.put("/profile", async (req, res) => {
  const adminId = res.locals.user.id;
  console.log("[ADMIN] PUT /profile - Updating admin profile for ID:", adminId);
  try {
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

    console.log("[ADMIN] PUT /profile - Admin profile updated successfully for ID:", adminId);
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error: any) {
    console.error("[ADMIN] PUT /profile - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.get("/notifications", async (req, res) => {
  console.log("[ADMIN] GET /notifications - Fetching alerts list");
  try {
    const alerts = await db.select().from(adminNotifications).orderBy(desc(adminNotifications.createdAt)).limit(50);
    console.log("[ADMIN] GET /notifications - Alerts fetched:", alerts.length);
    return res.status(200).json(alerts);
  } catch (error: any) {
    console.error("[ADMIN] GET /notifications - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.put("/notifications/read", async (req, res) => {
  const { notificationIds } = req.body;
  console.log("[ADMIN] PUT /notifications/read - Marking notifications read:", notificationIds);
  try {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        console.log("[ADMIN] PUT /notifications/read - Missing or empty notificationIds array");
        return res.status(400).json({ error: "notificationIds array is required" });
    }

    await db.update(adminNotifications).set({ isRead: true }).where(inArray(adminNotifications.id, notificationIds));

    console.log("[ADMIN] PUT /notifications/read - Marked successfully:", notificationIds.length);
    return res.status(200).json({ message: "Notifications marked as read" });
  } catch (error: any) {
    console.error("[ADMIN] PUT /notifications/read - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default adminRouter;