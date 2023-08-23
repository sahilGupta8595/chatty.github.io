const express = require("express");
const router = express.Router();

const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");

router.post("/send", sendMessage);
router.get("/get:chatId", allMessages);

module.exports = router;
