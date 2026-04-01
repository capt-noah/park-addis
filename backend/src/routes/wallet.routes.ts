import express from "express"
import { createWallet, getWallet, getWalletTransactions, payReservationFromWallet, topUpWallet } from "../services/wallet.service"
import { authMiddleware } from "../middleware/auth.middleware"

const walletRouter = express.Router()

// 1. Get user wallet (session-based)
walletRouter.get('/', authMiddleware, async (req, res) => {
    const userId = res.locals.user.id
    const userWallet = await getWallet(userId)
    if (!userWallet) return res.status(404).json({ error: "Wallet Not Found" })
    return res.status(200).json(userWallet)
})

// 2. Backward compatibility
walletRouter.post('/user', async (req, res) => {
    const { userId } = req.body
    const userWallet = await getWallet(userId)
    if (!userWallet) return res.status(404).json({ error: "Wallet Not Found" })
    return res.status(200).json(userWallet)
})

walletRouter.post('/create', async (req, res) => {
    const { userId } = req.body
    const userWallet = await createWallet(userId)
    if (!userWallet) return res.status(403).json({ error: "Unable To Create Wallet" })
    return res.status(200).json(userWallet)
})

walletRouter.post('/transaction', async (req, res) => {
    const { walletId } = req.body
    const walletTrx = await getWalletTransactions(walletId)
    if (!walletTrx) return res.status(404).json({ error: "No Transaction Found" })
    return res.status(200).json(walletTrx)
})

// 3. Session-based topup
walletRouter.post('/topup', authMiddleware, async (req, res) => {
    const { amount } = req.body
    const userId = res.locals.user.id
    const topupRes = await topUpWallet(userId, amount)
    if (!topupRes) return res.status(403).json({ error: "Unable To TopUp" })
    return res.status(200).json(topupRes)
})

walletRouter.post('/pay/reservation', authMiddleware, async (req, res) => {
    const { reservationId, amount } = req.body
    const userId = res.locals.user.id
    const payRes = await payReservationFromWallet(userId, reservationId, amount)
    if (!payRes) return res.status(403).json({ error: "Unable To Pay For Reservation" })
    return res.status(200).json(payRes)
})

export default walletRouter