import { db } from "../db"
import { parkingSpots } from "../schema/parkingSpots"
import { payments } from "../schema/payments"
import { eq } from "drizzle-orm"
import { reservations } from "../schema/reservations"

import crypto from "crypto"
import { users } from "../schema/users"

import chapa from "../chapa"


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
    
    const paymentSession = await initializeChapaPayment({amount, email: user.email, fullName: user.fullName, phone_number: user.phoneNumber, tx_ref})
    
    return paymentSession ?? null
}

export async function completePayment(transactionId: string) {
    const response = await db.update(payments)
                             .set({
                                status: 'SUCCESS'
                              })
                             .where(eq(payments.transactionId, transactionId))
                             .returning()
                       
    return response[0] ?? null
}

export async function failPayment(transactionId: string) {
    const response = await db.update(payments)
                             .set({
                                status: 'FAILED'
                              })
                             .where(eq(payments.transactionId, transactionId))
                             .returning()
                       
    return response[0] ?? null
}

export async function initializeChapaPayment({amount, fullName, phone_number, email, tx_ref}: {amount: string, email: string, tx_ref: string, fullName: string, phone_number: string}) {
    
    // 1. Defensive splitting for fullName
    const nameParts = (fullName || "User").trim().split(/\s+/);
    const first_name = nameParts[0] || "User";
    const last_name = nameParts.slice(1).join(" ") || "Customer";
    
    // 2. Strict 10-digit phone number format (09xxxxxxxx or 07xxxxxxxx)
    // Chapa is very strict about this. We strip prefixes and ensure it starts with 0.
    let formattedPhone = (phone_number || "").replace(/\D/g, ""); // Remove non-digits
    if (formattedPhone.startsWith("251")) {
        formattedPhone = "0" + formattedPhone.slice(3);
    } else if (!formattedPhone.startsWith("0") && formattedPhone.length === 9) {
        formattedPhone = "0" + formattedPhone;
    }
    
    // Fallback if formatting fails or is empty
    if (formattedPhone.length !== 10) {
        console.warn(`Invalid phone format detected: ${phone_number}. Sending as is.`);
        formattedPhone = phone_number; 
    }

    const payload = {
        first_name,
        last_name,
        phone_number: formattedPhone,
        amount,
        currency: "ETB",
        email,
        tx_ref,
        callback_url: `${process.env.BACKEND_URL}/api/payment/callback`,
        // MANDATORY: Must include https:// protocol
        return_url: `https://${(process.env.VERCEL_URL || 'park-addis.vercel.app').replace('https://', '')}/reservations`,
        customization: {
            title: "Park Addis Payment",
            description: "Parking Reservation Payment"
        }
    };

    console.log("Initializing Chapa with payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await chapa.initialize(payload);
        return response;
    } catch (error: any) {
        const errorData = error?.response?.data || error.message;
        console.error("Chapa Initialization Detailed Error:", JSON.stringify(errorData, null, 2));
        
        // Ensure the error message is a string to avoid [object Object]
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : String(errorData);
        throw new Error(`Chapa API Error: ${errorMessage}`);
    }
}

export async function verifyChapaPayment(tx_ref: string) {
    const response = await chapa.verify({
        tx_ref
    })

    return response ?? null
}