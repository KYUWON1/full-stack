const express = require("express");

const router = express.Router(); // express의 라우터를 생상함


router.get("/", function (req, res) { // app. 과 같은 기능의 router로 변경
  res.render("index"); // ejs를 통해 보여줌, 이미 경로는 위에서 설정해놓았고, 확장자도 마찬가지임
});

router.get("/about", function (req, res) {
  res.render("about");
});

module.exports = router; // 해당 라우터를 다른 파일에서 사용할 수 있도록 export 해줌