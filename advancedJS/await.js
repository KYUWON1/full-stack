//await
const fs = require("fs/promises");

async function readFile() { //async를 붙이면, 함수안에서 await를 사용할수있음
  let fileData;
  try{
     fileData = await fs.readFile("data.txt"); //프로미스객체 리턴함, await는 해당 프로미스 객체가 완료댈때까지 기다림
  }catch(error){
  }
  console.log(fileData.toString());
  console.log("Hi There!");
}

readFile();
