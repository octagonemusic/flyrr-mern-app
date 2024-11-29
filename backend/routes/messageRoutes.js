const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
  fetchLinkPreview,
} = require("../controllers/messageControllers");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.get("/preview", protect, fetchLinkPreview);

module.exports = router;
