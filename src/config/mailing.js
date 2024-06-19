import nodemailer from "nodemailer"
import { entorno } from "./variables.config.js"
const transport = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    secure:false,
    port:587,
    auth: {
        user: entorno.MAIL_USERNAME,
        pass: entorno.MAIL_PASSWORD
    }
})

export default transport