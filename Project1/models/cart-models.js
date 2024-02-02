const Product = require('../models/product-models');

class Cart {
  constructor(items = [], totalQuantity = 0,totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };
 
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      
      //장바구니에 이미 들어있을떄 로직
      if (item.product.id === product.id) {
        this.items[i].quantity++;
        this.items[i].totalPrice += product.price;

        this.totalQuantity ++;
        this.totalPrice = this.totalPrice + product.price;
        return;
      }
    }

    this.items.push(cartItem); // 카트에 없으면 배열에추가
    this.totalQuantity += 1;
    this.totalPrice += product.price;
  }

  async updatePrice(){
    const productIds = this.items.map(function(item){
      return item.product.id;
    });

    const products = await Product.findMultiple(productIds);

    const deletableCartItemProductIds = [];

    for(const cartItem of this.items) {
      const product = products.find(function(prod){
        return prod.id === cartItem.product.id;
      });

      if(!product){
        //제품삭제부분
        deletableCartItemProductIds.push(cartItem.product.id);
        continue;
      }

      //데이터 수정부분
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    //장바구니에서 해당 배열부분 filter링 즉 삭제. gpt검색해보기
    if(deletableCartItemProductIds.length > 0){
      this.items = this.items.filter(function(item){
        return productIds.indexOf(item.product.id) < 0 ;
      });
    }
  
    //다시계산하기
    this.totalQuantity = 0 ;
    this.totalPrice = 0;
    for(const item of this.items){
      this.totalPrice = this.totalPrice + item.totalPrice;
      this.totalQuantity = this.totalQuantity + item.quantity;
    }
  }

  updateItem(productId, newQuantity) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const oldQuantity = item.quantity;
      
      if (item.product.id === productId && newQuantity > 0) {
        this.items[i].quantity = +newQuantity;
        this.items[i].totalPrice = newQuantity * item.product.price;

        const quantityChange = newQuantity - oldQuantity; // 새로운입력 - 현재값, 1개 2개 -1 

        this.totalQuantity = this.totalQuantity + quantityChange;
        this.totalPrice = this.totalQuantity * item.product.price;

        console.log(this);
        
        return {updateItemPrice:item.totalPrice};
      }else if (item.product.id === productId && newQuantity <= 0) {
        this.items.splice(i,1); //i번째 인덱스에서 1개 짤라냄, 즉 해당 인덱스값 삭제

        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice;

        console.log(this);
        
        return { updateItemPrice: 0 };
      }
    }

    
  }
}

module.exports= Cart;