const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connect(){
  const client = await MongoClient.connect("mongodb://localhost:27017"); // 로컬을 가르키는 URL에 연결, 시간이 걸릴수있으니
  //await를 통해서 실행시킴
  database = client.db('blog'); //해당 주소의 내가 만든 blog 데이터베이스를 가져옴
}

function getDb() {
    if(!database){
        throw {message: '데이터베이스 연결 오류'};
    }
    return database;
}

module.exports = {
    connectToDatabase:connect,
    getDb:getDb
}




