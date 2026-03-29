import { NextRequest, NextResponse } from "next/server";
import { getParkingLocationsWithinRange } from "@/src/services/parking.service";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const distanceStr = searchParams.get("distance");
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    if(!latStr || !lngStr) return NextResponse.json({error: "Unable To Find User"}, {status: 401})

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    
    // For 'All' or no distance, we use a very large range (e.g. 1000km = 1000000m)
    const range = (distanceStr && distanceStr !== 'All') ? parseInt(distanceStr, 10) : 1000000;

    try {
        const locations = await getParkingLocationsWithinRange(range, { lat, lng });

        return NextResponse.json({locations: locations});
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
