const { Router } = require("express");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

const router = Router();

router.get("/pricing", (req, res) => {
  res.render("pricing");
  //   res.json({ message: "pricing list" });
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.cookie("jwt-token", "");

  res.redirect("/");
});

module.exports = router;
