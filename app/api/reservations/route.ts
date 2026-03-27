import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUserBySession } from "@/src/services/auth.service";
import { reserveSpot } from "@/src/services/reservation.service";

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserBySession(sessionId);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { spotId, vehicleId, startTime, endTime } = body;

        if (!spotId || !vehicleId || !startTime || !endTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const reservation = await reserveSpot(
            user.id,
            spotId,
            vehicleId,
            new Date(startTime),
            new Date(endTime)
        );

        if (!reservation) {
            return NextResponse.json({ error: "Failed to create reservation or spot unavailable" }, { status: 400 });
        }

        return NextResponse.json(reservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing reservation ID" }, { status: 400 });
    }

    try {
        const { cancelReservation } = await import("@/src/services/reservation.service");
        const result = await cancelReservation(id);

        if (!result) {
            return NextResponse.json({ error: "Failed to cancel reservation" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
