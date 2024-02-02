const  fs = require('fs');

function readFile(){
    try{
        const fileData = fs.readFileSync('data.json');
        //함수내부에서 throw {message:'에러발생'} 같은 코드를 통해 메시지를 전달할수있음
    }catch(error){
        //console.log(error.message); 거기서 받은 메시지를 캐치에서 잡아서 콘솔로 출력할수있음
        console.log("에러발생");
    }
    console.log('Hi There!');
}

readFile(); 

//NOde JS에도 스코프 개념 존재함

module.exports = {
    readFile: readFile
}