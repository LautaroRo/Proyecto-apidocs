import RouterMain from "./RouterMain.js";
import { users} from "../dao/factory.js";
import moment from "moment";
import transport from "../config/mailing.js";
import uploadProfiles from "./../config/multer.js"
import { entorno } from "../config/variables.config.js";
class routerUsers extends RouterMain{

    init(){
        this.delete("/deleteUser/:email", this.deleteUser)
        this.put("/changeRole/:id", this.changeRole)
        this.post("/addFile/:email", uploadProfiles.single('file'), this.addFile)
        this.delete("/verficateConnection", this.connection)
        this.get("/getAllusers", this.getAllusers)
        this.put("/verificarCuenta", this.getVerficar)
        this.put("/premium/:email", this.premiumUser)
        this.put("/udpateUser/:email", this.updateUser)
        this.get("/deleteSession", this.deletesession)
    }

    deletesession(req,res){
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('No se pudo cerrar la sesión.');
            }
            res.clearCookie('User'); 
            return res.redirect('/login');
        });
    }
    async deleteUser(req, res) {
        try {
            const email = req.params.email
            const result = await users.deleteUser(email)

            if(!result) return res.json({status: "Error"})
                return res.json({status:"Succes"})

        } catch (error) {

            return res.json({status: error})
        }

    }

    async updateUser(req,res){

        const params = req.params.email
        const newUser = req.body
        const roles = ["Usuario", "Admin", "Premium"]
        try{
            if (newUser.role && !roles.includes(newUser.role)) {
                return res.json({ error: "Error, ingresaste un rol invalido" });
            }

            const get = await users.getOne(params)

            if(newUser.role === "Premium") return res.json({error: "Lo sentimos en esta ruta no se pede permitir ese cambio"})
            const update = await users.updateUser(get._id, newUser)
            
            if(!update.acknowledged) return res.json({error: "No se enviaron parametros correctos"})
            return res.json({status: "Succes"})

        }catch(error){
            return res.json({error:error})
        }
    }

    async getVerficar(req, res) {
        try {
            const { identificacion, domicilio, email } = req.body;
    
            if (!identificacion || !domicilio || !email) return res.json({ error: "Error: All fields are required" });
            
            const getUser = await users.getOne(email)
    
            if (!getUser) return res.json({ error: "User not found" });
            
            getUser.voucher = [{ identificacion, domicilio }];

            await users.updateUser(getUser._id,getUser);
    
            await getUser.save();

            return res.json({ status: "Success", user: getUser });
        } catch (error) {
            return res.json({ error: error.message });
        }
    }
    async changeRole(req,res){

        const id = req.params.id
        const user = req.body

        const FirstUser = await users.getOne(user.email)

        if(user.role === FirstUser.role){
            return res.json({status: "Ingrese otro rol"})
        }

        const validRoles = ["Premium", "Admin", "Usuario"];
        
        if (!validRoles.includes(user.role)) {
            return res.json({ status: "No existe ese rol" });
        }

        const result = await users.updateUser(id,user)

        if(!result) return res.json({status:"Error"})

        return res.json({status:"Succes"})
    }


    async addFile(req,res){
    
        const email = req.params.email
        const FirstUser = await users.getOne(email)

        const newDocument = {
            name: req.body.name,
            url: req.file.path,
        };


        FirstUser.documents.push(newDocument)

        await users.updateUser(FirstUser._id, FirstUser)


        return res.json({status: "Succes"})
    }

    
    async connection(req, res) {
        try {
            const usersConnects = await users.get();

            const now = moment();   
            let comparate
            for (let i = 0; i < usersConnects.length; i++) {
                const date = moment(usersConnects[i].last_connection, 'DD/MM/YYYY, HH:mm:ss');

                comparate = now.diff(date, "minutes");

                if(comparate < 10){

                    await users.deleteUser(usersConnects[i].email)

                    await transport.sendMail({
                        from:`Correo de  <${entorno.MAIL_USERNAME}/>`,
                        to: usersConnects[i].email,
                        subject: "Eliminacion de su cuenta",
                        html: `
                            <div>
                                <h1>Lo sentimos ${usersConnects[i].first_name} ${usersConnects[i].last_name}</h1>

                                <h3>Por politicas de la empresa tuvimos que eliminar su cuenta</h3>

                                <h5>Causa: Mas de 2 dias inactivo</h5>
                            </div>
                        `
                    })

                }

                comparate = ""
            }

            return res.json({ status: "Success" });

            
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }



    async getAllusers(req,res){

        try{

            const response = await users.get()

            const user = []

            for(let i = 0; i < response.length; i++){
                const newFormat = {
                    fullName: `${response[i].first_name} ${response[i].last_name}`,
                    email: response[i].email,
                    Role: response[i].role
                }

                user.push(newFormat)
            }
            return res.json({status: user})
        }catch(error){

            return res.json({status: error})
        }
    }

    async premiumUser(req,res){

        const user = req.params.email

        const get = await users.getOne(user)

        if(get.role === "Usuario") return res.json({error: "Lo sentimos debes tener el rol de Admin para poder ser premium"})
        if(get.role === "Premium") return res.json({error: "Ya eres un usuario Premium"})
            

        if (get.voucher.length < 1 ||!get.voucher[0].identificacion || !get.voucher[0].identificacion) {
            return res.status(400).json({ error: "Faltan datos en el voucher (identificación o domicilio)" });
        }


        get.role = "Premium"

        await users.updateUser(get._id, get)

        return res.json({succes: get})

    }
}


export default new routerUsers()