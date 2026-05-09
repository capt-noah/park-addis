import express from "express";
import crypto from "crypto";
import { validateQRToken } from "../services/reservation.service";
import { completePayment, failPayment, verifyChapaPayment } from "../services/payment.service";
import { confirmTopUp } from "../services/wallet.service";
import "../utils/logger";

const paymentRouter = express.Router();

/**
 * MOBILE REDIRECT: Chapa requires an https:// return_url.
 * This route receives the user after payment and bounces them back to the app.
 */
paymentRouter.get("/success", (req, res) => {
  const tx_ref =
    req.query.tx_ref || req.query.trx_ref || req.query.transaction_id || req.query.reference;

  console.log("[PAYMENT] GET /success - Payment success redirect for transaction:", tx_ref);
  return res.redirect(
    `parkaddis://payment-success?tx_ref=${tx_ref || ""}&status=${req.query.status || "success"}`,
  );
});

paymentRouter.post("/create", async (req, res) => {
  try {
    const { qrToken, returnUrl } = req.body;
    console.log("[PAYMENT] POST /create - Creating payment session");

    if (!qrToken) {
      console.log("[PAYMENT] POST /create - Missing QR token");
      return res.status(400).json({ error: "Missing QR Token" });
    }

    const payment = await validateQRToken(qrToken, returnUrl);

    if (!payment) {
      console.log("[PAYMENT] POST /create - Payment validation failed");
      return res.status(401).json({ error: "Payment Failed" });
    }

    console.log("[PAYMENT] POST /create - Payment session created successfully");
    return res.status(200).json(payment);
  } catch (error: any) {
    console.log("[PAYMENT] POST /create - Error:", error.message);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
      details: "An unexpected error occurred while creating the payment session.",
    });
  }
});

paymentRouter.all("/callback", async (req, res) => {
  try {
    const tx_ref =
      req.body.tx_ref || req.query.tx_ref || req.body.trx_ref || req.query.trx_ref;

    console.log("[PAYMENT] /callback - Payment callback received for transaction:", tx_ref);

    if (!tx_ref) {
      console.log("[PAYMENT] /callback - Missing transaction reference");
      return res.status(400).json({ error: "Missing transaction reference" });
    }

    const validChapa = await verifyChapaPayment(tx_ref);
    if (!validChapa) {
      console.log("[PAYMENT] /callback - Invalid payment verification for:", tx_ref);
      return res.status(401).json({ error: "Invalid Payment" });
    }

    if (validChapa.data && validChapa.data.status === "success") {
      console.log("[PAYMENT] /callback - Completing payment for:", tx_ref);
      const paymentResponse = await completePayment(tx_ref);

      if (!paymentResponse) {
        console.log("[PAYMENT] /callback - Failed to complete payment for:", tx_ref);
        return res.status(401).json({ error: "Unable To Complete Payment" });
      }

      console.log("[PAYMENT] /callback - Payment completed successfully for:", tx_ref);
      return res.status(200).send("OK");
    }

    console.log("[PAYMENT] /callback - Payment failed for:", tx_ref);
    await failPayment(tx_ref);
    return res.status(400).json({ error: "Payment Failed" });
  } catch (error: any) {
    console.log("[PAYMENT] /callback - Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * SECURE WEBHOOK: Chapa calls this in the background.
 * Requires verifying the HMAC signature for security.
 */
paymentRouter.post("/webhook", async (req: any, res) => {
  try {
    const signature = req.headers["x-chapa-signature"];
    const secret = process.env.CHAPA_SECRET_KEY;

    if (!signature || !secret) {
      console.log("[PAYMENT] POST /webhook - Missing signature or secret");
      return res.status(401).json({ error: "Missing signature or secret" });
    }

    const hash = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    if (hash !== signature) {
      console.log("[PAYMENT] POST /webhook - Invalid signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = req.body;
    const { tx_ref, status } = payload;
    console.log("[PAYMENT] POST /webhook - Processing webhook for transaction:", tx_ref, "status:", status);

    if (status === "success") {
      const reservationPayment = await completePayment(tx_ref);
      if (!reservationPayment) {
        console.log("[PAYMENT] POST /webhook - Processing as wallet top-up for:", tx_ref);
        try {
          await confirmTopUp(tx_ref);
        } catch (walletErr) {
          console.log("[PAYMENT] POST /webhook - Transaction not found in any table:", tx_ref);
        }
      } else {
        console.log("[PAYMENT] POST /webhook - Reservation payment completed for:", tx_ref);
      }
    } else {
      console.log("[PAYMENT] POST /webhook - Payment failed for transaction:", tx_ref);
      await failPayment(tx_ref);
    }

    return res.status(200).send("OK");
  } catch (error: any) {
    console.log("[PAYMENT] POST /webhook - Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default paymentRouter;
