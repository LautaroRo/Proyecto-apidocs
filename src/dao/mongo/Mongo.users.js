import userModel from "./models/userModel.js";
import messagesModel from "./models/messagesModel.js";
import productsModel from "./models/productsModels.js";
import cartsModel from "./models/carritoModels.js";
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

    createMessage = async (message) => {
        let result = await messagesModel.create(message)
        return result
    }

    mostrarMensajes = async () => {

        let result = await messagesModel.find()

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

    deleteProduct = async (id) => {

        let result = await productsModel.deleteOne({ _id: id })
        return result
    }


    //cart

    getCartById = async (id) => {

        const result = await cartsModel.findById(id)

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

    addProductInCart = async (cid, pid, cantidad) => {

        let cart = await cartsModel.findById(cid);
        let producto = await productsModel.findById(pid)

        let product = cart.productsCart.find((producto) => producto.product.toString() === pid);


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
        cart.productsCart = cart.productsCart.filter(element => element.product.toString() !== pid)

        await cart.save();

        console.log("Producto eliminado del carrito");
    }


    updateProductInCart = async (cid, pid, body) => {

        let cart = await cartsModel.findById(cid)

        const filtrado = cart.productsCart.find(element => element.product.toString() == pid)

        filtrado.quantity = body.quantity;

        await cart.save();
    }

    deleteAllProduct = async (cid) => {

        let cart = await cartsModel.findById(cid)

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