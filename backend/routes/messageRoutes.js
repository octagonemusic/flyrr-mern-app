const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
  fetchLinkPreview,
} = require("../controllers/messageControllers");

const router = express.Router();

router.get("/preview", protect, fetchLinkPreview);
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
