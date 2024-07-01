import RouterMain from "./RouterMain.js";
import { users } from "../dao/factory.js";

class routerCart extends RouterMain{
    init(){
        this.get("/", this.getCart)
        this.post("/create/:uid", this.createCart)
        this.post("/addProduct", this.addProduct)
        this.post("/purchase", this.purchaseProduct)
        this.delete("/deleteAllProduct", this.deleteProductInCart)
        this.delete("/deleteCart/:id", this.deleteCart)
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

    async addProduct(req,res){

        const {cid,pid,cantidad} = req.body

        const product = await users.getProductById(pid)
        const cart = await users.getCartById(cid)
        const user = await users.getUserById(cart.user)

        if(product.stock < cantidad) {
            console.log("paso")
            return res.send("No hay suficiente stock")
        }
        if(user.role === "Admin") return res.send("Lo sentimos solo los usuarios pueden agregar productos en el carrito")

        users.addProductInCart(cid,pid,cantidad)

        
        return res.json({succes: "Producto agregado"})
    }

    async purchaseProduct(req,res){

        const {cid, pid} = req.body

        const cart = await users.getCartById(cid)
        const result2 = cart.productsCart.find(element => element.product.equals(pid));
        
        if(result2) {
            await users.purchaseProduct(result2, cart.user)
            await users.deleteProductInCart(cid,pid)
            return res.send("enviado")
        }
        
        return res.send("No enviado")

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