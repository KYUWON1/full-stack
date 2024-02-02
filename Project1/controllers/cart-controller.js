const Product = require('../models/product-models');

function getCart(req,res) {
    res.render('customer/cart/cart');
}

async function addCartItem(req,res,next) {
    let product;
 
    try{
        product = await Product.findById(req.body.productId);
    }catch(error){
        return next(error);
    }   
    const cart = res.locals.cart; 
    cart.addItem(product);
    req.session.cart = cart; //세션에 locals 카트 저장

    res.status(201).json({
        message:'카트 업데이트',
        newTotalItems: cart.totalQuantity
    }); //AJAX를 통해 보낼것이기 때문에, 성공 status 201 전달
}

async function updateCartItem(req,res,next) {
    const cart = res.locals.cart;

    const updateItemData = cart.updateItem(req.body.productId, +req.body.quantity);

    //console.log(cart);
    
    req.session.cart = cart;

    res.json({
      message: "아이템 업데이트",
      updateCartData: {
        newTotalQuantity: cart.totalQuantity,
        newTotalPrice: cart.totalPrice,
        updateItemPrice: updateItemData.updateItemPrice,
      },
    });
}

module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};