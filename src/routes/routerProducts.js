import RouterMain from "./RouterMain.js";
import { users } from "../dao/factory.js";
import { CustomErrors } from "../CustomErrors/erros.js";
class routerProducts extends RouterMain{
    init(){
        this.get("/", this.getProducts)
        this.put("/updateProduct/:id", this.updateProduct)
        this.post("/addProduct", this.addProduct)
        this.delete("/deleteProduct/:code", this.deleteProduct)
        this.get("/find/:id", this.ProductsId)
        
    }


    async getProducts(req,res) {
        const result = await users.getAll()
        return res.json({products: result})
    }


    async deleteProduct(req,res){
        try{
            const params = req.params.code

            await users.deleteProduct(params)

            res.json({status: "Producto eliminado"})
        }catch(error){
            res.json({error: error})
        }

    }


    async updateProduct(req,res){
        try{

            const params = req.params.id
            const body = req.body
            
            const result = await users.updateProduct(body, params)

            return res.json({payload: result})

        }catch(error){
            return res.json({error:error})
        }
    }


    async ProductsId(req,res){
        try {
            const id = req.params.id;
            const result = await users.getProductById(id);
    
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Producto no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error al encontrar un producto", error: error.message });
        }
    }
    async addProduct(req,res){
        const {title, description, code, category,stock,thumbnails,status, price} = req.body

        if(!title || !description || !code || !category || !stock || !thumbnails || !status || !price) {
            const error = CustomErrors.Errors("Error al crear un prducto", "faltan parametros", 1001)
            return res.json({error})
        }
        const obj = {
            title,
            description,
            code,
            category,
            stock,
            thumbnails: thumbnails,
            status,
            price
        }

        users.addProduct(obj)
        res.send("Producto creado")
    }


}


export default new routerProducts()