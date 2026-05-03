import express from "express"
import { getParkingLocation, getParkingLocationsJson, getParkingLocationsWithinRange, getParkingSpot, getParkingSpotFromLocationId, searchParkingLocationsByName } from "../services/parking.service"
import { authMiddleware } from "../middleware/auth.middleware"


const parkingRouter = express.Router()

parkingRouter.get('/search', async (req, res) => {
    const { q, lat, lng } = req.query;

    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

    try {
        const coor = (lat && lng) ? {
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string)
        } : undefined;

        const locations = await searchParkingLocationsByName(q as string, coor);
        
        if (!locations) return res.status(404).json({ error: "No locations found matching the query" });

        return res.status(200).json({ locations });
    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

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