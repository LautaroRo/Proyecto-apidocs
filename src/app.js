import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import handlebars from "express-handlebars"
import passport from "passport"
import cookieParser from "cookie-parser"
import initializePassport from "./config/passportConfig.js"
import { entorno } from "./config/variables.config.js"
import path from "path"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import _dirname from "./utils.js"
import routerUsers from "./routes/routerUsers.js"
import routerViews from "./routes/routerViews.js"
import routerProducts from "./routes/routerProducts.js"
import routerCart from "./routes/routerCart.js"
import routerSessions from "./routes/routerSessions.js"
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



const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.use('/public', express.static(path.join(_dirname, 'public')));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", _dirname + "/views");

app.use("/", routerViews.getRouter())
app.use("/api/sessions", routerSessions.getRouter())
app.use("/api/products", routerProducts.getRouter())
app.use("/api/cart", routerCart.getRouter())
app.use("/api/users", routerUsers.getRouter())


app.listen(entorno.PORT, () => console.log("Corriendo"))

