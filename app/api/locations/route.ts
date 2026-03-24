import { NextRequest, NextResponse } from "next/server";
import { getParkingLocationsWithinRange } from "@/src/services/parking.service";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const distanceStr = searchParams.get("distance");
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    const lat = latStr ? parseFloat(latStr) : 9.0190;
    const lng = lngStr ? parseFloat(lngStr) : 38.7525;
    
    // For 'All' or no distance, we use a very large range (e.g. 1000km = 1000000m)
    const range = (distanceStr && distanceStr !== 'All') ? parseInt(distanceStr, 10) : 1000000;

    try {
        const locations = await getParkingLocationsWithinRange(range, { lat, lng });
        // console.log(locations)

        // if(locations.length === 0) return NextResponse.json({error: `No Locations Found Within ${range} Range of User`})
        
        // Map data to match ParkingLocation type used by UI
        // const mappedLocations = (locations as any[]).map(loc => ({
        //     id: loc.id,
        //     name: loc.name,
        //     address: loc.address || "Addis Ababa",
        //     lat: loc.lat,
        //     lng: loc.lng,
        //     price: loc.display_price_per_hour,
        //     status: "Available",
        //     image: "/bole.png", 
        //     rating: loc.ratings_count > 0 ? Number((loc.ratings_sum / loc.ratings_count / 10).toFixed(1)) : 4.5,
        //     feature: loc.feature,
        //     distance: Number((parseFloat(String(loc.distance || 0)) / 1000).toFixed(1)),
        //     eta: Math.round(loc.eta),
        //     popular: 3
        // }));

        return NextResponse.json({locations: locations});
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
