import express from "express"
import { createWallet, getWallet, getWalletTransactions, payReservationFromWallet, topUpWallet } from "../services/wallet.service"


const walletRouter = express.Router()

walletRouter.post('/create', async (req, res) => {
    const { userId } = req.body
    
    const userWallet = await createWallet(userId)

    if (!userWallet) return res.status(403).json({ error: "Unable To Create Wallet" })
    
    return res.status(200).json(userWallet)
})

walletRouter.post('/user', async (req, res) => {
    const { userId } = req.body
    
    const userWallet = await getWallet(userId)

    if (!userWallet) return res.status(404).json({ error: "Wallet Not Found" })
    
    return res.status(200).json(userWallet)
})

walletRouter.post('/transaction', async (req, res) => {
    const { walletId } = req.body
    
    const walletTrx = await getWalletTransactions(walletId)

    if (!walletTrx) return res.status(404).json({ error: "No Transaction Found" })
    
    return res.status(200).json(walletTrx)
})

walletRouter.post('/topup', async (req, res) => {
    const { userId, amount } = req.body
    
    const topupRes = await topUpWallet(userId, amount)

    if (!topupRes) return res.status(403).json({ error: "Unable To TopUp" })
    
    return res.status(200).json(topupRes)
})

walletRouter.post('/pay/reservation', async (req, res) => {
    const { userId, reservationId, amount } = req.body
    
    const payRes = await payReservationFromWallet(userId, reservationId, amount)

    if (!payRes) return res.status(403).json({ error: "Unable To Pay For Reservation" })
    
    return res.status(200).json(payRes)
})

export default walletRouter