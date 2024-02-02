const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname,"..","data", "restaurants.json"); // 경로수정

function getStoredRestaurants() {
  const fileData = fs.readFileSync(filePath);
  const existingData = JSON.parse(fileData);

  return existingData;
}

function storeRestaurants(restaurant) {
  fs.writeFileSync(filePath, JSON.stringify(restaurant));
}

module.exports = {  // 해당 함수를 다른 파일에서 사용할 수 있도록 export 해줌, 우측변수가 해당 함수 좌측은 키값
    getStoredRestaurants: getStoredRestaurants,
    storeRestaurants: storeRestaurants
};
