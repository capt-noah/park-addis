import { Session } from "@/schemas/Session";
import crypto from "crypto"
import dbConnect from "./mongoose";
import { cookies } from "next/headers";
import { User } from "@/schemas/User";

export async function createSession(userId: string) {
    await dbConnect()
    
    const token = crypto.randomBytes(32).toString("hex")

    await Session.create({
        userId, 
        token,
        createdAt: new Date()
    })

    return token

}

export async function getSession(token: string) {
    await dbConnect()

    const session = await Session.findOne({ token })
    if (!session) return null
    
    return session
}

export async function deleteSession(token: string) {
    await dbConnect()

    await Session.deleteOne({ token })
}

export async function getCurrentUser() {
    await dbConnect()

    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    if (!token) return null

    const session = await getSession(token)
    if (!session) return null

    const _id = session.userId.toString()
    const user = await User.findOne({ _id })

    if (!user) return null

    return {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role
    }
}