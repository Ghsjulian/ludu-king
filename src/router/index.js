const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.post("/user/login", userController.UserLogin);

module.exports = router;
