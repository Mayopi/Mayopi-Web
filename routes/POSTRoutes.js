require("dotenv").config();
const { Router } = require("express");
const router = Router();
const controller = require("../controller/controller");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/contact", controller.contact_post);

router.post("/signup", controller.signup_post);

router.post("/login", controller.login_post);

module.exports = router;
