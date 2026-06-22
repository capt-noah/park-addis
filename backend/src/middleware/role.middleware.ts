import { Response, Request, NextFunction } from "express";

const OVERLAP_MINS = 0;

export function checkClerkShift(profile: {
  shiftStartTime?: string | null;
  shiftEndTime?: string | null;
}): { ok: true } | { ok: false; error: string } {
  if (!profile.shiftStartTime || !profile.shiftEndTime) {
    return { ok: false, error: "Access Denied: No shifts assigned" };
  }

  const now = new Date();
  // Get the precise current hour and minute in Addis Ababa timezone
  const timeString = now.toLocaleTimeString("en-US", {
    timeZone: "Africa/Addis_Ababa",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
  
  const [curH, curM] = timeString.split(":").map(Number);
  const currentHour = curH === 24 ? 0 : curH;
  const currentMinute = curM;

  const [startH, startM] = profile.shiftStartTime.split(":").map(Number);
  const [endH, endM] = profile.shiftEndTime.split(":").map(Number);

  const shiftStartMins = startH * 60 + startM;
  let shiftEndMins = endH * 60 + endM;

  if (shiftEndMins < shiftStartMins) {
    shiftEndMins += 24 * 60;
  }

  let currentMins = currentHour * 60 + currentMinute;
  if (shiftEndMins >= 24 * 60 && currentMins < shiftStartMins) {
    currentMins += 24 * 60;
  }

  if (
    currentMins < shiftStartMins - OVERLAP_MINS ||
    currentMins > shiftEndMins + OVERLAP_MINS
  ) {
    console.log(`[Shift Guard] Failed for ${profile.shiftStartTime}-${profile.shiftEndTime}. Server Addis Time is ${currentHour}:${currentMinute}.`);
    return {
      ok: false,
      error: "Access Denied: Outside of active shift hours",
    };
  }

  return { ok: true };
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  if (!user || user.userType !== "admin") {
    return res.status(403).json({ error: "Access Denied: Admins Only" });
  }
  next();
}

export async function isClerk(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;
  
  if (!user || user.userType !== "employee") {
    return res.status(403).json({ error: "Access Denied: Clerks Only" });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({ error: "Access Denied: Employee account is suspended or on break" });
  }

  try {
    const profile = user;

    const shiftCheck = checkClerkShift(profile);
    if (!shiftCheck.ok) {
      return res.status(403).json({ error: shiftCheck.error });
    }

    // Assign to res.locals.employee so routes know it's an employee
    res.locals.employee = profile;

    next();
  } catch (err) {
    console.error("[isClerk Middleware] Error:", err);
    return res.status(500).json({ error: "Internal Server Error verifying clerk role" });
  }
}
