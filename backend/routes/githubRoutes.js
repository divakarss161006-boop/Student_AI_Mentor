const express = require("express");
const router = express.Router();
const {
  syncGithubProfile,
  getGithubProfile,
} = require("../controllers/githubController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/profile", protect, syncGithubProfile);
router.get("/profile", protect, getGithubProfile);

module.exports = router;
