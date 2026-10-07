import multer from "multer";


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/temp');
    },
    filename: function(req,file,cb){
        const uniqueSiffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,file.originalname + '-' + uniqueSiffix);
    }
});

export const upload = multer({
    storage
})