const Cart = require('../models/cart-models');

function initializeCart(req,res,next){
    let cart;

    //세션에 카트가 없으면 
    if(!req.session.cart){
        cart = new Cart();
    } else {
        const sessionCart = req.session.cart;
        cart = new Cart(
          sessionCart.items,
          sessionCart.totalQuantity,
          sessionCart.totalPrice
        );
    }

    res.locals.cart = cart; //Cart() 클래스를 locals.cart에 저장 메소드 호출할수있음

    next();
}

module.exports = initializeCart;