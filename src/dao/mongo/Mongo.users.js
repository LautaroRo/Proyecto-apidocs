import userModel from "./models/userModel.js";
import productsModel from "./models/productsModels.js";
import cartsModel from "./models/carritoModels.js";
import mongoose from "mongoose";
class users {
    constructor() {

    }

    get = async () => {
        const result = await userModel.find()
        return result
    }

    getOne = async (email) => {

        const result = await userModel.findOne({ email: email })
        return result
    }

    createUser = async (user) => {
        const result = await userModel.create(user)

        return result
    }

    getUserById = async (id) => {
        const result = await userModel.findById(id)

        return result
    }



    deleteUser = async (email) => {
        let result = await userModel.deleteOne({email: email})

        return result
    }

    updateUser = async (id,user) => {
        let result = await userModel.updateOne({_id: id}, {$set: user})

        return result
    }

    //Products

    getAll = async () => {
        let result = await productsModel.find()

        return result
    }

    getProductById = async (id) => {
        let result = await productsModel.findById(id)
        return result

    }


    addProduct = async (product) => {

        let result = await productsModel.create(product)

        return result
    }

    updateProduct = async (product, id) => {
        let result = await productsModel.updateOne({ _id: id }, { $set: product })

        return result
    }

    deleteProduct = async (code) => {

        let result = await productsModel.deleteOne({ code: code })
        return result
    }


    //cart

    getCartById = async (id) => {

        const result = await cartsModel.findById(id)

        return result
    }

    getCartByUser = async (user) => {
        const result = await cartsModel.findOne({user: user})

        return result
    }
    createCart = async (userId) => {
        try {
            const result = await cartsModel.create({ user: userId, productsCart: [] });
            return result;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw error;
        }
    }

    deleteCart = async (id) => {

        const result = await cartsModel.deleteOne({user: id})
        
        return result

    }

    addProductInCart = async (cid, pid, cantidad) => {

        let cart = await cartsModel.findById(cid);
        let producto = await productsModel.findById(pid)

        let product = cart.productsCart.find((producto) => producto.product.toString() === pid.toString());


        const quantity = parseInt(cantidad)


        producto.stock -= quantity;
        await producto.save();

        if (product) {
            product.quantity += quantity;
        } else {
            cart.productsCart.push({ product: pid, quantity });
        }

        return await cart.save();

    }

    deleteProductInCart = async (cid, pid) => {

        let cart = await cartsModel.findById(cid)
        const productDelete = cart.productsCart.filter(element => element._id.equals(pid))
        cart.productsCart = cart.productsCart.filter(element => !element._id.equals(pid))
        let product = await productsModel.findById(productDelete[0].product)

        product.stock += productDelete[0].quantity

        await cart.save();
        await product.save();
        return cart
    }


    updateProductInCart = async (cid, pid, body) => {

        let cart = await cartsModel.findById(cid)

        const filtrado = cart.productsCart.find(element => element.product.toString() == pid)

        filtrado.quantity = body.quantity;

        await cart.save();
    }

    deleteAllProduct = async (cid) => {

        let cart = await cartsModel.findById(cid)
        for(let i = 0; cart.productsCart.length > i; i++){
            const product = cart.productsCart[i].product
            
            let productFind = await productsModel.findById(product)

            productFind.stock += cart.productsCart[i].quantity

            await productFind.save()
        }
        cart.productsCart = []
        await cart.save();
    }


    purchaseProduct = async(res, user) => {
        

        let numberRandom = ""
        for(let i = 0; 8 > i; i++){
            numberRandom += Math.floor(Math.random() * 100)
        }


        const obj = {
            code: numberRandom,
            product: res.product,
            purchaseDatetime: new Date(),
            amount: res.quantity,
            purchaser: user
        }


        let usuario = await userModel.findById(user)
        usuario.tickets.push(obj)

        await usuario.save()
    }

}

export default new users()