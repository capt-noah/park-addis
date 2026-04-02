import { Chapa } from "chapa-nodejs"
// import { env } from "./config/env"

const chapa = new Chapa({
    secretKey: `${process.env.CHAPA_SECRET_KEY}`
})

export default chapa