const express = require('express');
const router = express.Router();
const registerController = require('../controller/auth/registerController');
const loginController = require('../controller/auth/loginController');
const verifyController = require('../controller/auth/verifyController');

router.post("/signup", registerController);

router.get("/verify", verifyController);

router.post("/login", loginController);

module.exports = router;