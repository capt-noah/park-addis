import { db } from "../db";
import { reservations } from "../schema/reservations";
import { parkingSpots } from "../schema/parkingSpots";
import { parkingLocations } from "../schema/parkingLocations";
import {
  checkParkingAvailability,
  updateParkingAvailability,
} from "./parking.service";
import { createPayment } from "./payment.service";
import { vehicles } from "../schema/vehicles";
import { eq, and, or, desc } from "drizzle-orm";
import crypto from "crypto";
import { payments } from "../schema/payments";
import { refundReservationFee } from "./wallet.service";

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

  // Decrement available slots on reservation
  await updateParkingAvailability(spotId, 0, 1);

  return response;
}

export async function getUserReservations(userId: string) {
  const userReservations = await db
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
      locationName: parkingLocations.name,
      locationAddress: parkingLocations.address,
      pricePerHour: parkingSpots.pricePerHour,
      plateNumber: vehicles.plateNumber,
      carModel: vehicles.carModel,
      carColor: vehicles.color,
      paymentStatus: payments.status,
    })
    .from(reservations)
    .innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .innerJoin(
      parkingLocations,
      eq(parkingSpots.locationId, parkingLocations.id),
    )
    .innerJoin(vehicles, eq(reservations.vehicleId, vehicles.id))
    .leftJoin(payments, eq(reservations.id, payments.reservationId))
    .where(eq(reservations.userId, userId))
    .orderBy(desc(reservations.startTime), desc(payments.createdAt));

  const uniqueReservations = new Map();
  for (const row of userReservations) {
    if (!uniqueReservations.has(row.id)) {
      uniqueReservations.set(row.id, row);
    }
  }

  return Array.from(uniqueReservations.values());
}

export async function getActiveReservation(userId: string) {
  const active = await db
    .select({
      id: reservations.id,
      startTime: reservations.startTime,
      endTime: reservations.endTime,
      status: reservations.status,
      qrToken: reservations.qrToken,
      locationName: parkingLocations.name,
      pricePerHour: parkingSpots.pricePerHour,
      plateNumber: vehicles.plateNumber,
      carModel: vehicles.carModel,
      carColor: vehicles.color,
      paymentStatus: payments.status,
    })
    .from(reservations)
    .innerJoin(parkingSpots, eq(reservations.spotId, parkingSpots.id))
    .innerJoin(
      parkingLocations,
      eq(parkingSpots.locationId, parkingLocations.id),
    )
    .innerJoin(vehicles, eq(reservations.vehicleId, vehicles.id))
    .leftJoin(payments, eq(reservations.id, payments.reservationId))
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

  return active[0] || null;
}

export async function validateQRToken(token: string, returnUrl?: string) {
  const response = await db
    .select()
    .from(reservations)
    .where(eq(reservations.qrToken, token))
    .limit(1)
    .then((r) => r[0]);

  const reservation = response;
  if (!reservation) throw new Error("Invalid QR Token");

  if (reservation.status === "RESERVED") {
    return await startSession(reservation.id);
  } else if (reservation.status === "ACTIVE") {
    return await completeSession(reservation.id);
    // return await createPayment(token)
  } else if (reservation.status === "COMPLETED") {
    if (!reservation.actualStartTime || !reservation.actualEndTime) return null;
    return await createPayment(token, returnUrl);
  } else {
    throw new Error(`Reservation is already ${reservation.status}`);
  }
}

export async function startSession(reservationId: string) {
  const response = await db
    .update(reservations)
    .set({
      status: "ACTIVE",
      actualStartTime: new Date(),
    })
    .where(eq(reservations.id, reservationId))
    .returning()
    .then((r) => r[0]);
  return response || null;
}

export async function completeSession(reservationId: string) {
  const response = await db
    .update(reservations)
    .set({
      status: "COMPLETED",
      actualEndTime: new Date(),
    })
    .where(eq(reservations.id, reservationId))
    .returning()
    .then((r) => r[0]);

  if (response) {
    // Restore parking availability when session is completed
    await updateParkingAvailability(response.spotId, 1, 0);
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
    const createdAt = new Date(reservation.createdAt);
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
    .returning();

  return true;
}
