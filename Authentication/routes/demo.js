const express = require("express");
const bcrypt = require("bcryptjs"); //암호화 해싱 라이브러리

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", function (req, res) {
  let sessionInputData = req.session.inputData; //이전에 잘못 입력한 데이터를 불러옴

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      confirmEmail: "",
      password: "",
    };
  }

  req.session.inputData = null; //추출한 데이터는 저장하고 DB에서 해당 데이터 삭제
  //그리고 HTML에 전달
  res.render("signup", { inputData: sessionInputData });
});

router.get("/login", function (req, res) {
  let sessionInputData = req.session.inputData; //이전에 잘못 입력한 데이터를 불러옴

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      password: "",
    };
  }

  req.session.inputData = null; //추출한 데이터는 저장하고 DB에서 해당 데이터 삭제

  res.render("login", { inputData: sessionInputData });
});

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const email = userData.email;
  const confirmEmail = userData["confirm-email"]; // 특수문자 - 가있기때문에 [] 로 접근
  const password = userData.password;

  //비밀번호의 유효성 검증부분
  if (
    !email ||
    !confirmEmail ||
    !password ||
    password.trim() < 6 ||
    email !== confirmEmail ||
    !email.includes("@")
  ) {
    console.log("잘못된 형식");
    //여기서 res.render()로 하면 양식을 다시 입력하라는 페이지가 나옴
    //POST 요청의 경우 보통 redirect 를 사용
    //redirect전에 session에 해당 데이터를 저장해서사용
    req.session.inputData = {
      hasError: true,
      message: "잘못된입력입니다.",
      email: email,
      confirmEmail: confirmEmail,
      password: password,
    };
    //db에 저장이 완료되면 redirect
    req.session.save(function () {
      res.redirect("/signup"); //여기서 return을 하면 if문이 끝나지않고 밑에 코드가 실행됨
    });
    return; //여기서 return 하면됨
  }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: email });

  if (existingUser) {
    req.session.inputData = {
      hasError: true,
      message: "유저가 이미 존재합니다.",
      email: email,
      confirmEmail: confirmEmail,
      password: password,
    };
    req.session.save(function () {
      res.redirect("/signup"); // 이미 존재하는 유저
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12); //해싱할 암호화 암호화의 강도를 전달

  //해싱된암호를 db에 전달
  const user = {
    email: email,
    password: hashedPassword,
  };

  //비밀번호를 그냥 그 자체 텍스트로 db에 저장하는것은 매우 위험.
  await db.getDb().collection("users").insertOne(user);

  res.redirect("/login");
});

router.post("/login", async function (req, res) {
  const userData = req.body;
  const email = userData.email;
  const password = userData.password;

  //데이터가 없으면 null, false반환
  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: email });

  if (!existingUser) {
    req.session.inputData = {
      hasError: true,
      message: "로그인 정보를 찾을수없습니다.",
      email: email,
      password: password,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  const hashedPassword = existingUser.password;
  const passwordAreEqual = await bcrypt.compare(password, hashedPassword); // 유저가입력한 암호와, 해당암호의 해쉬와 비교

  if (!passwordAreEqual) {
    req.session.inputData = {
      hasError: true,
      message: "로그인 정보를 찾을수없습니다.",
      email: email,
      password: password,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  //데이터베이스에서 가져온 데이터를 session에 저장 , DB에 저장
  //쿠키가 생성되고, 쿠키에는 세션ID가 저장됨
  req.session.user = { id: existingUser._id, email: existingUser.email };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/profile");
  }); //세션이 데이터베이스에 저장된후에 redirect되도록 코드작성
});

router.get("/admin", async function (req, res) {
  if (!req.locals.isAuth) { //미들웨어의 locals 변수를 이용해서 인증확인
    return res.status(401).render("401"); //인증되지않을때 401페이지 출력
  }

  const user = await db // 반약 admin을 local로 확인하면 굳이 db문을 사용하지않아도됨
    .getDb()
    .collection("users")
    .findOne({ _id: req.session.user.id }); //user = {id:...,email:..}

  //if(!req.locals.isAdmin) 으로 가능

  //admin인지 확인 id를 통해서 또 다른 session을 만들필요없음
  if (!user || !user.isAdmin) {
    return res.status(403).render("403"); // 403은 권한이없을때 알려줌
  }
  res.render("admin");
});

router.get("/profile", function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render("401"); //인증되지않을때 401페이지 출력
  }
  res.render("profile");
});

router.post("/logout", function (req, res) {
  //쿠키에서 데이터를 삭제하고, redirect그러나 await할필요가없음 인증이 필요가없으니까
  //그러나 세션을 삭제하지않아서 cookie는 남아있음, db에서도 user와 isAuthenticated의 데이터만 null인상태
  //쿠키가 생성되고 전달되고 저장되는 방식은 우리가 안해도되지만 어떻게 돌아가는지 잘 알아보기
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect("/");
});

module.exports = router;
