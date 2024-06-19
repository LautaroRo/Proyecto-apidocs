import RouterMain from "./RouterMain.js";
import passport from "passport";


class routeUsers extends RouterMain{
    init(){
        this.get("/Profile", this.traerUsuarios)
        this.post('/register', passport.authenticate('register', { 
            failureRedirect: '/failRegister' 
        }));
        
        this.post('/login', passport.authenticate('login'), (req, res) => {
            try{
                req.session.user = {
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    email: req.user.email,
                    role: req.user.role,
                    id: req.user._id
                };
                res.cookie("User", req.session.user, {maxAge:100000}).json({succes: req.session.user})
            }catch{
                res.send("No se logro")
            }
        });
    }


    async traerUsuarios(req,res){
        const nombreUsuario = req.session.user.first_name;
        console.log(req.session)
        res.send(`Hola, ${nombreUsuario}!`);
    }

}

export default new routeUsers()