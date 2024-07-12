import RouterMain from "./RouterMain.js";
import { users} from "../dao/factory.js";
import uploadProfiles from "./../config/multer.js"
class routerUsers extends RouterMain{

    init(){
        this.delete("/deleteUser/:email", this.deleteUser)
        this.put("/changeRole/:id", this.changeRole)
        this.post("/addFile/:email", uploadProfiles.single('file'), this.addFile)
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

        const result = await users.changeRole(id,user)

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

        await users.addFile(FirstUser._id, FirstUser)


        return res.json({status: "Succes"})
    }
}


export default new routerUsers()