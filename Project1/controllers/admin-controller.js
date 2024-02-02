const Product = require('../models/product-models');
const Order = require('../models/order-models');

async function getProducts(req,res,next) {
    try{
        const products = await Product.findAll();
        res.render('admin/products/all-products',{products:products});
    }catch(error){
        return next(error);
    }
}

function getNewProduct(req,res) {

    res.render('admin/products/new-products');
}

async function createNewProduct(req,res,next) {
    const product = new Product({
        ...req.body,
        image: req.file.filename
    });
    try{
        await product.save();
    }catch(error){
        return next(error);
    }
     
    res.redirect('/admin/products');
}

async function getUpdateProduct(req,res,next){
    try{
        const product = await Product.findById(req.params.id);
        res.render('admin/products/update-products',{product:product});
    }catch(error){
        return next(error);
    }

}

async function updateProduct(req,res,next){
    const product = new Product({
        ...req.body,
        _id:req.params.id
    });

    if(req.file) {
        //새로운 이미지로 교체
        product.replaceImage(req.file.filename);
    }
    try{
        await product.save();
    }catch(error){
        return next(error);
    }

    res.redirect('/admin/products');
}

async function deleteProduct(req,res,next) {
    let product; 
    try{
        product = await Product.findById(req.params.id);
        await product.remove();
    }catch(error){
        return next(error);
    }

    //res.redirect('/admin/products');  응답을 기다리지않고 redirection됨 ajax로 처리하면
    res.json({message:'Deleted product!'}); //DATA를 전송해줌
}

async function getOrders(req,res,next){
    try{
        const orders = await Order.findAll();
        res.render('admin/orders/admin-orders',{
            orders:orders
        });
    }catch(error){
        next(error);
    }
}

async function updateOrder(req,res,next){
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;

    try{
        const order = await Order.findById(orderId);

        order.status = newStatus;

        await order.save();

        res.json({message:"주문 업데이트",newStatus: newStatus});
    }catch(error){
        next(error);
    }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};