const path = require('path');

const express = require('express');
const session = require('express-session'); // session 호출
const mongodbStore = require('connect-mongodb-session'); // 몽고디비session 호출

const db = require('./data/database');
const demoRoutes = require('./routes/demo');

const MongoDBStore = mongodbStore(session); //세션을 몽고db에 연결

const app = express();

//세션을 저장할 저장소를 생성
const sessionStore = new MongoDBStore({
  uri:'mongodb://localhost:27017',
  databaseName:'auth-demo',
  collection:'sessions'
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
//미들웨어 함수 설정
app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge:60 * 60 * 1000 // 세션이 만료시간 설정, 밀리sec단위임 >1시간, 설정하지않으면 만료안됨
    }
  })
);  //미들웨어 함수로 session저장

//데이터를 전달해줄 미들웨어
//미들웨어를 사용해서 인증처리하면 모든곳에서 안해도되서 훨씬 편함!!
app.use(async function(req,res,next){
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;

  if(!user || !isAuth){
    return next(); //그 다음 미들웨어 함수로 넘어감
  }

  const userDoc = await db.getDb().collection('users').findOne({_id:user.id});
  const isAdmin = userDoc.isAdmin;

  res.locals.isAuth = isAuth; //일시적으로 변수를 전역변수처럼 사용할수있음 .locals 모든템플릿에서 사용가능
  res.locals.isAdmin = isAdmin;

  next();
});

//메인 라우트에 도달하기전에 위에 미들웨어가 실행됨 
app.use(demoRoutes);

app.use(function(error, req, res, next) {
  res.render('500');
})

db.connectToDatabase().then(function () {
  app.listen(3000);
});
