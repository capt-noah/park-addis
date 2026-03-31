import { NextRequest, NextResponse } from "next/server";
import {
  registerUserAndCar,
  createSession,
} from "@/backend/src/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, phoneNumber, role, car } =
      await req.json();
    const { plateNumber, carModel, color } = car;

    const user = await registerUserAndCar(
      fullName,
      email,
      password,
      phoneNumber,
      role,
      plateNumber,
      carModel,
      color,
    );

    if (!user) {
      return NextResponse.json(
        { error: "Unable to create user" },
        { status: 400 },
      );
    }

    const sessionId = await createSession(user.id);

    const response = NextResponse.json({ ok: true }, { status: 201 });

    response.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("[/api/register]", error);

    // Handle unique constraint violation (duplicate email or phone)
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "An account with this email or phone number already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
