import { NextRequest, NextResponse } from "next/server";
import {
  validateUser,
  createSession,
} from "@/backend/src/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await validateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const sessionId = await createSession(user.id);

    const response = NextResponse.json(
      {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      { status: 200 },
    );

    response.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[/api/login]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
