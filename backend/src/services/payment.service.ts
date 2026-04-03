import { db } from "../db"
import { parkingSpots } from "../schema/parkingSpots"
import { payments } from "../schema/payments"
import { eq } from "drizzle-orm"
import { reservations } from "../schema/reservations"

import crypto from "crypto"
import { users } from "../schema/users"


export async function createPayment(qrToken: string) {

    const response = await db.select()
                             .from(reservations)
                             .innerJoin(parkingSpots, eq(parkingSpots.id, reservations.spotId))
                             .innerJoin(users, eq(users.id, reservations.userId))
                             .where(eq(reservations.qrToken, qrToken))
                             
    
    if (response.length === 0) return null
    
    const reservation = response[0].reservations
    const parkings = response[0].parking_spots
    const user = response[0].users

    if (!reservation || !reservation.actualStartTime || !reservation.actualEndTime) return null

    const tx_ref = crypto.randomUUID()

    const durationMs = new Date(reservation.actualEndTime).getTime() - new Date(reservation.actualStartTime).getTime()

    const hours: number = durationMs / (1000 * 60 * 60)

    const amount: string = String(hours * Number(parkings.pricePerHour))

    const payResponse = await db.insert(payments)
                             .values({
                                 reservationId: reservation.id,
                                 amount,
                                 status: 'PENDING',
                                 transactionId: tx_ref
                             })
    
    const paymentCallback = "payment"
    const paymentSession = await initializeChapaPayment({amount, email: user.email, fullName: user.fullName, phone_number: user.phoneNumber, tx_ref, paymentCallback})
    
    return paymentSession ?? null
}

export async function completePayment(transactionId: string) {
    return await db.transaction(async (tx) => {
        console.log(`[PAYMENT] Completing payment for: ${transactionId}`);
        
        // 1. Update Payment record
        const [payment] = await tx.update(payments)
                .set({ status: 'SUCCESS' })
                .where(eq(payments.transactionId, transactionId))
                .returning();

        if (!payment) {
            console.error(`[PAYMENT] Payment record not found for: ${transactionId}`);
            return null;
        }

        // 2. Update Reservation record to PAID
        await tx.update(reservations)
                .set({ status: 'PAID' })
                .where(eq(reservations.id, payment.reservationId));

        console.log(`[PAYMENT] Success: Updated payment ${payment.id} and reservation ${payment.reservationId}`);
        return payment;
    });
}

export async function failPayment(transactionId: string) {
    const response = await db.update(payments)
                             .set({
                                status: 'FAILED'
                              })
                             .where(eq(payments.transactionId, transactionId))
                             .returning()
                             .then(r => r[0])
                       
    return response ?? null
}

export async function initializeChapaPayment({amount, fullName, phone_number, email, tx_ref, paymentCallback}: {amount: string, email: string, tx_ref: string, fullName: string, phone_number: string, paymentCallback: string}) {

    const first_name = fullName.split(" ")[0];
    const last_name = fullName.split(" ")[1] || "N/A";
    
    const formattedPhone = "0" + phone_number

    const body = {
        amount,
        currency: "ETB",
        email,
        first_name,
        last_name,
        phone_number: formattedPhone,
        tx_ref,
        callback_url: `${process.env.BACKEND_URL}/api/${paymentCallback}/callback`,
        return_url: `${process.env.VERCEL_URL}/payment/success?tx_ref=${tx_ref}`,
        "customization[title]": "Park Addis Payment",
        "customization[description]": "Parking Reservation Payment"
    };

    console.log("[CHAPA] Initializing with fetch:", JSON.stringify(body, null, 2));

    try {
        const response = await fetch(`${process.env.CHAPA_URL}/initialize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = (await response.json()) as any;

        if (!response.ok || data.status !== 'success') {
            console.error("[CHAPA] Initialization Error:", data);
            throw new Error(data.message || JSON.stringify(data));
        }

        return data; // Returns { status, message, data: { checkout_url } }
    } catch (error: any) {
        console.error("[CHAPA] Initialization Exception:", error.message);
        throw new Error(`Payment Initialization Failed: ${error.message}`);
    }
}

export async function verifyChapaPayment(tx_ref: string) {
    console.log(`[CHAPA] Verifying transaction: ${tx_ref}`);
    
    if (!tx_ref || tx_ref === 'undefined') {
        console.error("[CHAPA] Invalid tx_ref provided");
        return null;
    }

    try {
        const response = await fetch(`${process.env.CHAPA_URL}/verify/${tx_ref}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
            }
        });

        const data = (await response.json()) as any;
        console.log(`[CHAPA] Verify result for ${tx_ref}:`, JSON.stringify(data, null, 2));

        // Note: Based on the docs provided, top-level status identifies the API success.
        // The transaction status is inside data.status.
        if (!response.ok || data.status === 'failed') {
            return data; // Caller can check data.status
        }

        return data;
    } catch (error: any) {
        console.error("[CHAPA] Verify Exception:", error.message);
        throw error;
    }
}