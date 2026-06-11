import { db } from "../db";
import { reservations } from "../schema/reservations";
import { parkingSpots } from "../schema/parkingSpots";
import { parkingLocations } from "../schema/parkingLocations";
import { checkParkingAvailability, updateParkingAvailability } from "./parking.service";
import { createPayment } from "./payment.service";
import { vehicles } from "../schema/vehicles";
import { eq, and, or, desc, inArray, ne } from "drizzle-orm";
import crypto from "crypto";
import { payments } from "../schema/payments";
import { reservationPayments } from "../schema/reservationPayments";
import { refundReservationFee } from "./wallet.service";
import { getCachedActiveReservation, setActiveReservationCache, invalidateActiveReservationCache } from "./cache/reservation-cache";

export async function reserveSpot(
  userId: string,
  spotId: string,
  vehicleId: string,
  startTime: Date,
  endTime: Date,
) {
  const isAvailable = await checkParkingAvailability(spotId);
  if (!isAvailable) return null;

  const qrToken = crypto.randomUUID();

  const response = await db
    .insert(reservations)
    .values({
      userId,
      spotId,
      vehicleId,
      startTime,
      endTime,
      qrToken,
      status: "RESERVED",
    })
    .returning()
    .then((r) => r[0]);

  if (!response) return null;

  if (response) {
    // Decrement available slots on reservation
    await updateParkingAvailability(spotId, 0, 1);
    await invalidateActiveReservationCache(userId);
  }

  return response;
}

/** Payment display status is derived only from reservations.status. */
export function paymentStatusFromReservation(
  reservationStatus: string | null | undefined,
) {
  return reservationStatus === "PAID" ? "PAID" : "PENDING";
}

function dedupeReservationRows<T extends Record<string, unknown>>(rows: T[]) {
  const unique = new Map<string, T>();

  for (const row of rows) {
    const id = row.id as string;
    if (!unique.has(id)) {
      unique.set(id, row);
    }
  }

  return Array.from(unique.values());
}

export async function getReservationPaymentInfo(reservationId: string) {
  const reservation = await db
    .select({ status: reservations.status })
    .from(reservations)
    .where(eq(reservations.id, reservationId))
    .limit(1)
    .then((r) => r[0]);

  const paymentStatus = paymentStatusFromReservation(reservation?.status);

  const gatewayPayment = await db
    .select()
    .from(payments)
    .where(eq(payments.reservationId, reservationId))
    .orderBy(desc(payments.createdAt))
    .limit(1)
    .then((r) => r[0]);

  const walletPayment = await db
    .select()
    .from(reservationPayments)
    .where(eq(reservationPayments.reservationId, reservationId))
    .orderBy(desc(reservationPayments.createdAt))
    .limit(1)
    .then((r) => r[0]);

  const amount =
    gatewayPayment?.amount || walletPayment?.amount || "0.00";

  return {
    paymentStatus,
    amount,
    status: reservation?.status || "UNKNOWN",
  };
}

export async function getUserReservations(userId: string) {
  const userReservations = await db
    .select({
      id: reservations.id,
      userId: reservations.userId,
      startTime: reservations.startTime,
      endTime: reservations.endTime,
      actualStartTime: reservations.actualStartTime,
      actualEndTime: reservations.actualEndTime,
      status: reservations.status,
      qrToken: reservations.qrToken,
      createdAt: reservations.createdAt,
      spotId: reservations.spotId,
      locationId: parkingSpots.locationId,
      locationName: parkingLocations.name,
      locationAddress: parkingLocations.address,
      locationGeom: parkingLocations.geom,
      pricePerHour: parkingSpots.pricePerHour,
      plateNumber: vehicles.plateNumber,
      carModel: vehicles.carModel,
      carColor: vehicles.color,
    })
    .from(reservations)
    .innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .innerJoin(
      parkingLocations,
      eq(parkingSpots.locationId, parkingLocations.id),
    )
    .innerJoin(vehicles, eq(reservations.vehicleId, vehicles.id))
    .where(eq(reservations.userId, userId))
    .orderBy(desc(reservations.startTime));

  return userReservations.map(enrichReservationRow).map(nestReservationFields);
}

export class ClerkAccessError extends Error {
  code: "FORBIDDEN_LOCATION" | "NO_LOCATION";

  constructor(
    message: string,
    code: "FORBIDDEN_LOCATION" | "NO_LOCATION",
  ) {
    super(message);
    this.name = "ClerkAccessError";
    this.code = code;
  }
}


/** Adds nested `spot`, `vehicle`, and `location` objects expected by the mobile app. */
function nestReservationFields<T extends Record<string, unknown>>(row: T) {
  return {
    ...row,
    vehicle: {
      plateNumber: row.plateNumber,
      carModel: row.carModel,
      carColor: row.carColor,
    },
    spot: {
      id: row.spotId,
      locationId: row.locationId,
      pricePerHour: row.pricePerHour,
      location: {
        id: row.locationId,
        name: row.locationName,
        geom: row.locationGeom,
      },
    },
  };
}

function enrichReservationRow<T extends Record<string, unknown>>(row: T) {
  const start = (row.actualStartTime || row.startTime) as Date | string;
  const end =
    row.actualEndTime ||
    (row.status === "ACTIVE" ? new Date() : row.endTime);

  const durationMs =
    new Date(end as Date | string).getTime() -
    new Date(start as Date | string).getTime();
  const hours = Math.max(0, durationMs / (1000 * 60 * 60));
  const pricePerHour = parseFloat(String(row.pricePerHour || "0"));
  const durationHours = Math.floor(hours);
  const durationMins = Math.round((hours - durationHours) * 60);
  const duration =
    durationHours > 0
      ? `${durationHours}h ${durationMins}m`
      : `${durationMins}m`;

  const paymentStatus = paymentStatusFromReservation(row.status as string);

  return {
    ...row,
    duration,
    accrued: (hours * pricePerHour).toFixed(2),
    paymentStatus,
  } as T & { duration: string; accrued: string; paymentStatus: string };
}

export async function getReservationLocationId(
  reservationId: string,
): Promise<string | null> {
  const row = await db
    .select({ locationId: parkingSpots.locationId })
    .from(reservations)
    .innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .where(eq(reservations.id, reservationId))
    .limit(1)
    .then((r) => r[0]);

  return row?.locationId ?? null;
}

export async function getReservationLocationIdByQrToken(
  qrToken: string,
): Promise<{ reservationId: string; locationId: string } | null> {
  const row = await db
    .select({
      reservationId: reservations.id,
      locationId: parkingSpots.locationId,
    })
    .from(reservations)
    .innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .where(eq(reservations.qrToken, qrToken))
    .limit(1)
    .then((r) => r[0]);

  if (!row) return null;
  return { reservationId: row.reservationId, locationId: row.locationId };
}

export async function assertEmployeeCanAccessReservation(
  assignedLocationId: string | null | undefined,
  reservationId: string,
) {
  if (!assignedLocationId) {
    throw new ClerkAccessError(
      "Clerk has no assigned location",
      "NO_LOCATION",
    );
  }

  const locationId = await getReservationLocationId(reservationId);
  if (!locationId || locationId !== assignedLocationId) {
    throw new ClerkAccessError(
      "Forbidden: Reservation belongs to a different parking location",
      "FORBIDDEN_LOCATION",
    );
  }
}

export async function getLocationSpotStats(locationId: string) {
  const spots = await db
    .select({
      totalSlots: parkingSpots.totalSlots,
      availableSlots: parkingSpots.availableSlots,
    })
    .from(parkingSpots)
    .where(eq(parkingSpots.locationId, locationId));

  return {
    totalSlots: spots.reduce((acc, spot) => acc + spot.totalSlots, 0),
    availableSlots: spots.reduce((acc, spot) => acc + spot.availableSlots, 0),
  };
}

export async function getReservationsByLocationId(
  locationId: string,
  filters?: { statuses?: string[]; paymentStatus?: string },
) {
  const conditions = [eq(parkingSpots.locationId, locationId)];

  if (filters?.statuses?.length) {
    conditions.push(inArray(reservations.status, filters.statuses));
  }

  if (filters?.paymentStatus) {
    const wantsPaid =
      filters.paymentStatus === "PAID" || filters.paymentStatus === "SUCCESS";
    conditions.push(
      wantsPaid
        ? eq(reservations.status, "PAID")
        : ne(reservations.status, "PAID"),
    );
  }

  const locationReservations = await db
    .select({
      id: reservations.id,
      startTime: reservations.startTime,
      endTime: reservations.endTime,
      actualStartTime: reservations.actualStartTime,
      actualEndTime: reservations.actualEndTime,
      status: reservations.status,
      qrToken: reservations.qrToken,
      createdAt: reservations.createdAt,
      spotId: reservations.spotId,
      locationId: parkingSpots.locationId,
      locationName: parkingLocations.name,
      locationAddress: parkingLocations.address,
      pricePerHour: parkingSpots.pricePerHour,
      plateNumber: vehicles.plateNumber,
      carModel: vehicles.carModel,
      carColor: vehicles.color,
    })
    .from(reservations)
    .innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .innerJoin(
      parkingLocations,
      eq(parkingSpots.locationId, parkingLocations.id),
    )
    .innerJoin(vehicles, eq(reservations.vehicleId, vehicles.id))
    .where(and(...conditions))
    .orderBy(desc(reservations.startTime));

  return dedupeReservationRows(locationReservations).map(enrichReservationRow);
}

export async function getActiveReservation(userId: string) {
  const cache = await getCachedActiveReservation(userId);
  if (cache) return cache;

  const active = await db
    .select({
      id: reservations.id,
      userId: reservations.userId,
      startTime: reservations.startTime,
      endTime: reservations.endTime,
      actualStartTime: reservations.actualStartTime,
      actualEndTime: reservations.actualEndTime,
      status: reservations.status,
      qrToken: reservations.qrToken,
      spotId: reservations.spotId,
      locationId: parkingSpots.locationId,
      locationName: parkingLocations.name,
      locationGeom: parkingLocations.geom,
      pricePerHour: parkingSpots.pricePerHour,
      plateNumber: vehicles.plateNumber,
      carModel: vehicles.carModel,
      carColor: vehicles.color,
    })
    .from(reservations)
    .innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .innerJoin(
      parkingLocations,
      eq(parkingSpots.locationId, parkingLocations.id),
    )
    .innerJoin(vehicles, eq(reservations.vehicleId, vehicles.id))
    .where(
      and(
        eq(reservations.userId, userId),
        or(
          eq(reservations.status, "RESERVED"),
          eq(reservations.status, "ACTIVE"),
        ),
      ),
    )
    .orderBy(desc(reservations.startTime))
    .limit(1);

  const result = active[0] ? nestReservationFields(enrichReservationRow(active[0])) : null;
  if (result) {
    await setActiveReservationCache(userId, result);
  }

  return result;
}

export async function getLatestReservationForUserAtLocation(
  userId: string,
  locationId: string,
) {
  const latest = await db
    .select({
      id: reservations.id,
      startTime: reservations.startTime,
      endTime: reservations.endTime,
      actualStartTime: reservations.actualStartTime,
      actualEndTime: reservations.actualEndTime,
      status: reservations.status,
      qrToken: reservations.qrToken,
      locationId: parkingSpots.locationId,
      locationName: parkingLocations.name,
      pricePerHour: parkingSpots.pricePerHour,
      plateNumber: vehicles.plateNumber,
      carModel: vehicles.carModel,
      carColor: vehicles.color,
    })
    .from(reservations)
    .innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .innerJoin(
      parkingLocations,
      eq(parkingSpots.locationId, parkingLocations.id),
    )
    .innerJoin(vehicles, eq(reservations.vehicleId, vehicles.id))
    .where(
      and(eq(reservations.userId, userId), eq(parkingSpots.locationId, locationId)),
    )
    .orderBy(desc(reservations.startTime))
    .limit(1);

  const result = latest[0];
  if (!result) return null;

  return enrichReservationRow(result);
}

export async function validateQRToken(
  token: string,
  returnUrl?: string,
  employeeId?: string,
  assignedLocationId?: string,
) {
  const response = await db
    .select()
    .from(reservations)
    .where(eq(reservations.qrToken, token))
    .limit(1)
    .then((r) => r[0]);

  const reservation = response;
  if (!reservation) throw new Error("Invalid QR Token");

  if (employeeId && assignedLocationId) {
    await assertEmployeeCanAccessReservation(
      assignedLocationId,
      reservation.id,
    );
  }

  if (reservation.status === "RESERVED") {
    return await startSession(reservation.id, employeeId, assignedLocationId);
  } else if (reservation.status === "ACTIVE") {
    return await completeSession(reservation.id, employeeId, assignedLocationId);
    // return await createPayment(token)
  } else if (reservation.status === "COMPLETED") {
    if (!reservation.actualStartTime || !reservation.actualEndTime) return null;
    return await createPayment(token, returnUrl);
  } else {
    throw new Error(`Reservation is already ${reservation.status}`);
  }
}

export async function startSession(
  reservationId: string,
  employeeId?: string,
  assignedLocationId?: string,
) {
  if (employeeId && assignedLocationId) {
    await assertEmployeeCanAccessReservation(
      assignedLocationId,
      reservationId,
    );
  }

  const updateData: any = {
    status: "ACTIVE",
    actualStartTime: new Date(),
  };
  if (employeeId) updateData.processedByEmployeeId = employeeId;

  const response = await db
    .update(reservations)
    .set(updateData)
    .where(eq(reservations.id, reservationId))
    .returning()
    .then((r) => r[0]);

  if (response) {
    await invalidateActiveReservationCache(response.userId);
  }

  return response || null;
}

export async function completeSession(
  reservationId: string,
  employeeId?: string,
  assignedLocationId?: string,
) {
  if (employeeId && assignedLocationId) {
    await assertEmployeeCanAccessReservation(
      assignedLocationId,
      reservationId,
    );
  }

  const updateData: any = {
    status: "COMPLETED",
    actualEndTime: new Date(),
  };
  if (employeeId) updateData.processedByEmployeeId = employeeId;

  const response = await db
    .update(reservations)
    .set(updateData)
    .where(eq(reservations.id, reservationId))
    .returning()
    .then((r) => r[0]);

  if (response) {
    // Restore parking availability when session is completed
    await updateParkingAvailability(response.spotId, 1, 0);
    await invalidateActiveReservationCache(response.userId);
  }

  return response || null;
}

export async function cancelReservation(reservationId: string) {
  return await db.transaction(async (tx) => {
    const reservation = await tx
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId))
      .then((r) => r[0]);

    if (!reservation) return null;

    const now = new Date();
    const createdAt = reservation.createdAt ? new Date(reservation.createdAt) : now;
    const isWithinRefundWindow =
      reservation.status === "RESERVED" &&
      now.getTime() - createdAt.getTime() <= 15 * 60 * 1000;

    let refundDetails = null;
    if (isWithinRefundWindow) {
      refundDetails = await refundReservationFee(reservationId, tx);
    }

    const cancelled = await tx
      .update(reservations)
      .set({ status: "CANCELLED" })
      .where(eq(reservations.id, reservationId))
      .returning()
      .then((r) => r[0]);

    if (!cancelled) return null;

    // Increment available slots on cancellation
    await updateParkingAvailability(cancelled.spotId, 1, 0);
    await invalidateActiveReservationCache(cancelled.userId);

    return {
      ...cancelled,
      refund: refundDetails
        ? { refunded: true, balance: refundDetails.balance }
        : null,
    };
  });
}

export async function extendReservation(
  reservationId: string,
  extraMinutes: number,
) {
  const current = await db
    .select({ endTime: reservations.endTime })
    .from(reservations)
    .where(eq(reservations.id, reservationId))
    .limit(1)
    .then((r) => r[0]);

  const reservation = current;
  if (!reservation) throw new Error("Reservation not found");

  const newEndTime = new Date(reservation.endTime);
  newEndTime.setMinutes(newEndTime.getMinutes() + extraMinutes);

  await db
    .update(reservations)
    .set({ endTime: newEndTime })
    .where(eq(reservations.id, reservationId))
    .returning()
    .then(async (r) => {
        if (r[0]) await invalidateActiveReservationCache(r[0].userId);
        return r;
    });

  return true;
}
