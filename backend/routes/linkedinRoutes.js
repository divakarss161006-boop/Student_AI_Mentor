const express = require("express");
const router = express.Router();
const {
  generateLinkedinPost,
  getLinkedinPosts,
} = require("../controllers/linkedinController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/generate", protect, generateLinkedinPost);
router.get("/posts", protect, getLinkedinPosts);

module.exports = router;
