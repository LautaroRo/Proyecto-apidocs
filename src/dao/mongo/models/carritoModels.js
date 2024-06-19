import mongoose from "mongoose"
const {Schema} = mongoose


const collection = "carts"

const schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    productsCart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]


})


const cartsModel = mongoose.model(collection, schema)

export default cartsModel