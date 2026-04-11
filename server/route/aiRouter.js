const express = require('express');
const { chatWithAI, smartReply } = require('../controller/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/chat", protect, chatWithAI);
router.post("/smart-reply", protect, smartReply);

module.exports = router;
