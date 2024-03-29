const express = require("express");

const db = require("./data/database");
const todosRoutes = require("./routes/todo-routes");
const enableCors = require("./middlewares/cors");

const app = express();

app.use(enableCors); //cors 미들웨어
app.use(express.json());

app.use("/todos", todosRoutes);

app.use(function (error, req, res, next) {
  res.status(500).json({
    message: "Something went wrong!",
  });
});

db.initDb()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Connecting to the database failed!");
  });
