const express = require("express");

const db = require("../data/database"); // data의 db객체 생성

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const query = `
    SELECT posts.*,authors.name AS author_name FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id
    `; // ``를 사용해서 쿼리문의 가독성 증가
  const [posts] = await db.query(query);
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  // db에 쿼리 전달, 약간의 딜레이 있음, promise를 이용해 작업, 쿼리의 리턴값은 항상 배열임
  const [authors] = await db.query("SELECT * FROM authors"); //비구조화, 데이터 배열의 첫번째만 authors에 저장
  res.render("create-post", { authors: authors }); // 생성시 authors 전달
});

router.post("/posts", async function (req, res) {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  //DB에서 알아서 배열의 값을 순서대로 데이터에 집어넣음
  await db.query(
    "INSERT INTO posts (title,summary,body,author_id) VALUES (?)",
    [data]
  );
  res.redirect("/posts");
});

router.get("/posts/:id", async function (req, res) {
  const query = `
    SELECT posts.*,authors.name AS author_name,authors.email AS author_email FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?
    `;
  const [posts] = await db.query(query, [req.params.id]); // 첫번째 항목은 가져온데이터, 두번째는 메타 데이터
  if (!posts || posts.length === 0 ){
    return res.status(404).render('404');
  }

  const postData = {
    ...posts[0], // 우선 기존 데이터를 복사 
    date: posts[0].date.toISOString(), //날짜의 형식변환, 기계가 읽기 쉬운 형식
    humanReadableDate:posts[0].date.toLocaleDateString('ko-KR',{
        weekday: 'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    }) //사람이 읽기 쉬운 날짜 형식으로 변환 검색해서 참조, 사람이 읽는 형식
  };
  res.render("post-detail", { post: postData });
});

router.get("/posts/:id/edit",async function(req,res){
    const query = `
    SELECT * FROM posts WHERE id = ?
    `;
    const [posts] = await db.query(query,[req.params.id]);
    if (!posts || posts.length === 0) {
      return res.status(404).render("404");
    }

    res.render('update-post',{post:posts[0]});
});

router.post('/posts/:id/edit',async function(req,res){
    const query = `
    UPDATE posts SET title = ?, summary = ?, body = ?
    WHERE id = ?
    `;
    //바디는 POST로 전송된 데이터, params는 URL로 전송됨 데이터
    await db.query(query, [
      req.body.title,
      req.body.summary,
      req.body.content,
      req.params.id,
    ]);
    res.redirect('/posts'); 
});

router.post('/posts/:id/delete',async function(req,res){
    await db.query('DELETE FROM posts WHERE id = ?',[req.params.id]);
    res.redirect('/posts');
});

module.exports = router;
