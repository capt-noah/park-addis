import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()
import authRouter from "./routes/auth.routes";
import parkingRouter from "./routes/parking.routes";
import reservationRouter from "./routes/reservation.routes";
import paymentRouter from "./routes/payment.routes"
import walletRouter from "./routes/wallet.routes";
import vehicleRouter from "./routes/vehicle.routes";

app.use(cors({
  origin: ["http://localhost:3000", "https://park-addis.vercel.app"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/parking', parkingRouter)
app.use('/api/locations', parkingRouter)
app.use('/api/reservation', reservationRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/wallet', walletRouter)
app.use('/api/vehicle', vehicleRouter)

app.get('/', (req, res) => {
    return res.send("it actually works gng!!")
})

app.listen(process.env.PORT, () => console.log(`listening... ${process.env.CHAPA_SECRET_KEY} and ${process.env.BACKEND_URL} and ${process.env.PORT}`))