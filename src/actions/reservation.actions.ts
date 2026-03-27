"use server";

import { extendReservation } from "../services/reservation.service";
import { revalidatePath } from "next/cache";

export async function extendReservationAction(reservationId: string, extraMinutes: number) {
  if (!reservationId || extraMinutes <= 0) {
    return { success: false, error: "Invalid data provided" };
  }

  try {
    const updated = await extendReservation(reservationId, extraMinutes);
    
    if (!updated) {
      return { success: false, error: "Failed to update reservation" };
    }

    // revalidate dashboard
    revalidatePath("/dashboard");
    revalidatePath("/reservations");

    return { success: true };
  } catch (err: any) {
    console.error("Failed to extend reservation:", err);
    return { success: false, error: err.message || "An unknown error occurred" };
  }
}
