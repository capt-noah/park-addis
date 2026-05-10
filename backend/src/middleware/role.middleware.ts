import { Response, Request, NextFunction } from "express";

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

    if (!profile.shiftStartTime || !profile.shiftEndTime) {
        return res.status(403).json({ error: "Access Denied: No shifts assigned" });
    }

    // Check shift hours with overlap
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Simplistic string comparison for time: HH:MM:SS
    // shiftStartTime example: "08:00:00"
    const shiftStart = profile.shiftStartTime;
    const shiftEnd = profile.shiftEndTime;

    // To add overlap, let's parse time
    const [startH, startM] = shiftStart.split(':').map(Number);
    const [endH, endM] = shiftEnd.split(':').map(Number);

    const shiftStartMins = startH * 60 + startM;
    let shiftEndMins = endH * 60 + endM;
    
    if (shiftEndMins < shiftStartMins) {
        // Shift crosses midnight
        shiftEndMins += 24 * 60;
    }

    let currentMins = currentHour * 60 + currentMinute;
    // If current time is past midnight and shift crosses midnight
    if (shiftEndMins >= 24 * 60 && currentMins < shiftStartMins) {
        currentMins += 24 * 60;
    }

    // Allow 60 mins before shift and 60 mins after shift for overlap
    const OVERLAP_MINS = 60;

    if (currentMins < shiftStartMins - OVERLAP_MINS || currentMins > shiftEndMins + OVERLAP_MINS) {
        return res.status(403).json({ error: "Access Denied: Outside of active shift hours" });
    }

    // Assign to res.locals.employee so routes know it's an employee
    res.locals.employee = profile;

    next();
  } catch (err) {
    console.error("[isClerk Middleware] Error:", err);
    return res.status(500).json({ error: "Internal Server Error verifying clerk role" });
  }
}
