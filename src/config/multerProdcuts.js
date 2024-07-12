import multer from "multer";
import _dirname from "../utils.js";
const storagePorducts = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, `${_dirname}/public/images/Products`)
    },
    filename: function (req,file,cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix} - ${file.originalname}`) 
    }
})

const uploadProducts  = multer({ storage: storagePorducts });


export default uploadProducts