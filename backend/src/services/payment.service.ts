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
    
    // Defensive splitting for fullName
    const nameParts = (fullName || "User").trim().split(/\s+/);
    const first_name = nameParts[0] || "User";
    const last_name = nameParts.slice(1).join(" ") || "Customer";
    
    // Ensure phone number format
    let formattedPhone = phone_number;
    if (formattedPhone && !formattedPhone.startsWith('0') && !formattedPhone.startsWith('+251')) {
        formattedPhone = '0' + formattedPhone;
    }

    try {
        const response = await chapa.initialize({
            first_name,
            last_name,
            phone_number: formattedPhone,
            amount,
            currency: "ETB",
            email,
            tx_ref,
            // Callback: Where Chapa sends the status (our backend)
            callback_url: `${process.env.BACKEND_URL}/api/payment/callback`,
            // Return: Where the user is redirected (our frontend)
            return_url: `${process.env.VERCEL_URL}/reservations`,
            customization: {
                title: "Park Addis Payment",
                description: "Parking Reservation Payment"
            }
        });
        return response;
    } catch (error: any) {
        // Log the detailed error object to the console
        const errorData = error?.response?.data || error.message;
        console.error("Chapa Initialization Error:", errorData);
        
        // Stringify the error if it is an object to avoid [object Object] in the message
        const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
        throw new Error(`Chapa Initialization Failed: ${errorMessage}`);
    }
}

export async function verifyChapaPayment(tx_ref: string) {
    const response = await chapa.verify({
        tx_ref
    })

    return response ?? null
}