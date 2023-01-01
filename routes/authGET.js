const { Router } = require("express");
const router = Router();

const { authenticate } = require("../middlewares/authentication");

router.get("/dashboard", authenticate, (req, res) => {
  res.render("dashboard");
});

module.exports = router;
