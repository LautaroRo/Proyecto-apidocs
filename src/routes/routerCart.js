import RouterMain from "./RouterMain.js";
import { users } from "../dao/factory.js";
import mongoose from "mongoose";
class routerCart extends RouterMain{
    init(){
        this.get("/", this.getCart)
        this.post("/create/:uid", this.createCart)
        this.post("/purchase", this.purchaseProduct)
        this.delete("/deleteProducts", this.deleteProductInCart)
        this.delete("/deleteCart/:id", this.deleteCart)
        this.delete("/deleteAllProduct", this.deleteAllProduct)
    }


    async deleteAllProduct(req, res) {
        try {
            const userId = req.session.user.id;

            const ObjectNewId = new mongoose.Types.ObjectId(userId)
            let cart = await users.getCartByUser(ObjectNewId);
    

            if (!cart) {
                return res.status(404).send('Cart not found');
            }
    
            await users.deleteAllProduct(cart._id);
    

            return res.json({status: "Succes"})
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }
    async getCart(req,res) {
        const result = await users.getAll()
        res.json({products: result})
    }


    async createCart(req,res){
        const params = req.params.uid
        await users.createCart(params)
        res.send(params)
    }


    async purchaseProduct(req,res){

        const {pid, cid} = req.body
        const pidObjectId = new mongoose.Types.ObjectId(pid);

        const cart = await users.getCartById(cid);
        
        const result2 = cart.productsCart.find(element => element._id.equals(pidObjectId));


        if(result2) {
            await users.purchaseProduct(result2, cart.user)
            await users.deleteProductInCart(cid,pidObjectId)
            return res.json({status: "Succes"})
        }
        
        return res.json({status: "Rejected"})

    }

    async deleteProductInCart(req,res){
        const {cid,pid} = req.body

        
        const result = await users.deleteProductInCart(cid,pid)

        res.json({payload: result, status:"succes"})
    }


    async deleteCart(req,res){

        const id = req.params.id

        await users.deleteCart(id)

        
        res.json({status: "Succes"})
    }
}


export default new routerCart()