import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()
import authRouter from "./routes/auth.routes";
import parkingRouter from "./routes/parking.routes";
import reservationRouter from "./routes/reservation.routes";
import paymentRouter from "./routes/payment.routes"
import walletRouter from "./routes/wallet.routes";

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/parking', parkingRouter)
app.use('/api/reservation', reservationRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/wallet', walletRouter)

app.get('/', (req, res) => {
    return res.send("it actually works gng!!")
})

app.listen(4000, () => console.log("listening at port 4000...."))