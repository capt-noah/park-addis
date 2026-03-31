import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUserBySession } from "@/backend/src/services/auth.service";
import { getVehiclesByUserId } from "@/backend/src/services/cars.service";

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
    const vehicles = await getVehiclesByUserId(user.id);
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}
