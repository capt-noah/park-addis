import { NextRequest, NextResponse } from "next/server";
import { findUserBySession } from "@/src/services/auth.service";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies()
        const sessionId = cookieStore.get("sessionId")?.value

        if (!sessionId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const user = await findUserBySession(sessionId)

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
        }

        return NextResponse.json({
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        })

    } catch (error) {
        console.error("[/api/me]", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}