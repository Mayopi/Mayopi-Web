const bcrpyt = require("bcrypt");

const hashPassword = async (password) => {
  const result = await bcrpyt.hash(password, 10);

  return result;
};

module.exports = { hashPassword };
