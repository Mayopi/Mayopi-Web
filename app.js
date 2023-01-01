require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const GETRouter = require("./routes/GETRoutes");
const POSTRouter = require("./routes/POSTRoutes");
const authGET = require("./routes/authGET");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.use(GETRouter);
app.use(POSTRouter);
app.use(authGET);

mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_LOCAL).then((response) => {
  app.listen(port, () => {
    console.log(`app is listening on http://localhost:3000`);
  });
});
