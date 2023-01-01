// Dependencies
require("dotenv").config();
const axios = require("axios");
const { isEmail } = require("validator");
const { OAuth2Client, IAMAuth } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const util = require("util");

// Models

const { User } = require("../models/User");

// Middleware

app.use(cookieParser());

const { contactHandleErrors } = require("../middlewares/contact");
const { createToken } = require("../middlewares/createJWTToken");
const { signupHandleErrors } = require("../middlewares/signup");
const { loginHandleErrors } = require("../middlewares/login");
const { hashPassword } = require("../middlewares/hash");

const googleSignUp = async (req, res, credential) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let imageBuffer = await axios.get(payload.picture, {
      responseType: "arrayBuffer",
    });

    imageBuffer = Buffer.from(imageBuffer.data, "binary");

    await User.create({
      type: "Google",
      email: payload.email,
      email_verified: payload.email_verified,
      name: payload.name,
      image: {
        profile: {
          title: "testingimage.jpg",
          buffer: imageBuffer,
        },
      },
      password: await hashPassword(payload.sub),
    }).catch((error) => {
      const errors = signupHandleErrors(error);
      console.log(errors, "line 55");
    });

    const user = await User.find({ email: payload.email });

    return user;
  } catch (error) {
    const errors = signupHandleErrors(error);
    console.log(errors, "line 63");
    // res.status(400).json({ errors });
  }
};

module.exports.contact_post = (req, res) => {
  const start = performance.now();
  const { email, option, message } = req.body;

  try {
    if (!email) throw Error("Email must be included");
    if (!message) throw Error("Message must be included");
    if (!isEmail(email)) throw Error("Email must be a valid one");

    const options = {
      method: "POST",
      url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.SENDGRID_KEY,
        "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
        "Accept-Encoding": "identity",
      },
      data: `{"personalizations":[{"to":[{"email":"${process.env.EMAIL_SUPPORT}"}],"subject":"Mayopi Issues Report: ${option}"}],"from":{"email":"${email}"},"content":[{"type":"text/plain","value":"${message}"}]}`,
    };

    axios.request(options).then(function (response) {
      const end = performance.now();

      res.status(200).json({ message: "Successfully sending message", time: (end - start) / 1000 });
    });

    // const end = performance.now();
    // res.status(200).json({ message: "Successfully sending message", time: (end - start) / 1000 });
  } catch (error) {
    const start = performance.now();
    const errors = contactHandleErrors(error);
    const end = performance.now();
    res.status(400).json({ errors: error.message, time: (end - start) / 1000 });
  }
};

module.exports.signup_post = async (req, res, next) => {
  try {
    const start = performance.now();
    const { email, password, confirmPassword, credential } = req.body;

    if (credential) {
      const user = googleSignUp(req, res, credential);
      const token = createToken(user._id);

      res.cookie("jwt-token", token, {
        maxAge: 86400 * 3 * 1000,
      });

      res.redirect("/dashboard");
    } else {
      await User.create({
        email,
        password,
      })
        .then(async (response) => {
          const user = await User.find({ email });

          if (!user) throw Error("Failed creating new user, if this error persist please contact our Developer");

          const end = performance.now();

          res.status(200).json({ user, time: (end - start) / 1000 });
        })
        .catch((error) => {
          const errors = signupHandleErrors(error);
          const end = performance.now();
          res.status(400).json({ errors, time: (end - start) / 1000 });
        });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.login_post = async (req, res) => {
  const start = performance.now();
  const { email, password, credential } = req.body;

  if (credential) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const user = await User.find({ email: payload.email });

      if (user.length < 1) {
        googleSignUp(req, res, credential);
      }

      const token = createToken(user.id);

      res.cookie("jwt-token", token, {
        maxAge: 86400 * 3 * 1000,
      });

      res.status(200).redirect("/dashboard");

      // res.json({ payload });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const user = await User.find({ email });
      const compare = util.promisify(bcrypt.compare);
      const result = await compare(password, user[0].password);

      console.log(result);

      if (!result) throw Error("Incorrect Email or Password");

      const token = createToken(user._id);
      res.cookie("jwt-token", token, {
        maxAge: 86400 * 3 * 1000,
      });

      res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      const errors = loginHandleErrors(error);
      const end = performance.now();
      res.json({ errors, time: (end - start) / 1000 });
    }
  }
};
