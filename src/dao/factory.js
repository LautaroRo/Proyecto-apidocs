import { entorno } from "../config/variables.config.js";
import mongoose from "mongoose";
export let users;

switch (entorno.PERSISTENCIA) {
    case "MONGO":
        mongoose.connect(entorno.MONGOURL)    
        const {default: usersMongo} = await import("./mongo/Mongo.users.js")
        users = usersMongo
        break;

    default:
        break;
}