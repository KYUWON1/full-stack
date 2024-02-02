//const http = require('http'); //http 객체 생성

const fs = require('fs'); // 파일시스템 객체 생성 
const path = require('path'); // 경로 객체 생성

const express = require('express'); // express 객체 생성

const app = express();

app.use(express.urlencoded({extended: false})); // express가 body를 구문 분석할 수 있도록 설정

app.get('/currenttime',function(req,res){
    res.send('<h1>'+ new Date().toISOString() +'</h1>');
}); // 상태 코드를 별로로 지정하지않으면 200으로 알아서 보냄

app.get('/',function(req,res) {
    //form이 전송되어 저장될 경로 action, method는 전송방식Post는 서버가 저장해야할때, input은 입력박스, name은 키값이름
    res.send('<form action="store-user" method="POST"><label>Your Name: </label><input type="text" name="username"><button>Submit</button></form>');
});

app.post('/store-user',function(req,res){
    const userName = req.body.username; // 실제 데이터를 구문 분석하지 않기때문에 에러 발생 
    const filepath = path.join(__dirname,'data','users.json');

    const fileData = fs.readFileSync(filepath); //파일을 저장, but 원시데이터의 형태임
    const existingUsers = JSON.parse(fileData); // 원시데이터를 JSON을 통해 변환

    existingUsers.push(userName); // 배열에 이름 추가, 추가해야 업데이트가능함 

    fs.writeFileSync(filepath,JSON.stringify(existingUsers)); // 마찬가지로 가공데이터를 원시데이터로 반환해서 저장


    res.send('<h1>Username Stored!</h1>');
});

app.get('/users',function(req,res){
    const filePath = path.join(__dirname,'data','users.json'); //파일의 경로 
    const fileData = fs.readFileSync(filePath); // 원시데이터 파일 읽어오기
    const existingUsers = JSON.parse(fileData); // JSON을 통해 파일 배열로 가공하기

    let responseData = '<ul>'; // 데이터를 추가할 ul 생성

    for(const user of existingUsers) {
        responseData += '<li>'+user+'</li>'; // 배열에서 하나씩 아이템으로 저장 
    }

    responseData += '</ul>'; // 마무리 ul 작성 

    res.send(responseData); //가공된 데이터 보내기 
});

app.listen(3000);
