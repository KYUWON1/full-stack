//동기와 비동기함수 차이점알기, 콜백함수
const fs = require("fs");

function readFile() {
  const fileData = fs.readFileSync("data.txt"); //readFileSync는 동기적으로 파일을 읽어옴, 다른 코드 실행을 막음
  // 만약 ? 파일이 너무커서 읽어오는데 시간이 오래걸린다면?

  //async로 바꿀수있음, but, 실행완료시 보낼 함수를 지정해주어야함, 그리고 리턴값이없고, 실행완료시 function을 콜백
  fs.readFile("data.txt", function (error, fileData) {
    console.log("done"); // 완료를 기다리지않고 코드를 바로 실행해서, fileData.toString()이 실행되지않음
    console.log(fileData.toString()); // 이렇게 하면 정상적으로 마지막에 출력됨
    //데이터베이스 비동기 작업 시작부분
    // if(error) 를 통해서 , 콜백함수의 에러처리를 할수있음
  });

  console.log(fileData); //<Buffer 74 68 69 73 20 77 6f 72 6b 21 20 74 65 78 74 20 64 61 74 61 21> 이렇게 출력됨 기본으로
  console.log(fileData.toString()); // 정상적으로 출력됨, 기존의 JSON.parse()와 같은 역할
  console.log("Hi There!");
}

readFile();
