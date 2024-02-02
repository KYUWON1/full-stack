const express = require('express');
const xss = require('xss'); //xss를 막아줄 xss 호출

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.redirect('/discussion');
});

router.get('/discussion', async function (req, res) {
  const comments = await db.getDb().collection('comments').find().toArray();
  res.render('discussion', { comments: comments });
});

router.post('/discussion/comment', async function (req, res) {
  const comment = {
    text: xss(req.body.comment),  //사용장 생성 컨텐츠를 sanitize하고 저장해줌
  };

  await db.getDb().collection('comments').insertOne(comment);

  res.redirect('/discussion');
});

module.exports = router;
