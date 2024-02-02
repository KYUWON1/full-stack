const express = require("express");

const adminController = require('../controllers/admin-controller');

const imageUploadMiddleWare = require('../middlewares/image-upload');

const router = express.Router();


router.get("/products", adminController.getProducts);

router.get("/products/new", adminController.getNewProduct);

router.post("/products", imageUploadMiddleWare, adminController.createNewProduct);

router.get("/products/:id", adminController.getUpdateProduct);

router.post("/products/:id",imageUploadMiddleWare, adminController.updateProduct);

//Ajax를 통한 삭제연습
router.delete("/products/:id", adminController.deleteProduct);

router.get('/orders',adminController.getOrders);

router.patch('/orders/:id',adminController.updateOrder);

module.exports = router;
