const User = require("../models/user-model");

const authUtil = require("../util/authentication");

const validation = require("../util/validation");

const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  
  if(!sessionData){
    sessionData = {
      email:'',
      confirmEmail:'',
      password:'',
      fullname:'',
      street:'',
      postal:'',
      city:'',  
    };
  }

  res.render("customer/auth/signup", { inputData: sessionData} ); // views가 기본값으로 설정되어있어서 거기서부터 경로 시작하면됨
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "입력이 옳바르지않습니다. 비밀번호는 6자이상. 우편번호는 5자리입니다.",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    //비동기 작업에 대한 에러처리
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(req,{
        errorMessage:'이미 해당 사용자가 존재합니다.',
        ...enteredData
      },function(){
        res.redirect("/signup");
      })
      return;
    }

    await user.signup();
  } catch (error) {
    return next(error);
  }
  res.redirect("/login");
}

function getLogin(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("customer/auth/login", {inputData:sessionData});
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingData;
  try {
    existingData = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  } 

  if (!existingData) {
    sessionFlash.flashDataToSession(req,{
      errorMessage:'해당 계정이 존재하지않습니다.',
      email:user.email,
      password:user.password,
    },function(){
      res.redirect("/login");
    })
    return;
  }

  const hashedPassword = existingData.password;
  const passwordAreEqual = await user.hasMatchingPassword(hashedPassword);

  if (!passwordAreEqual) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "비밀번호가 틀렸습니다.",
        email: user.email,
        password: user.password,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  authUtil.createUserSession(req, existingData, function () {
    res.redirect("/");
  });
} 

async function logout(req, res, next) {
  authUtil.deleteUserCookie(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
