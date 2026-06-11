import multer from "multer";
import path from "path";

// penyimpanan sementara di memeroy ram
const storage = multer.memoryStorage()

const fileFilter  = (req, file, cb ) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase()
    if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
        return cb(new Error("yang diipunt hanya bisa berformat gambar (.jpg, .jpeg, .png)"))
    }
    cb(null, true)
}

const upload = multer({storage, fileFilter})

export default upload