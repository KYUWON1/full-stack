const db = require("../data/database");

const mongodb = require('mongodb');

class Order {
    //status에는 pending, fulfilled cancelled 세개가있음
    constructor(cart, userData, status='pending',date, orderId){
        this.productData = cart;
        this.userData = userData;
        this.status = status;
        this.date = new Date(date);
        if(this.date){
            this.formatDate = this.date.toLocaleDateString('en-US', {
                weekday:'short',
                day:'numeric',
                month:'long',
                year:'numeric',
            });
        }
        this.id = orderId;
    }

    static transformOrderDocument(orderDoc){
        return new Order(
          orderDoc.productData,
          orderDoc.userData,
          orderDoc.status,
          orderDoc.date,
          orderDoc._id,
        );
    }

    static transformOrderDocuments(orderDocs){
        return orderDocs.map(this.transformOrderDocument);
    }

    static async findAll() {
        const orders = await db.getDb().collection('orders').find().sort({_id:-1}).toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findAllForUsers(userId){
        const uid = new mongodb.ObjectId(userId);

        const orders = await db.getDb().collection('orders').find({'userData._id':uid}).sort({_id:-1}).toArray();
        return this.transformOrderDocuments(orders);
    }

    static async findById(orderId){
        const order = await db.getDb().collection('orders').findOne({_id:new mongodb.ObjectId(orderId)});
        
        return this.transformOrderDocument(order);
    }

    save(){
        let orderDocument
        if(this.id){
            const orderId = new mongodb.ObjectId(this.id);
            return db.getDb().collection('orders').updateOne({_id:orderId},{$set:{status: this.status}});
        }else {
            orderDocument = {
                userData:this.userData,
                productData:this.productData,
                date: new Date(),
                status: this.status,
            };
            return db.getDb().collection("orders").insertOne(orderDocument);
        }

    }
}

module.exports = Order;