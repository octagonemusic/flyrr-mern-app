const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { getLinkPreview } = require("link-preview-js");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, isCode, language } = req.body;

  if (!content || !chatId) {
    console.log("No message content or chat ID provided");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    isCode: isCode || false,
    language: language || "",
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchLinkPreview = asyncHandler(async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const data = await getLinkPreview(url, {
      timeout: 5000,
      followRedirects: "follow",
      headers: {
        "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
      },
    });
    res.json(data);
  } catch (error) {
    console.error("Link preview error:", error);
    res.status(400).json({ message: "Failed to fetch link preview" });
  }
});

module.exports = { sendMessage, allMessages, fetchLinkPreview };
