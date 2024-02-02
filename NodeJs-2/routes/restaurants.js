const express = require("express");
const uuid = require("uuid"); // 고유한 아이디를 지정해주는 라이브러리

const resData = require("../util/restaurant-data.js"); //해당 함수를 import, require를 통해 불러와야함,상대경로임

const router = express.Router();


router.get("/restaurants", function (req, res) {
  let order = req.query.order; // query를 통해 order를 가져옴, order는 restaurants.ejs에서 버튼클릭시 전달됨
  let nextOrder = 'desc';

  //버튼 클릭시 동적으로 값 변경기준값 할당 
  if (order != "asc" && order != "desc") {
    order = "asc";
  }

  if(order === 'desc'){
    nextOrder = 'asc';
  }

  const existingData = resData.getStoredRestaurants();

  existingData.sort(function (resA, resB) {
    // 이름 기준으로 정렬
    if (order ==='asc' && resA.name > resB.name) {
      //a가 b보다 크면 1을 반환, 즉 순서 뒤집기,오름차순
      return 1;
    }else if(order ==='desc' && resA.name < resB.name){
      return 1;
    } // a가 b보다 작으면 -1을 반환, 즉 순서 그대로,내림차순
    return -1;
  });

  res.render("restaurants", {
    numberOfRestaurants: existingData.length,
    restaurants: existingData,
    nextOrder: nextOrder,
  }); //ejs를 통해 변수값 전달해줌 restaurants.ejs에서 사용할 수 있음

  // const htmlFilePath = path.join(__dirname,'views','restaurants.html');
  // res.sendFile(htmlFilePath);
}); // 해당 경로로 접속시, views 폴더의 restaurants.html 파일을 sendFile을 통해 보여줌

//레스토랑의 웹으로 변경되는 동적 라우팅
router.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id; // :id 에 해당하는 값을 가져옴 ,id는 res-item에서 버튼클릭시 전달됨
  const existingData = resData.getStoredRestaurants();

  for (const restaurant of existingData) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurants-detail", {
        restaurant: restaurant,
      });
    }
  } // detail을 가져오고 rid로 해당 ID를 전달

  res.status(404).render("404"); // id를 찾지 못하면 404에러 페이지 출력
});

router.get("/recommend", function (req, res) {
  res.render("recommend");
});

router.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4(); // uuid를 통해 랜덤한 고유id를 생성해줌, restaurant에 id는 원래 없지만, js에선 생성해줌

  const storedRestaurants = resData.getStoredRestaurants();

  storedRestaurants.push(restaurant);

  resData.storeRestaurants(storedRestaurants);

  res.redirect("/confirm"); // 응답으로 confirm으로 redirection 해버림
});

router.get("/confirm", function (req, res) {
  res.render("confirm");
});

module.exports = router; // 해당 라우터를 다른 파일에서 사용할 수 있도록 export 해줌