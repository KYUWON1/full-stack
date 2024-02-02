const express = require("express");
const mongodb = require("mongodb"); // 우선 몽고 가져옴

const db = require("../data/database");

const ObjectId = mongodb.ObjectId; // ObjectID 사용하기위해 가져오

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  //모든 데이터를 가져오는데, title, summary, author.name만 가져오는 쿼리문
  const posts = await db
    .getDb()
    .collection("posts")
    .find({}, { title: 1, summary: 1, "author.name": 1 })
    .toArray();

  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  // db를 가져오고 원하는 collection에서 쿼리문실행시켜 배열로 db가져옴, promise리턴
  const authors = await db.getDb().collection("authors").find().toArray();
  console.log(authors);
  res.render("create-post", { authors: authors });
});

//사용자가 입력한 데이터 DB에 전달해주기
router.post("/posts", async function (req, res) {
  const authorId = new ObjectId(req.body.author);
  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: authorId }); // author 문서 반환

  const newPost = {
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    date: new Date(),
    author: {
      id: authorId, // ObjectID 객체생성후 호출로 ID 제출
      name: author.name, // author 문서에서 name만 가져옴
      email: author.email, // author 문서에서 email만 가져옴
    },
  };

  const result = await db.getDb().collection("posts").insertOne(newPost); // 만든 객체를 전달
  console.log(result);
  res.redirect("/posts");
});

router.get("/posts/:id", async function (req, res) {
  const postDetail = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(req.params.id) }, { summary: 0 });
  if (!postDetail) {
    return res.status(404).render("404");
  }

  postDetail.humanReadableDate = postDetail.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  postDetail.date = postDetail.date.toISOString();

  res.render("post-detail", { post: postDetail });
});

router.get("/posts/:id/edit", async function (req, res,next) {

  let ID = req.params.id;
  //미들웨어로 처리할수없기 때문에 try catch로 에러처리
  try{
    ID = new ObjectId(ID);
  }catch(error){
    //return res.status(404).render('404'); 
    return next(error);  //디폴트 에러헨들 미들에워로 넘어가게 해줌
  }
  const result = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: new ObjectId(ID) }, { title: 1, summary: 1, content: 1 });

  if (!result) {
    return res.status(404).render("404");
  }
  res.render("update-post", { post: result });
});

router.post('/posts/:id/edit', async function (req, res) {
  const postId = new ObjectId(req.params.id);
  const result = await db
    .getDb()
    .collection("posts")
    .updateOne(
      { _id: postId },
      {
        $set: {
          title: req.body.title,
          summary: req.body.summary,
          content: req.body.content,
        },
      }
    );

  res.redirect("/posts");
});

router.post('/posts/:id/delete', async function(req,res){
  const postId = new ObjectId(req.params.id);
  const result = await db.getDb().collection('posts').deleteOne({_id:postId});
   
  res.redirect('/posts');
});

module.exports = router;
