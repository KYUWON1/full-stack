const mysql = require('mysql2/promise'); // 동기화처리를 위해 

const pool = mysql.createPool({
    host:'localhost', //데이터베이스가 현재 내 컴퓨터에서 실행중이니, localhost
    database:'blog', // 데이터베이스의 이름 
    user:'root', // 데이터베이스 접속을 위한 사용자 이름
    password:'tlarbdnjs3011@@', // 내 데이터 베이스 비밀번호
}); // 데이터 베이스에 연결, createPool을 이용하면 더 요청이 많은 큰서버에서 많은 요청에 용이함

module.exports = pool;