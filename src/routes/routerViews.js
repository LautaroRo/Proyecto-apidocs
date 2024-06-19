import RouterMain from "./RouterMain.js";


class routerViews extends RouterMain{
    init(){
        this.get("/", this.registerForm)
        this.get("/login", this.loginForm)
        this.get("/perfil", this.getProfile)
        this.get("/user", this.getUser)
    }

    registerForm(req,res){
        res.render("register")
    }

    loginForm(req,res){
        console.log(req.session.user, req.cookies)
        if(!req.session.user)return res.render("login")

        return res.redirect("/perfil")
    }

    getProfile(req,res){
        res.render("profile", {user: req.session.user})
    }

    async getUser(req,res){

        const result = await req.session.user
        console.log(result)
        res.json({succes: result})
    }
}


export default new routerViews()