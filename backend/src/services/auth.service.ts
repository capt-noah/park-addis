import { users } from "../schema/users";
import { vehicles } from "../schema/vehicles";
import { sessions } from "../schema/sessions";
import { db } from "../db";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { wallets } from "../schema/wallets";
import { employees } from "../schema/employees";
import { admins } from "../schema/admins";

import { getCachedUser, setuserCache } from "./cache/user-cache";

import Decimal from "decimal.js";

export async function registerAndSetupUser(
  fullName: string,
  email: string,
  password: string,
  phoneNumber: string,
  role: string,
  plateNumber: string,
  carModel: string,
  color: string,
) {
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db.transaction(async (tx) => {
    // 1. Create User
    const userArr = await tx
      .insert(users)
      .values({ fullName, email, passwordHash, phoneNumber, role })
      .returning();
    const user = userArr[0];

    // 2. Conditional Vehicle Creation (only if driver and plate provided)
    if (role === "driver" && plateNumber) {
      await tx
        .insert(vehicles)
        .values({ userId: user.id, plateNumber, carModel, color })
        .returning();
    }

    // 3. Create Wallet
    const balance = new Decimal("0").toString();
    await tx.insert(wallets).values({ userId: user.id, balance }).returning();

    // 4. Create Session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionArr = await tx
      .insert(sessions)
      .values({ userId: user.id, expiresAt })
      .returning();

    if (user) {
      const { passwordHash, ...userWithoutPassword } = user;
      await setuserCache(user.id, userWithoutPassword);
    }

    return { user, sessionId: sessionArr[0].id };
  });

  return result;
}

export async function registerEmployee(
  fullName: string,
  email: string,
  password: string,
  phoneNumber: string,
  assignedLocationId?: string,
  shiftStartTime?: string,
  shiftEndTime?: string,
) {
  const passwordHash = await bcrypt.hash(password, 10);
  const employeeArr = await db
    .insert(employees)
    .values({
      fullName,
      email,
      passwordHash,
      phoneNumber,
      assignedLocationId,
      shiftStartTime,
      shiftEndTime,
      role: "employee",
      status: "ACTIVE",
    })
    .returning();

  return employeeArr[0];
}

export async function registerAdmin(
  fullName: string,
  email: string,
  password: string,
  phoneNumber: string,
) {
  const passwordHash = await bcrypt.hash(password, 10);
  const adminArr = await db
    .insert(admins)
    .values({ fullName, email, passwordHash, phoneNumber, role: "admin" })
    .returning();

  return adminArr[0];
}

export async function registerVehicle(
  userId: string,
  plateNumber: string,
  carModel: string,
  color: string,
) {
  const car = await db
    .insert(vehicles)
    .values({ userId, plateNumber, carModel, color })
    .returning();

  return car[0];
}

export async function findUserByEmail(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email));
  return user[0] ?? null;
}

export async function findUserByPhone(phoneNumber: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.phoneNumber, phoneNumber));
  return user[0] ?? null;
}

export async function findUserByEmailOrPhone(payload: {
  email?: string;
  phoneNumber?: string;
}) {
  if (payload.email) return findUserByEmail(payload.email);
  if (payload.phoneNumber) return findUserByPhone(payload.phoneNumber);
  return null;
}

export async function findUserById(userId: string) {
  const cache = await getCachedUser(userId);

  if (cache) return cache;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((r) => r[0]);

  if (user) {
    const { passwordHash, ...userWithoutPassword } = user;
    await setuserCache(userId, userWithoutPassword);
  }

  return user ?? null;
}

/**
 * Validates a Driver/Standard User. ONLY checks the 'users' table.
 */
export async function validateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return false;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (isValid) return { entity: user, type: "user" as const };

  return false;
}

/**
 * Validates an Employee/Clerk. ONLY checks the 'employees' table.
 */
export async function validateEmployee(email: string, password: string) {
  const employee = await db
    .select()
    .from(employees)
    .where(eq(employees.email, email))
    .then((r) => r[0]);
  if (!employee) return false;

  const isValid = await bcrypt.compare(password, employee.passwordHash);
  if (isValid) return { entity: employee, type: "employee" as const };

  return false;
}

/**
 * Validates a System Admin. ONLY checks the 'admins' table.
 */
export async function validateAdmin(email: string, password: string) {
  const admin = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .then((r) => r[0]);
  if (!admin) return false;

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (isValid) return { entity: admin, type: "admin" as const };

  return false;
}

export async function createSession(
  id: string,
  type: "user" | "employee" | "admin" = "user",
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const payload: any = { expiresAt };
  if (type === "user") payload.userId = id;
  else if (type === "employee") payload.employeeId = id;
  else if (type === "admin") payload.adminId = id;

  const session = await db.insert(sessions).values(payload).returning();

  return session[0].id;
}

export async function deleteSession(sessionId: string) {
  const isDeleted = await db.delete(sessions).where(eq(sessions.id, sessionId));
  return isDeleted ?? false;
}

export async function findSession(id: string) {
  const userSession = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, id));

  return userSession[0] ?? null;
}

export async function findUserBySession(id: string) {
  const userSession = await findSession(id);

  if (!userSession) return false;

  if (userSession.userId) {
    const user = await findUserById(userSession.userId);
    return user ? { ...user, userType: "user" } : false;
  } else if (userSession.employeeId) {
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, userSession.employeeId))
      .then((r) => r[0]);
    if (employee) {
      const { passwordHash, ...employeeWithoutPassword } = employee;
      return { ...employeeWithoutPassword, userType: "employee" };
    }
  } else if (userSession.adminId) {
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.id, userSession.adminId))
      .then((r) => r[0]);
    if (admin) {
      const { passwordHash, ...adminWithoutPassword } = admin;
      return { ...adminWithoutPassword, userType: "admin" };
    }
  }

  return false;
}
