import express from "express"
import crypto from "crypto"
import { validateQRToken } from "../services/reservation.service"
import { completePayment, failPayment, verifyChapaPayment } from "../services/payment.service"
import { confirmTopUp } from "../services/wallet.service"

const paymentRouter = express.Router()

/**
 * MOBILE REDIRECT: Chapa requires an https:// return_url.
 * This route receives the user after payment and bounces them back to the app.
 */
paymentRouter.get('/success', (req, res) => {
    // Chapa might use different keys depending on the API version or environment
    const tx_ref = req.query.tx_ref || req.query.trx_ref || req.query.transaction_id || req.query.reference;
    

    
    // Redirect back to the mobile app scheme, ensuring we pass a non-null string
    return res.redirect(`parkaddis://payment-success?tx_ref=${tx_ref || ''}&status=${req.query.status || 'success'}`);
});

paymentRouter.post('/create', async (req, res) => {
    try {
        const { qrToken, returnUrl } = req.body
        
        if (!qrToken) {
            return res.status(400).json({ error: "Missing QR Token" })
        }

        const payment = await validateQRToken(qrToken, returnUrl)

        if (!payment) {
            return res.status(401).json({ error: "Payment Failed" })
        }
        
        return res.status(200).json(payment)
    } catch (error: any) {

        return res.status(500).json({ 
            error: error.message || "Internal Server Error",
            details: "An unexpected error occurred while creating the payment session."
        })
    }
})

// Original callback (redirect/simple verify)
paymentRouter.all('/callback', async (req, res) => {
    try {
        const tx_ref = req.body.tx_ref || req.query.tx_ref || req.body.trx_ref || req.query.trx_ref;



        if (!tx_ref) {
            return res.status(400).json({ error: "Missing transaction reference" });
        }

        const validChapa = await verifyChapaPayment(tx_ref)

        if(!validChapa) return res.status(401).json({error: "Invalid Payment"})

        if (validChapa.data && validChapa.data.status === "success") {
            const paymentResponse = await completePayment(tx_ref)

            if(!paymentResponse) return res.status(401).json({error: "Unable To Complete Payment"})

            return res.status(200).send("OK")
        }

        await failPayment(tx_ref)
        return res.status(400).json({error: "Payment Failed"})
    } catch (error: any) {

        return res.status(500).json({ error: error.message });
    }
})

/**
 * SECURE WEBHOOK: Chapa calls this in the background.
 * Requires verifying the HMAC signature for security.
 */
paymentRouter.post('/webhook', async (req: any, res) => {
    try {
        const signature = req.headers['x-chapa-signature']
        const secret = process.env.CHAPA_SECRET_KEY
        
        if (!signature || !secret) {
            return res.status(401).json({ error: "Missing signature or secret" })
        }

        // Verify HMAC-SHA256 signature
        const hash = crypto
            .createHmac('sha256', secret)
            .update(req.rawBody) // rawBody is captured in server.ts
            .digest('hex')

        if (hash !== signature) {

            return res.status(401).json({ error: "Invalid signature" })
        }

        const payload = req.body
        const { tx_ref, status } = payload



        if (status === 'success') {
            // 1. Try to update reservation payment
            const reservationPayment = await completePayment(tx_ref)
            
            // 2. If not a reservation payment, try to update wallet top-up
            if (!reservationPayment) {
                try {
                    await confirmTopUp(tx_ref)

                } catch (walletErr) {
                    // Not found in either table?

                }
            } else {

            }
        } else {

            await failPayment(tx_ref)
        }

        return res.status(200).send("OK")
    } catch (error: any) {

        return res.status(500).json({ error: error.message })
    }
})

export default paymentRouter