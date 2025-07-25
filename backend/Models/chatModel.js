const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  messages: [
    {
      role: String, // "user" or "assistant"
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
