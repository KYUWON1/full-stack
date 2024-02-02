const path = require("path");

const express = require("express");
const expressSession = require('express-session');
const csrf = require('csurf');
const createSessionConfig = require('./config/session');

const db = require("./data/database");
const addCsrfToken = require('./middlewares/csrf-token');
const errorHandler = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require("./middlewares/authenticate");
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartMiddleware = require('./middlewares/update-cart');
const authRouter = require("./routes/auth-routes");
const productRouter = require("./routes/product-routes");
const baseRouter = require("./routes/base-routes");
const adminRouter = require("./routes/admin-routes");
const cartRouter = require('./routes/cart-routes');
const orderRouter = require('./routes/order-routes');

const app = express();

app.set("view engine", "ejs"); //ejs를 view engine으로 사용하겟다
app.set("views", path.join(__dirname, "views")); // view의 경로를 지정해줌

app.use(express.static("public"));
app.use('/products/assets',express.static('product-data'));
app.use(express.urlencoded({extended: false}));
app.use(express.json()); //json형식의 데이터 체크

//세선경로 설정하는거 매우 복잡함 다시보기
const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());
 
app.use(cartMiddleware);
app.use(updateCartMiddleware);

app.use(addCsrfToken);
app.use(checkAuthStatusMiddleware);

app.use(baseRouter);
app.use(authRouter);
app.use(productRouter); //보호필요없음
app.use('/cart',cartRouter);

app.use(protectRoutesMiddleware);//admin 보호가 필요한 구간
app.use('/orders', orderRouter);
app.use('/admin',adminRouter); //admin으로 시작하는 경로는 여기서 출발

app.use(errorHandler);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("DB 연결실패");
    console.log(error);
  });

