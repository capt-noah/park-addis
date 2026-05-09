import express from "express";
import {
  confirmTopUp,
  createWallet,
  failTopUp,
  getWallet,
  getWalletTransactions,
  payReservationFeeFromWallet,
  payReservationFromWallet,
  topUpWallet,
} from "../services/wallet.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { verifyChapaPayment } from "../services/payment.service";
import "../utils/logger";

const walletRouter = express.Router();

// 1. Get user wallet (session-based)
walletRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.user.id;
    console.log("[WALLET] GET / - Fetching wallet for user:", userId);

    const userWallet = await getWallet(userId);
    if (!userWallet) {
      console.log("[WALLET] GET / - Wallet not found for user:", userId);
      return res.status(404).json({ error: "Wallet Not Found" });
    }

    console.log("[WALLET] GET / - Wallet retrieved for user:", userId);
    return res.status(200).json(userWallet);
  } catch (error: any) {
    console.log("[WALLET] GET / - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Backward compatibility
walletRouter.post("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("[WALLET] POST /user - Fetching wallet for user:", userId);

    const userWallet = await getWallet(userId);
    if (!userWallet) {
      console.log("[WALLET] POST /user - Wallet not found for user:", userId);
      return res.status(404).json({ error: "Wallet Not Found" });
    }

    console.log("[WALLET] POST /user - Wallet retrieved for user:", userId);
    return res.status(200).json(userWallet);
  } catch (error: any) {
    console.log("[WALLET] POST /user - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

walletRouter.post("/create", async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("[WALLET] POST /create - Creating wallet for user:", userId);

    const userWallet = await createWallet(userId);
    if (!userWallet) {
      console.log("[WALLET] POST /create - Failed to create wallet for user:", userId);
      return res.status(403).json({ error: "Unable To Create Wallet" });
    }

    console.log("[WALLET] POST /create - Wallet created successfully for user:", userId);
    return res.status(200).json(userWallet);
  } catch (error: any) {
    console.log("[WALLET] POST /create - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

walletRouter.post("/transaction", async (req, res) => {
  try {
    const { walletId } = req.body;
    console.log("[WALLET] POST /transaction - Fetching transactions for wallet:", walletId);

    const walletTrx = await getWalletTransactions(walletId);
    if (!walletTrx) {
      console.log("[WALLET] POST /transaction - No transactions found for wallet:", walletId);
      return res.status(404).json({ error: "No Transaction Found" });
    }

    console.log(
      "[WALLET] POST /transaction - Retrieved",
      walletTrx.length,
      "transactions for wallet:",
      walletId,
    );
    return res.status(200).json(walletTrx);
  } catch (error: any) {
    console.log("[WALLET] POST /transaction - Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. Session-based topup
walletRouter.post("/topup", authMiddleware, async (req, res) => {
  try {
    const { amount, returnUrl } = req.body;
    const userId = res.locals.user.id;
    console.log("[WALLET] POST /topup - TopUp request for user:", userId, "amount: ETB", amount);

    const topupRes = await topUpWallet(userId, amount, returnUrl);
    if (!topupRes) {
      console.log("[WALLET] POST /topup - TopUp failed for user:", userId);
      return res.status(403).json({ error: "Unable To TopUp" });
    }

    console.log("[WALLET] POST /topup - TopUp initiated successfully for user:", userId);
    return res.status(200).json(topupRes);
  } catch (error: any) {
    console.log("[WALLET] POST /topup - Error:", error.message);
    return res.status(500).json({ error: error.message || "Top-up failed" });
  }
});

walletRouter.all("/callback", async (req, res) => {
  try {
    const tx_ref =
      req.body.tx_ref || req.query.tx_ref || req.body.trx_ref || req.query.trx_ref;

    console.log("[WALLET] /callback - Wallet callback received for transaction:", tx_ref);

    if (!tx_ref) {
      console.log("[WALLET] /callback - Missing transaction reference");
      return res.status(400).json({ error: "Missing transaction reference" });
    }

    const validChapa = await verifyChapaPayment(tx_ref);
    if (!validChapa) {
      console.log("[WALLET] /callback - Invalid payment verification for:", tx_ref);
      return res.status(401).json({ error: "Invalid Payment" });
    }

    if (validChapa.data && validChapa.data.status === "success") {
      console.log("[WALLET] /callback - Confirming top-up for transaction:", tx_ref);
      const topupResponse = await confirmTopUp(tx_ref);

      if (!topupResponse) {
        console.log("[WALLET] /callback - Failed to confirm top-up for:", tx_ref);
        return res.status(401).json({ error: "Unable To Complete TopUp" });
      }

      console.log("[WALLET] /callback - Top-up completed successfully for transaction:", tx_ref);
      return res.status(200).send("OK");
    }

    console.log("[WALLET] /callback - Top-up payment failed for transaction:", tx_ref);
    await failTopUp(tx_ref);
    return res.status(400).json({ error: "Payment Failed" });
  } catch (error: any) {
    console.log("[WALLET] /callback - Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

walletRouter.post("/pay/reservation", authMiddleware, async (req, res) => {
  try {
    const { reservationId, amount } = req.body;
    const userId = res.locals.user.id;
    console.log("[WALLET] POST /pay/reservation - Processing reservation payment for user:", userId, "amount: ETB", amount);

    const payRes = await payReservationFromWallet(userId, reservationId, amount);
    if (!payRes) {
      console.log("[WALLET] POST /pay/reservation - Failed to pay for reservation:", reservationId, "for user:", userId);
      return res.status(403).json({ error: "Unable To Pay For Reservation" });
    }

    console.log("[WALLET] POST /pay/reservation - Reservation payment successful for user:", userId);
    return res.status(200).json(payRes);
  } catch (error: any) {
    console.log("[WALLET] POST /pay/reservation - Error:", error.message);
    return res.status(400).json({ error: error.message || "Payment from wallet failed" });
  }
});

walletRouter.post("/pay/reservation-fee", authMiddleware, async (req, res) => {
  try {
    const { reservationId, amount } = req.body;
    const userId = res.locals.user.id;
    console.log("[WALLET] POST /pay/reservation-fee - Processing reservation fee for user:", userId, "amount: ETB", amount);

    const payRes = await payReservationFeeFromWallet(userId, reservationId, amount);
    if (!payRes) {
      console.log("[WALLET] POST /pay/reservation-fee - Failed to pay reservation fee for user:", userId);
      return res.status(403).json({ error: "Unable To Pay Reservation Fee" });
    }

    console.log("[WALLET] POST /pay/reservation-fee - Reservation fee payment successful for user:", userId);
    return res.status(200).json(payRes);
  } catch (error: any) {
    console.log("[WALLET] POST /pay/reservation-fee - Error:", error.message);
    return res.status(400).json({ error: error.message || "Reservation fee payment failed" });
  }
});

export default walletRouter;
