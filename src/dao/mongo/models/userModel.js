import mongoose from "mongoose";

const { Schema } = mongoose;
const collections = "users"

const ticketSchema = new Schema({
    code: String,
    product: String,
    purchaseDatetime: Date,
    amount: Number,
    purchaser: String
});
const SchemaDB = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        age: { type: Number, required: true },
        number: { type: Number, required: true },
        role: {
            type: String,
            enum: ['Usuario', 'Admin', 'Premium'],
            required: true
        },
        password: { type: String, required: true },
        tickets: [ticketSchema],
        documents: {
            type: [
                {
                    name: String,
                    url: String
                }
            ],
            default: []
        },
        voucher: {
            type: [
                {
                    identificacion: String,
                    domicilio: String
                }
            ],
            default: []
        },
        last_connection: { type: String }
    }

)


const userModel = mongoose.model(collections, SchemaDB)

export default userModel