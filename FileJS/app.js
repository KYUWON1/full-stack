const path = require('path');

const express = require('express');

const userRoutes = require('./routes/users');
const db = require('./data/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
//여기부분 잘 알기
app.use('/images',express.static('images')); // 방문자가 접근할수있도록 설정,다른 public과 구분하기위해, /image는 해당결로로 들어오게 설정

app.use(userRoutes);

db.connectToDatabase().then(function () {
  app.listen(3000);
});
