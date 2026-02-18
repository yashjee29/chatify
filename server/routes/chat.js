const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const createChat = require('../controller/chat/createChat');
const getMyChats = require('../controller/chat/getMyChats');
const createGroupChat = require('../controller/chat/createGroupChat');

router.get('/', authMiddleware, getMyChats);
router.post('/', authMiddleware, createChat);
router.post('/group', authMiddleware, createGroupChat);

module.exports = router;