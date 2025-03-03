import multer from "multer";
import _dirname from "../utils.js";

const storageProfiles = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, `${_dirname}/public/images/Profiles`)
    },
    filename: function (req,file,cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix} - ${file.originalname}`) 
    }
})

const uploadProfiles = multer({ storage: storageProfiles });


export default uploadProfiles;