const signupHandleErrors = (error) => {
  console.log(error);

  console.log(error.code);
  let errors = "";

  if (error.code === 11000) {
    errors = "Email has already been registered";
  }

  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors = properties.message;
    });
  }

  return errors;
};

module.exports = { signupHandleErrors };
