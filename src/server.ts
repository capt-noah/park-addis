import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()
import router from "./routes/auth.routes";
import { env } from "./config/env";

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', router)

app.get('/', (req, res) => {
    return res.send("it actually works gng!!")
})

app.listen(4000, () => console.log("listening at port 4000...."))