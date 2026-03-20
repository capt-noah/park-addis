import express from "express"
import { cancelReservation, getUserReservations, reserveSpot } from "../services/reservation.service"

const reservationRouter = express.Router()

reservationRouter.post('/reserve', async (req, res) => {
    const { userId, spotId, startTime, endTime } = req.body
    
    const reservedSpot = await reserveSpot(userId, spotId, startTime, endTime)

    if (!reservedSpot) return res.status(301).json({ error: "Unable to Reserve Parking Spot" })
    
    return res.status(200).json({reservedSpot})
})

reservationRouter.post('/reservations', async (req, res) => {
    const { userId } = req.body
    
    const reservations = await getUserReservations(userId)

    if (!reservations) return res.status(301).json({ error: "No Reservations Found" })
    
    return res.status(200).json({reservations})
})

reservationRouter.post('/cancel', async (req, res) => {
    const { reservationId } = req.body
    
    const isCancelled = await cancelReservation(reservationId)

    if (!isCancelled) return res.status(301).json({ error: "Unable To Cancel Reservation" })
    
    return res.status(200).json({isCancelled})
})

export default reservationRouter