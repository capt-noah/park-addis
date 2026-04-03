import express from "express"
import { confirmTopUp, createWallet, failTopUp, getWallet, getWalletTransactions, payReservationFromWallet, topUpWallet } from "../services/wallet.service"
import { authMiddleware } from "../middleware/auth.middleware"
import { verifyChapaPayment } from "../services/payment.service"

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

walletRouter.post('/callback', async (req, res) => {
        const { tx_ref } = req.body
    
        const validChapa = await verifyChapaPayment(tx_ref)
    
        if(!validChapa) return res.status(401).json({error: "Invalid Payment"})
    
        if (validChapa.data && validChapa.data.status === "success") {
            const topupResponse = await confirmTopUp(tx_ref)
    
            if(!topupResponse) return res.status(401).json({error: "Unable To Complete TopUp"})
    
            return res.status(200).send("OK")
        }
    
        await failTopUp(tx_ref)
        return res.status(400).json({error: "Payment Failed"})
})

walletRouter.post('/pay/reservation', authMiddleware, async (req, res) => {
    const { reservationId, amount } = req.body
    const userId = res.locals.user.id
    const payRes = await payReservationFromWallet(userId, reservationId, amount)
    if (!payRes) return res.status(403).json({ error: "Unable To Pay For Reservation" })
    return res.status(200).json(payRes)
})

export default walletRouter