require("dotenv").config();
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SIGNATURE, {
    algorithm: "HS256",
    expiresIn: "3d",
  });

  return token;
};

module.exports = { createToken };
