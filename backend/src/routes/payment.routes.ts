import express from "express"
import { validateQRToken } from "../services/reservation.service"
import { completePayment, verifyChapaPayment } from "../services/payment.service"
const paymentRouter = express.Router()

paymentRouter.post('/create', async (req, res) => {
    try {
        const { qrToken } = req.body
        
        if (!qrToken) {
            return res.status(400).json({ error: "Missing QR Token" })
        }

        const payment = await validateQRToken(qrToken)

        if (!payment) {
            return res.status(401).json({ error: "Payment Failed" })
        }
        
        // Return the full payment object (including status and data if from Chapa)
        // This matches the frontend expectation: if(payment.status === 'success') ...
        return res.status(200).json(payment)
    } catch (error: any) {
        console.error("Payment creation error:", error)
        return res.status(500).json({ 
            error: error.message || "Internal Server Error",
            details: "An unexpected error occurred while creating the payment session."
        })
    }
})

paymentRouter.post('/callback', async (req, res) => {
    const { tx_ref } = req.body

    const validChapa = await verifyChapaPayment(tx_ref)

    if(!validChapa) res.status(401).json({error: "Invalid Payment"})

    if (validChapa.status === "success") {
        const paymentResponse = await completePayment(tx_ref)

        if(!paymentResponse) return res.status(401).json({error: "Unable To Complete Payment"})

        return res.status(200).send("OK")
    }

    return res.status(401).json({error: "Invalid Payment"})
    
})

export default paymentRouter