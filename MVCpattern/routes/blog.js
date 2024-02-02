const express = require('express');

const Post = require('../models/post');
const blogController = require('../controllers/post-controllers');
const guardRoute = require('../middlewares/auth-protection-middleware');

const router = express.Router();

router.get('/', blogController.getHome);

router.use(guardRoute); // 이렇게 미들웨어를 추가해도됨! 순서 매우 중요함

router.get('/admin',guardRoute, blogController.getAdmin); //미들웨어 추가 guardROute 거친다음 getAdmin으로 이동 

router.post('/posts', blogController.createPost);

router.get('/posts/:id/edit', blogController.getSinglePost);

router.post('/posts/:id/edit', blogController.updatePost);

router.post("/posts/:id/delete", blogController.deletePost);

module.exports = router;
