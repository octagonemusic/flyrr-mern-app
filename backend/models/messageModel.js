const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    isCode: { type: Boolean, default: false },
    language: { type: String, default: "" },
    linkPreview: {
      title: String,
      description: String,
      images: [String],
      url: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
