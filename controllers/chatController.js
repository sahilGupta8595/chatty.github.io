const Chat = require("../models/chatSchema");
const Message = require("../models/messageSchema");
const User = require("../models/userSchema");

const createChat = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { userId } = req.body;
    if (!userId) {
      console.log("userId not given in chatController");
      return res.sendStatus(400);
    }

    // I have to check whether a chat already exists between both users ot not
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      try {
        const createdChat = await Chat.create({
          chatName: "sender",
          isGroupChat: false,
          users: [req.user._id, userId],
        });
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (err) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  } else {
    res.redirect("/login");
  }
};

const fetchChats = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    } catch (err) {
      res.status(400);
      throw new Error(error.message);
    }
  } else {
    console.log("first login into your account");
    res.redirect("/login");
  }
};

const createGroupChat = async (req, res, next) => {
  if (req.isAuthenticated()) {
    let { name, users } = req.body;

    if (!name || !users) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    users = JSON.parse(users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } else {
    console.log("first login into your account");
    res.redirect("/login");
  }
};

const renameGroup = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { chatName, chatId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } else {
    console.log("first login into your account");
    res.redirect("/login");
  }
};

const addToGroup = async (req, res, next) => {
  if (req.isAuthenticated()) {
    const { userId, chatId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  } else {
    console.log("first login into your account");
    res.redirect("/login");
  }
};

const removeFromGroup = async (req, res, next) => {
    if(req.isAuthenticated()){
        const { userId, chatId } = req.body;

        const removed = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId },
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        if (!removed) {
          res.status(404);
          throw new Error("Chat Not Found");
        } else {
          res.json(removed);
        }
    } else{
        console.log("first log into your account");
        res.redirect('/login')
    }
};

module.exports = {
  createChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
