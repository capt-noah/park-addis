import { db } from "../db"
import { parkingSpots } from "../schema/parkingSpots"
import { payments } from "../schema/payments"
import { eq } from "drizzle-orm"
import { reservations } from "../schema/reservations"

import crypto from "crypto"
import { users } from "../schema/users"


const CHAPA_URL = ''
const CHAPA_SECRET_KEY = ''

export async function createPayment(qrToken: string) {

    const response = await db.select()
                             .from(reservations)
                             .innerJoin(parkingSpots, eq(parkingSpots.id, reservations.spotId))
                             .innerJoin(users, eq(users.id, reservations.id))
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
    
    const chapa = await initializeChapaPayment({amount, email: user.email, tx_ref})
    
    return chapa ?? null
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

export async function initializeChapaPayment({amount, email, tx_ref}: {amount: string, email: string, tx_ref: string}) {
    
    const response = await fetch(CHAPA_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount,
            currency: "ETB",
            email,
            tx_ref,
            callback_url: "",
            return_url: "",
            customization: {
                title: "Park Addis Payment",
                description: "Parking Reservation Payment"
            }


        })
    })

    const data = await response.json()

    return data.data.checkout_url
}

export async function verifyChapaPayment(tx_ref: string) {
    let data = {status: "success"}
    return data
}