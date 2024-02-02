const express = require("express");

const productController = require('../controllers/product-controller');

const router = express.Router();

router.get("/products", productController.getAllProduct);

router.get("/products/:id", productController.getProductDetail);

module.exports = router;
