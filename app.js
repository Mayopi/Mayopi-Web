const express = require("express");

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

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`app is listening on http://localhost:3000`);
});
