import express from "express"
import { validateQRToken } from "../services/reservation.service"
import { completePayment, verifyChapaPayment } from "../services/payment.service"
const paymentRouter = express.Router()

paymentRouter.post('/create', async (req, res) => {
    const { qrToken } = req.body
    
    const payment = await validateQRToken(qrToken)

    if(!payment) return res.status(401).json({error: "Payment Failed"})
    
    // Check if it's a payment initialization response with a checkout_url
    if (typeof payment === 'object' && 'data' in payment && payment.data) {
        return res.status(200).json({ checkout_url: (payment as any).data.checkout_url })
    }

    // Otherwise, return the underlying reservation/session details
    return res.status(200).json(payment)

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