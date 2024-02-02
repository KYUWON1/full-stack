const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const client = await mongoClient.connect('mongodb://localhost:27017');
    database = client.db('online-shop');
}

function getDb(){
    if(!database){
        throw new Error('데이터베이스에 먼저 연결하세요.');
    }
    return database;
}

module.exports = {
  connectToDatabase: connectToDatabase,
  getDb: getDb,
};