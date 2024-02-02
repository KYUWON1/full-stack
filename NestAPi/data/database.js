const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function initDb() {
    const client = await MongoClient.connect('mongodb://localhost:  27017');
    database = client.db('first-api');
}

function getDb(){
    if(!database){
        throw new Error('DB 연결 실패');
    }
    return database;
}

module.exports = {
  initDb: initDb,
  getDb: getDb,
};