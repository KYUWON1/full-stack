const express = require('express');
//file을 처리해줄 multer install
const multer = require('multer');

const db = require('../data/database');

//파일을 저장할 경로와 이름을 저장
const storageConfig = multer.diskStorage({
  destination: function(req,file,cb) {  // null은 에러처리, images는 폴더명
    cb(null,'images');
  },
  filename: function(req,file,cb){ // null은 에러처리 두번째는 파일명 
    cb(null, Date.now() + '-' +file.originalname);
  }
});

//multer를 이용해서 file을 처리할 upload라는 변수를 만들어줌
const upload = multer({ storage: storageConfig }); // 해당파일이 저장될 경로 

const router = express.Router();

router.get('/',async function(req, res) {
  const users = await db.getDb().collection('users').find().toArray();
  res.render('profiles',{users:users});
});

router.get('/new-user', function(req, res) {
  res.render('new-user');
});

//디폴트 미들웨어로 가기전에, multer로 거쳐서 가도록 설정
router.post('/profiles',upload.single('image'), async function(req,res){
  const uploadedImageFile = req.file; //멀터에서 파일을 입력받을수있음,file 객체에는 경로, 이름 등 다양한 속성이있음
  const userData = req.body;

  await db.getDb().collection('users').insertOne({
    name:userData.username,
    imagePath: uploadedImageFile.path
  })

  res.redirect('/');
});

module.exports = router;