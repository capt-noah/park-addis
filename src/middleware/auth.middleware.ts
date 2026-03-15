import { Response, Request, NextFunction } from "express"
import { findUserBySession, findSession } from "../services/auth.service"


export async function authMiddleware( req: Request, res: Response, next: NextFunction) {
    const sessionId = req.cookies.sessionId

    if (sessionId) {
        const session = await findSession(sessionId)

        if(!session || session.expiresAt < new Date()) return res.status(401).json({error: "Session is Expired or Invalid"})
    }
    else {
        return res.status(401).json({ error: "No Session Found" })
    }
    
    const user = await findUserBySession(sessionId)

    if (!user) return res.status(401).json({ error: "Invalid Session" })
    
    res.locals.user = user

    next()
}
