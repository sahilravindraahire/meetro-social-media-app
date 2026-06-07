import multer from "multer"
import fs from "fs"
import path from "path"

if(!fs.existsSync("./public/temp")){
    fs.mkdirSync("./public/temp", {recursive: true})
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/temp")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

export const upload = multer({
    storage,
    limits: {fileSize: 10 * 1024 * 1024}
})