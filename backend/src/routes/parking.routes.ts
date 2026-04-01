import express from "express"
import { getParkingLocation, getParkingLocationsJson, getParkingLocationsWithinRange, getParkingSpot, getParkingSpotFromLocationId } from "../services/parking.service"
import { authMiddleware } from "../middleware/auth.middleware"


const parkingRouter = express.Router()

parkingRouter.get('/', async (req, res) => {
    const { distance, lat, lng } = req.query;

    try {
        if (!distance || distance === 'All') {
            const locations = await getParkingLocationsJson();
            if (!locations) return res.status(404).json({ error: "Locations Not Found" });
            return res.status(200).json({ locations });
        }

        const range = parseInt(distance as string);
        const coor = {
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string)
        };

        if (isNaN(range) || isNaN(coor.lat) || isNaN(coor.lng)) {
            return res.status(400).json({ error: "Invalid parameters" });
        }

        const locations = await getParkingLocationsWithinRange(range, coor);
        if (!locations) return res.status(404).json({ error: "No locations found within range" });

        return res.status(200).json({ locations });
    } catch (error) {
        console.error("Failed to fetch locations:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

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