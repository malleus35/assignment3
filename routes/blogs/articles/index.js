const express = require("express");
const router = express.Router({ mergeParams: true });
const commentRouter = require("./comments");
const pool = require("../../../module/poolAsync");
/* GET users listing. */
router.get("/", function(req, res, next) {
  const blogIdx = req.params.blogIdx;
  const query = `SELECT * FROM article WHERE blogIdx=${blogIdx}`;
  pool
    .queryParam_None(query)
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => console.log(err));
  /*
  GET 메서드를 이용해서 블로그 글 전체 보기
  1. poolAsync에서 메서드를 이용해서 전체 내용을 가져온다.
  2. 가져온 내용을 res.send()로 보내준다.
  */
});

router.get("/:articleIdx", function(req, res, next) {
  const articleIdx = req.params.articleIdx;
  const blogIdx = req.params.blogIdx;
  const query = `SELECT * FROM article WHERE articleIdx=${articleIdx} AND blogIdx=${blogIdx}`;
  pool
    .queryParam_None(query)
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => console.log(err));
  /*
  GET 메서드를 이용해서 글 하나만 보여준다.
  1. poolAsync에서 메서드를 이용해서, blogIdx와 맞는 데이터만 가져온다.
  2. 가져온 내용을 res.send()로 보내준다.
  */
});

router.post("/", function(req, res, next) {
  // 블로그 글 쓰기
  /*
  POST request 구현 방법
  1. poolAsync.param_none을 이용해서 쿼리문을 보내고, DB에 글을 추가한다.
  2. 추가를 완료했음을 페이지에 보내준다.
  */
  const blogIdx = req.params.blogIdx;
  const { articleIdx, name, author, contents } = req.body;
  const query = "INSERT INTO article values(?,?,?,?,?)";
  const value = [articleIdx, name, author, contents, blogIdx];
  pool
    .queryParam_Parse(query, value)
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => console.log(err));
});

router.put("/:articleIdx", function(req, res, next) {
  //블로그 글 수정하기 (어쩌면 PATCH가 더 좋을 지도 모르겠음)
  const articleIdx = req.params.articleIdx;
  const blogIdx = req.params.blogIdx;
  const { name, author, contents } = req.body;
  const query = `UPDATE article SET name='${name}', author='${author}', contents='${contents}' WHERE articleIdx=${articleIdx} AND blogIdx=${blogIdx}`;
  pool
    .queryParam_None(query)
    .then(data => {
      console.log(data);
      res.send("글 수정 완료");
    })
    .catch(err => console.log(err));
});

router.delete("/:articleIdx", function(req, res, next) {
  // 글 삭제하기
  const articleIdx = req.params.articleIdx;
  const blogIdx = req.params.blogIdx;
  const query = `DELETE FROM article WHERE articleIdx=${articleIdx} AND blogIdx=${blogIdx}`;
  pool
    .queryParam_None(query)
    .then(data => {
      console.log(data);
      res.send("블로그 삭제 완료");
    })
    .catch(err => console.log(err));
});

router.use("/:articleIdx/comments", commentRouter);
module.exports = router;
