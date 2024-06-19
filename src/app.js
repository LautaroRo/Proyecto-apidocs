import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import handlebars from "express-handlebars"
import passport from "passport"
import cookieParser from "cookie-parser"
import initializePassport from "./config/passportConfig.js"
import routerSessions from "./routes/routerSessions.js"
import { entorno } from "./config/variables.config.js"
import routerViews from "./routes/routerViews.js"
import routerProducts from "./routes/routerProducts.js"
import routerCart from "./routes/routerCart.js"
import { Server } from "socket.io"
import { users } from "./dao/factory.js"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import _dirname from "./utils.js"

const app = express()
//apiproducts
const swaggerOptionsProducts = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            title:"API Adopme",
            description: "La API facilita la adopcion al propociornar un conjunto de endpoints para gestionar al proceso de adopcion"
        }
    },
    apis:[`${_dirname}/./docs/Products/Products.yaml`]
}

const specsProducts = swaggerJSDoc(swaggerOptionsProducts) 

app.use("/apidocsProducts", swaggerUiExpress.serve, swaggerUiExpress.setup(specsProducts))

//ApiCarrito
const swaggerOptionsCarts = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            title:"API Adopme",
            description: "La API facilita la adopcion al propociornar un conjunto de endpoints para gestionar al proceso de adopcion"
        }
    },
    apis:[`${_dirname}/./docs/Carrito/Carrito.yaml`]
}

const specsCarts = swaggerJSDoc(swaggerOptionsCarts) 

app.use("/apidocsCarrito", swaggerUiExpress.serve, swaggerUiExpress.setup(specsCarts))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(_dirname + "/public"))
app.use(cookieParser())
app.use(
    session({
        store: new MongoStore({
            mongoUrl: entorno.MONGOURL,
            ttl:3600
        }),
        secret: entorno.SECRETO,
        resave: false,
        saveUninitialized: false
    })
)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())




app.engine("handlebars", handlebars.engine())
app.set("views", _dirname + "/views")
app.set("view engine", "handlebars")

app.use("/", routerViews.getRouter())
app.use("/api/sessions", routerSessions.getRouter())
app.use("/api/products", routerProducts.getRouter())
app.use("/api/cart", routerCart.getRouter())

const servidor = app.listen(entorno.PORT, console.log("Corriendo"))

const io = new Server(servidor)
const msg = []
io.on("connection", socket => {

    socket.on("message", (data) => {
        msg.push(data)
        users.createMessage(data)
        io.emit("messageLogs", msg)

    })

})