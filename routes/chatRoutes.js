const express = require("express");
const router = express.Router();
const {
  createChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");

router.post("/createchat", createChat);
router.get("/fetchchats", fetchChats);
router.post("/creategroupchat", createGroupChat);
router.put("/renamegroup", renameGroup);
router.put("/addtogroup", addToGroup);
router.put("/removefromgroup", removeFromGroup);

module.exports = router;
