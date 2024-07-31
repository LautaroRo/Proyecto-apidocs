import { users } from "../dao/factory.js";
import RouterMain from "./RouterMain.js";


class routerViews extends RouterMain{
    init(){
        this.get("/", this.registerForm)
        this.get("/login", this.loginForm)
        this.get("/perfil", this.getProfile)
        this.get("/user", this.getUser)
        this.get("/createProducts", this.createProducts)
        this.get("/getProducts", this.getProducts)
        this.get("/destroySession", this.getSession)
        this.post("/cart", this.getCartInProduct)
        this.get("/renderCart", this.getCart)
    }
    async getCart(req, res) {
        const userId = req.session.user.id;
    
        let cart = await users.getCartByUser(userId);
        if (!cart) {
            cart = await users.createCart(userId);
        }
    
        const product = req.cookies.product;
        const ProductsFind = await users.getProductById(product?.idProduct);
        if(product){
    
            if(product.valueInput > ProductsFind.stock) return res.json({error: "Mas cantidad que stock disponible"})
                if (ProductsFind) {
                    if(req.session.user.role === "Premium") return res.json({error: "No puedes comprar tu propio producto"})
                    await users.addProductInCart(cart._id, ProductsFind._id, product.valueInput);
                }
            
        }


        cart = await users.getCartByUser(userId);

        let productsShow = [];
    
        for (let i = 0; i < cart.productsCart.length; i++) {
            const productInCart = cart.productsCart[i];

            const searchProduct = await users.getProductById(productInCart.product.toString());

            const obj = {
                title: searchProduct.title,
                description: searchProduct.description,
                thumbnails: searchProduct.thumbnails[0]?.img || 'No image available',
                alonePrice: searchProduct.price,
                totalPrice: searchProduct.price * productInCart.quantity,
                quantity: productInCart.quantity,
                ids: {
                    idProduct: productInCart._id.toString(),
                    idCart: cart._id.toString()
                }
                
            };

            productsShow.push(obj);
        }


        return res.render("cartUser", {product: productsShow})
    }

    getCartInProduct(req,res){
        res.cookie('product', req.body, { maxAge: 1000, httpOnly: true });
        return res.json({status: "Succes"})
    }
    getSession(req,res){
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error al cerrar sesión');
            }
        });
        res.clearCookie('User');

        return res.redirect("/login")
    }
    registerForm(req,res){
        res.render("register")
    }
    async getProducts(req,res){
        try{
            if(!req.session.user || !res.cookie)  return res.json({error: error})
            const products = await users.getAll()

            return res.render("getProducts", {products: products})
        }catch(error){
            return res.json({error: error})
        }

    }

    createProducts(req,res){
        try{
            const user = req.session.user

            if(user.role !== "Premium") return res.json({error: "Debes tener Role premium"})
            return res.render("CreateProducts")
        }catch(error){

        }
        res.render("CreateProducts")
    }

    loginForm(req,res){
        if(!req.session.user)return res.render("login")

        return res.redirect("/perfil")
    }

    getProfile(req,res){
        if(!req.session.user) return res.redirect("/login")

        if(req.session.user.role !== "Premium") return res.render("profile", {user: req.session.user, status: false})

        return res.render("profile", {user: req.session.user, status: true})
    }

    async getUser(req,res){

        const result = await req.session.user
        res.json({succes: result})
    }
}


export default new routerViews()