import express from "express"
import { getParkingLocation, getParkingLocationsJson, getParkingLocationsWithinRange, getParkingSpot, getParkingSpotFromLocationId } from "../services/parking.service"
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
    
    return res.status(200).json({spot})
    
})

parkingRouter.get('/locations', async (req, res) => {
    const locations = await getParkingLocationsJson()

    if (!locations) return res.status(401).json({ error: "Locations Not Found" })
    
    return res.status(200).json({locations})
})

parkingRouter.post('/location', async (req, res) => {
    const { id } = req.body
    
    const location = await getParkingLocation(id)
    const spot = await getParkingSpotFromLocationId(id)

    if (!location) return res.status(301).json({ error: "Unable to find Location" })
    
    return res.status(200).json({ location, spot })
})

export default parkingRouter