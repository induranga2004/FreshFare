const express = require("express");
const { chatWithAI, resetChat } = require("../Controllers/chatController.js");

const router = express.Router();
router.post("/", chatWithAI);
router.post("/reset", resetChat); // New chat reset route

module.exports = router;
