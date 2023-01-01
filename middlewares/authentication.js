require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies["jwt-token"];
    if (!token) {
      res.redirect("/login");
      throw Error("Token not found!");
    }

    jwt.verify(token, process.env.JWT_SIGNATURE, (err, result) => {
      if (err) {
        res.redirect("/login");
        throw Error("Invalid token");
      }

      next();
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { authenticate };
