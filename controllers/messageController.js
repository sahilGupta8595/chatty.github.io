const Chat = require("../models/chatSchema");
const Message = require("../models/messageSchema");
const User = require("../models/userSchema");

const sendMessage = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    try {
        var newMessage = await Message.create({
          sender: req.user._id,
          content: content,
          chat: chatId,
        })

        newMessage = await User.populate(newMessage, {
          path: "chat.users",
          select: "name email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
          latestMessage: newMessage,
        });

        res.json(newMessage); 
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } else {
    console.log("first log into your account");
    res.redirect("/login");
  }
};

const allMessages = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } else {
    console.log("first log into your account");
    res.redirect("/login");
  }
};

module.exports = {
  sendMessage,
  allMessages,
};
