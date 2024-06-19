import mongoose from "mongoose";

const { Schema} = mongoose;
const collections = "users"

const ticketSchema = new Schema({
    code: String,
    product:String,
    purchaseDatetime: Date,
    amount: Number,
    purchaser: String
});
const SchemaDB = new Schema (
    {
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    number: Number,
    role: String,
    password: String,
    tickets: [ticketSchema]
    }

)


const userModel = mongoose.model(collections, SchemaDB)

export default userModel