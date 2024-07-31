import RouterMain from "./RouterMain.js";
import { users } from "../dao/factory.js";
import { CustomErrors } from "../CustomErrors/erros.js";
import uploadProducts from "../config/multerProdcuts.js";
class routerProducts extends RouterMain{
    init(){
        this.get("/", this.getProducts)
        this.put("/updateProduct/:id/:idUser", this.updateProduct)
        this.post("/addProduct", uploadProducts.single('file'), this.addProduct)
        this.delete("/deleteProduct/:code/:id", this.deleteProduct)
        this.get("/find/:id",  this.ProductsId)
        
    }


    async getProducts(req,res) {
        const result = await users.getAll()
        return res.json({products: result})
    }


    async deleteProduct(req,res){
        try{
            const params = req.params.code
            const params2 = req.params.id
            const verficateProduct = await users.getProductByCode(params)
            const user = await users.getUserById(params2)
            if(user.role !== "Premium") return res.json({error: "No posees el rol adecuado"})
            if(verficateProduct.owner !== `${user.first_name} ${user.last_name}`) return res.json({error: "Debes ser Owner para poder modificar"})
            await users.deleteProduct(params)

            res.json({status: "Producto eliminado"})
        }catch(error){
            res.json({error: error})
        }

    }


    async updateProduct(req,res){
        try{

            const params = req.params.id
            const params2 = req.params.idUser

            const user = await users.getUserById(params2)
            const product = await users.getProductById(params)
            if(user.role !== "Premium") return res.json({error: "No posees el rol adecuado"})
            if(product.owner !== `${user.first_name} ${user.last_name}`) return res.json({error: "Debes ser Owner para poder eliminarlo"})


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
        try{
            if(!req.session.user) return res.redirect("/login")

            const {title, description, category,stock,status, price} = req.body


            if(!title || !description || !category || !stock || !req.file|| !status || !price) {
                const error = CustomErrors.Errors("Error al crear un prducto", "faltan parametros", 1001)
                return res.json({error})
            }
            const statusModificate = status === "True" ? true : false
            const SotckModificte = parseInt(stock)
            const priceModificate = parseInt(price)
    
            let code = ""
    
            for(let i = 0; i < 5; i++){
                const abecedario = 'abcdefghijklmnopqrstuvwxyz';
                const number = Math.floor(Math.random() * 20)
    
                code += abecedario[i]
                code += number
            }
            const obj = {
                title,
                description,
                code,
                category,
                stock:SotckModificte,
                thumbnails: [{ img: req.file.filename }],
                status:statusModificate,
                price:priceModificate,
                owner: `${req.session.user.first_name} ${req.session.user.last_name}`
            }
            
            users.addProduct(obj)

            return res.redirect("/perfil")
        }catch(error){

        }

    }


}


export default new routerProducts()