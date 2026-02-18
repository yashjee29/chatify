const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const getUsers = require('../controller/user/getUsers');

router.get("/", authMiddleware, getUsers);

module.exports = router;