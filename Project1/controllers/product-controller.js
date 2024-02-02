const Product = require('../models/product-models');

async function getAllProduct(req,res,next){
  try{
    const products = await Product.findAll();
    res.render("customer/products/all-products",{products:products});
  }catch(error){
    return next(error);
  }
};

async function getProductDetail(req,res,next){
  let product;
  try{
    product = await Product.findById(req.params.id);
    res.render('customer/products/product-detail',{product:product});
  }catch(error){
    return next(error);
  }

}

module.exports = {
  getAllProduct: getAllProduct,
  getProductDetail: getProductDetail,
};