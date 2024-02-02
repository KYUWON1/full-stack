const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'security',
  user: 'root',
  password: 'tlarbdnjs3011@@',
  multipleStatements: true  //해당 값은 디폴트값이아니라 설정해주어여함, 한번에 여러 쿼리문을 집어넣을수없도록하면됨
})

module.exports = pool;