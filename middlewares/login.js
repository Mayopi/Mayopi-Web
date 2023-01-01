const loginHandleErrors = (error) => {
  const errors = {
    message: "",
  };

  if (error.message == "Incorrect Email or Password") {
    errors.message = error.message;
  }

  return errors;
};

module.exports = { loginHandleErrors };
