import { NextRequest, NextResponse } from "next/server";
import { getParkingLocation } from "@/backend/src/services/parking.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const location = await getParkingLocation(id);
    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error("Error fetching location details:", error);
    return NextResponse.json(
      { error: "Failed to fetch location details" },
      { status: 500 },
    );
  }
}
