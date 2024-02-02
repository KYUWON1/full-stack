const path = require("path");

const express = require("express");


const defaultRoutes = require("./routes/default.js"); // 라우터를 import  
const restaurantRoutes = require("./routes/restaurants.js"); // 라우터를 import

const app = express();

app.set("views", path.join(__dirname, "views")); // views 폴더를 views로 지정
app.set("view engine", "ejs"); // ejs 를 사용하기 위해 view engine을 ejs로 설정

app.use(express.static("public")); // HTML 에서 css,js,image 파일을 사용하기 위해 public 폴더를 static 폴더로 지정
//하면 접근해서 사용 할 수 있음
app.use(express.urlencoded({ extended: false }));
app.use('/',defaultRoutes); // 라우터를 사용하기 위해 미들웨어로 등록, 라우터를 사용해 모든 경로가 defaultRoutes로 유입
//defaultRoutes에 일치하는 경로가 없으면, 밑에 get함수들이 실행됨 
app.use('/',restaurantRoutes); // 라우터를 사용하기 위해 미들웨어로 등록, 마찬가지로 나머지 파일도 설정


app.use(function(req,res){  // 처리받지 못한 모든 URL에 대해 404 페이지 출력, 404는 유저가 잘못해서 생긴 에러!임거의
  res.status(404).render("404"); // 체인호출을 통해 status()에서 404상태로 변환, 그럼 개발자도구에서도 404출력.
});

app.use(function(error,req,res,next){  //서버에서 에러가 발생했을때 500에러를 출력할 부분
  res.status(500).render("500"); // 에러발생시 500 페이지 출력
}); 

app.listen(3000);
