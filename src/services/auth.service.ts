import { users } from '../schema/users'
import { vehicles } from '../schema/vehicles'
import { sessions } from '@/src/schema/sessions'
import { db } from '../db'
import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'


export async function registerUserAndCar(fullName: string, email: string, password: string, phoneNumber: string, role: string, plateNumber: string, carModel: string, color: string) {
    const passwordHash = await bcrypt.hash(password, 10)

    const userAndCar = await db.transaction(async (tx) => {
        const user = await tx.insert(users).values({ fullName, email, passwordHash, phoneNumber, role }).returning()
        
        const car = await tx.insert(vehicles).values({ userId: user[0].id, plateNumber, carModel, color }).returning()
        
        return user[0]
    })

    return userAndCar
}

export async function registerVehicle(userId: string, plateNumber: string, carModel: string, color: string) {

    const car = await db.insert(vehicles).values({ userId, plateNumber, carModel, color }).returning()
    
    return car[0] 
}

export async function findUserByEmail(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email))

    return user[0] ?? null
}

export async function findUserById(userId: string) {
    const user = await db.select().from(users).where(eq(users.id, userId))

    return user[0] ?? null
}

export async function validateUser(email: string, password: string) {
    const user = await findUserByEmail(email)

    if (!user) return false
    
    const isValid = await bcrypt.compare(password, user.passwordHash)

    return isValid? user : false
}

export async function createSession(userId: string) {
    
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await db.insert(sessions).values({ userId, expiresAt }).returning()
    
    return session[0].id
}

export async function deleteSession(sessionId: string) {
    const isDeleted = await db.delete(sessions).where(eq(sessions.id, sessionId))
    
    return isDeleted ?? false
}

export async function findSession(id: string) {
    const userSession = await db.select().from(sessions).where(eq(sessions.id, id))

    return userSession[0] ?? null
}

export async function findUserBySession(id: string) {
    const userSession = await findSession(id)

    if (!userSession) return false
    
    const user = await findUserById(userSession.userId)

    if (!user) return false
    
    return user
}