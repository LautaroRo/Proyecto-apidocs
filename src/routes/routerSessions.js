import { users } from "../dao/factory.js";
import RouterMain from "./RouterMain.js";
import passport from "passport";


class routeUsers extends RouterMain {
    init() {
        this.get("/Profile", this.traerUsuarios)
        this.post('/register', passport.authenticate('register', {
            failureRedirect: '/failRegister'
        }), (req, res) => {

            try {
                return res.json({ status: "succes" });
            } catch (error) {
                return res.json({ error: error })
            }

        });

        this.post('/login', passport.authenticate('login'), (req, res) => {
            try {

                req.session.user = {
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    email: req.user.email,
                    role: req.user.role,
                    id: req.user._id
                };
                res.cookie("User", req.session.user, { maxAge: 100000 })

                return res.json({ status: "Succes" })
            } catch {
                res.send("No se logro")
            }
        });
        this.delete("/deleteUser/:email", this.deleteUser)
    }


    async deleteUser(req, res) {
        try {
            const email = req.params.email
            console.log(email)
            const result = await users.deleteUser(email)

            if(!result) return res.json({status: "Error"})
            
                return res.json({status:"Succes"})

        } catch (error) {

            return res.json({status: error})
        }

    }
    async traerUsuarios(req, res) {
        const nombreUsuario = req.session.user.first_name;

        res.send(`Hola, ${nombreUsuario}!`);
    }

}

export default new routeUsers()