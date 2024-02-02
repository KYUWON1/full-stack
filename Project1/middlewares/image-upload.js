const multer = require("multer");
const uuid = require('uuid').v4;

const upload = multer({ storage: multer.diskStorage({
    destination: 'product-data/images',
    filename: function(req,file,cb){  
        cb(null, uuid() + '-' + file.originalname);  //고유한 파일이름 생성해서 저장
    }
}) });

const configureMulterMiddleware = upload.single("image");

module.exports = configureMulterMiddleware;
