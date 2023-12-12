const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateProfilePic,
  updatePassword,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/signup").post(registerUser);
router.post("/login", authUser);
router.route("/updateprofilepic").patch(protect, updateProfilePic);
router.route("/updatepassword").put(protect, updatePassword);

router.route("/").get(protect, allUsers);

module.exports = router;
