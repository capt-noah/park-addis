import { NextRequest, NextResponse } from "next/server";
import { getParkingSpotFromLocationId } from "@/src/services/parking.service";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const spot = await getParkingSpotFromLocationId(id);
        if (!spot) {
            return NextResponse.json({ error: "Parking spot not found for this location" }, { status: 404 });
        }

        return NextResponse.json(spot);
    } catch (error) {
        console.error("Error fetching parking spot:", error);
        return NextResponse.json({ error: "Failed to fetch parking spot" }, { status: 500 });
    }
}
