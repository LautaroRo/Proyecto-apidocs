import dotenv from "dotenv"

dotenv.config()

export const entorno = {
    PORT: process.env.PORT,
    MONGOURL: process.env.MONGOURL,
    PERSISTENCIA: process.env.PERSISTENCIA,
    SECRETO: process.env.SECRETO,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    USERNAME_TEST: process.env.USERNAME_TEST,
    PASSWORD_TEST: process.env.PASSWORD_TEST
}