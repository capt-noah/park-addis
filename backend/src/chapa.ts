import { Chapa } from "chapa-nodejs"

const chapa = new Chapa({
    secretKey: `${process.env.TEST_SECRET_KEY}`
})

export default chapa