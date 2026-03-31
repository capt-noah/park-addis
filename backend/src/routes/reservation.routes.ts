import express from "express"
import { cancelReservation, completeSession, extendReservation, getActiveReservation, getUserReservations, reserveSpot, startSession, validateQRToken } from "../services/reservation.service"

const reservationRouter = express.Router()

reservationRouter.post('/reserve', async (req, res) => {
    const { userId, spotId, vehicleId, startTime, endTime } = req.body
    
    const reservedSpot = await reserveSpot(userId, spotId, vehicleId, startTime, endTime)

    if (!reservedSpot) return res.status(301).json({ error: "Unable to Reserve Parking Spot" })
    
    return res.status(200).json({reservedSpot})
})

reservationRouter.post('/reservations', async (req, res) => {
    const { userId } = req.body
    
    const reservations = await getUserReservations(userId)

    if (!reservations) return res.status(301).json({ error: "No Reservations Found" })
    
    return res.status(200).json({reservations})
})

reservationRouter.post('/validate', async (req, res) => {
    const { qrToken } = req.body
    
    const response = await validateQRToken(qrToken)

    if (!response) return res.status(401).json({ error: "Invalid Token" })
    
    return res.status(200).json(response)
})

reservationRouter.post('/start', async (req, res) => {
    const { reservationId } = req.body

    const response = await startSession(reservationId)

    if (!response) return res.status(401).json({ error: "Unable to Start Session" })
    
    return res.status(200).json(response)
})

reservationRouter.post('/complete', async (req, res) => {
    const { reservationId } = req.body
    
    const response = await completeSession(reservationId)

    if (!response) return res.status(401).json({ error: "Unable to Complete Session" })
    
    return res.status(200).json(response)
})

reservationRouter.post('/cancel', async (req, res) => {
    const { reservationId } = req.body
    
    const isCancelled = await cancelReservation(reservationId)

    if (!isCancelled) return res.status(301).json({ error: "Unable To Cancel Reservation" })
    
    return res.status(200).json({isCancelled})
})

reservationRouter.post('/active', async (req, res) => {
    const { userId } = req.body
    
    const active = await getActiveReservation(userId)

    if (!active) return res.status(200).json(null)
    
    return res.status(200).json(active)
})

reservationRouter.post('/extend', async (req, res) => {
    const { reservationId, extraMinutes } = req.body
    
    const success = await extendReservation(reservationId, extraMinutes)

    if (!success) return res.status(400).json({ error: "Unable To Extend Reservation" })
    
    return res.status(200).json({ success })
})

export default reservationRouter