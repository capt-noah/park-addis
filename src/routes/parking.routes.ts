import express from "express"
import { getParkingLocationsWithinRange, getParkingSpot } from "../services/parking.service"
import { authMiddleware } from "../middleware/auth.middleware"


const parkingRouter = express.Router()

parkingRouter.post('/range', async (req, res) => {
    const { range, coors } = req.body

    const parkingWithinRange = await getParkingLocationsWithinRange(range, coors)
    if (!parkingWithinRange) return res.status(401).json({ error: "No Available Parking Locations Found" })
    
    return res.status(200).json({parkingWithinRange})

})

parkingRouter.post('/spot', async (req, res) => {
    const { spotId } = req.body
    
    const spot = await getParkingSpot(spotId)

    if (!spot) return res.status(301).json({ error: "Unable to Find Parking Spot" })
    
    return res.send(200).json({spot})
    
})

export default parkingRouter