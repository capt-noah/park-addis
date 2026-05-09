import express from "express"
import { getParkingLocation, getParkingLocationsJson, getParkingLocationsWithinRange, getParkingSpot, getParkingSpotFromLocationId, searchParkingLocationsByName } from "../services/parking.service"
import { authMiddleware } from "../middleware/auth.middleware"
import "../utils/logger"


const parkingRouter = express.Router()

parkingRouter.get('/search', async (req, res) => {
    const { q, lat, lng } = req.query;

    if (!q) {
        console.log("[PARKING] GET /search - Missing query parameter");
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        console.log("[PARKING] GET /search - Searching for:", q);
        const coor = (lat && lng) ? {
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string)
        } : undefined;

        const locations = await searchParkingLocationsByName(q as string, coor);
        
        if (!locations) {
            console.log("[PARKING] GET /search - No locations found for query:", q);
            return res.status(404).json({ error: "No locations found matching the query" });
        }

        console.log("[PARKING] GET /search - Found", locations.length, "locations for:", q);
        return res.status(200).json({ locations });
    } catch (error: any) {
        console.log("[PARKING] GET /search - Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }ole.log("[PARKING] GET / - Fetching all parking locations");
            const locations = await getParkingLocationsJson();
            if (!locations) {
                console.log("[PARKING] GET / - No locations found");
                return res.status(404).json({ error: "Locations Not Found" });
            }
            console.log("[PARKING] GET / - Retrieved", locations.length, "locations");
            return res.status(200).json({ locations });
        }

        console.log("[PARKING] GET / - Fetching locations within", distance, "meters");
        const range = parseInt(distance as string);
        const coor = {
            lat: parseFloat(lat as string),
            lng: parseFloat(lng as string)
        };

        if (isNaN(range) || isNaN(coor.lat) || isNaN(coor.lng)) {
            console.log("[PARKING] GET / - Invalid parameters provided");
            return res.status(400).json({ error: "Invalid parameters" });
        }

        const locations = await getParkingLocationsWithinRange(range, coor);
        if (!locations) {
            console.log("[PARKING] GET / - No locations found within range");
            return res.status(404).json({ error: "No locations found within range" });
        }

        console.log("[PARKING] GET / - Found", locations.length, "locations within range");
        return res.status(200).json({ locations });
    } catch (error: any) {
        console.log("[PARKING] GET / - Error:", error.message parameters" });
        }

    try {
        const { range, coors } = req.body
        console.log("[PARKING] POST /range - Searching within range:", range, "meters");

        const parkingWithinRange = await getParkingLocationsWithinRange(range, coors)
        if (!parkingWithinRange) {
            console.log("[PARKING] POST /range - No parking locations found");
            return res.status(401).json({ error: "No Available Parking Locations Found" });
        }
        
    try {
        const { spotId } = req.body
        console.log("[PARKING] POST /spot - Fetching spot:", spotId);
        
        const spot = await getParkingSpot(spotId)

        if (!spot) {
            console.log("[PARKING] POST /spot - Spot not found:", spotId);
            return res.status(301).json({ error: "Unable to Find Parking Spot" });
        }
        
        console.log("[PARKING] POST /spot - Spot retrieved successfully:", spotId);
        return res.status(200).json({spot})
    } catch (error: any) {
        console.log("[PARKING] POST /spot - Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }

parkingRouter.post('/range', async (req, res) => {
    const { range, coors } = req.body

    const parkingWithinRange = await getParkingLocationsWithinRange(range, coors)
    try {
        console.log("[PARKING] GET /locations - Fetching all locations");
        const locations = await getParkingLocationsJson()

        if (!locations) {
            console.log("[PARKING] GET /locations - No locations found");
            return res.status(401).json({ error: "Locations Not Found" });
        }
    try {
        const { id } = req.body
        console.log("[PARKING] POST /location - Fetching location:", id);
        
        const location = await getParkingLocation(id)
        const spot = await getParkingSpotFromLocationId(id)

        if (!location) {
            console.log("[PARKING] POST /location - Location not found:", id);
            return res.status(301).json({ error: "Unable to find Location" });
        }
        
        console.log("[PARKING] POST /location - Location retrieved successfully:", id);
        return res.status(200).json({ location, spot })
    } catch (error: any) {
        console.log("[PARKING] POST /location - Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
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