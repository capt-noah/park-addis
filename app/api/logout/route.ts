import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/backend/src/services/auth.service";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No active session" }, { status: 400 });
    }

    await deleteSession(sessionId);

    const response = NextResponse.json({ ok: true });
    response.cookies.set("sessionId", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0, // expire immediately
    });

    return response;
  } catch (error) {
    console.error("[/api/logout]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
