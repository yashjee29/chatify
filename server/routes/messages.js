const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const sendMessage = require("../controller/messages/sendMessages")
const getMessages = require("../controller/messages/getMessages")

router.post("/", auth, sendMessage)
router.get("/:chatId", auth, getMessages)

module.exports = router;