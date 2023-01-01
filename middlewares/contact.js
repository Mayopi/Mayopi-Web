const contactHandleErrors = async (error) => {
  const errors = {
    email: "",
    message: "",
  };

  if (error.message == "Email must be included") {
    errors.email = error.message;
  }

  if (error.message == "Message must be included") {
    errors.message = error.message;
  }

  if (error.message == "Email must be a valid one") {
    errors.email = error.message;
  }

  return errors;
};

module.exports = { contactHandleErrors };
