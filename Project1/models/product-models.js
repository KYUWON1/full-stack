const mongodb = require('mongodb');

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price; //숫자로 얻기위해 + 사용
    this.description = productData.description;
    this.image = productData.image;
    this.updateImageData();
    if(productData._id ){
        this.id = productData._id.toString();
    }
  }

  static async findById(productId){
    let prodId;
    try{
      prodId = new mongodb.ObjectId(productId);
    }catch(error){
      error.code =404;
      throw error;
    }
    const product = await db.getDb().collection("products").findOne({ _id: prodId });
    if(!product){
      const error = new Error('Could not find product ID');
      error.code =404;
      throw error;
    }
    return new Product(product);
  }

  
  static async findAll( ){   //static으로 선언해 클래스 자체에서 호출할수있도록함
    const product = await db.getDb().collection('products').find().toArray();

    return product.map(function(product){ //map함수를 활용해 배열의
        return new Product(product); //모든 데이터에 대해 Product의 형태의 배열로 return해줌
    });
  }

  static async findMultiple(ids){
    const productIds = ids.map(function(id){
      return new mongodb.ObjectId(id);
    })

    const products = await db
      .getDb()
      .collection("products")
      .find({ _id:{ $in: productIds} })
      .toArray();

      return products.map(function(productDocument){
        return new Product(productDocument);
      })
  }

  updateImageData(){
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if(this.id){
      // ...
      const prodId = new mongodb.ObjectId(this.id);

      if(!this.image) {
        delete productData.image;
      }
      await db.getDb().collection("products").updateOne({ _id: prodId },
        {
        $set: productData
        });
    }
    else{
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  async replaceImage(newImage){
    this.image = newImage;
    this.updateImageData();
  }

  async remove(){
    const prodId = new mongodb.ObjectId(this.id);
    await db.getDb().collection("products").deleteOne({ _id: prodId });
  }
}

module.exports = Product;
