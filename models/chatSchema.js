// Schema of a chat
// chatName
// isGroupChat
// latestMessage
// users
// groupAdmin

const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  chatName: {
    type: String,
    trim: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
}, {
    timestamps: true
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;