import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUserBySession } from "@/backend/src/services/auth.service";
import { getActiveReservation } from "@/backend/src/services/reservation.service";

export async function GET(req: NextRequest) {
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
    const active = await getActiveReservation(user.id);
    return NextResponse.json(active);
  } catch (error) {
    console.error("Error fetching active reservation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
