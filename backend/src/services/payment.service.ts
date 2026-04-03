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
    
    const first_name = fullName.split(' ')[0]
    const last_name = fullName.split(' ')[1]
    phone_number = 0 + phone_number

    const response = chapa.initialize({
        first_name,
        last_name,
        phone_number,
        amount,
        currency: "ETB",
        email,
        tx_ref,
        callback_url: `${process.env.BACKEND_URL}/api/payment/callback`,
        return_url: `${process.env.BACKEND_URL}/reservations`,
        customization: {
            title: "Park Addis Payment",
            description: "Parking Reservation Payment"
        }

    })

    const data = await response

    return data
}

export async function verifyChapaPayment(tx_ref: string) {
    const response = await chapa.verify({
        tx_ref
    })

    return response ?? null
}