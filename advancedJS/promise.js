//프로미스
const fs = require("fs/promises");

function readFile() {
  fs.readFile("data.txt").then(function(fileData){
    console.log(fileData.toString());
    //return anotherPromiseOper; // 비동기 코드작업 실행
  }).then(function(){
    //완료되면 실행시킬 동기코드를 다시 작성. 프로미스 체인연결
  }).catch(function(error){ //프로미스의 에러처리 부분
    console.log(error);
  }); // 프로미스객체로 fs하면, .then() 객체가짐, 데이터가 다 불러오면 then() 실행

  console.log("Hi There!");
}

readFile();
