const express = require("express");
const router = express.Router();
const {
  getPerformanceAnalysis,
  getStudyPlan,
  getMentorChat,
  getResumeAnalysis,
  getResumeAnalysisUpload,
} = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// AI endpoints (protected by auth middleware)
router.post("/performance", protect, getPerformanceAnalysis);
router.post("/study-plan", protect, getStudyPlan);
router.post("/mentor", protect, getMentorChat);
router.post("/resume", protect, getResumeAnalysis);

// PDF Upload + Text Parsing + Gemini ATS Analysis Route
router.post(
  "/resume/upload",
  protect,
  upload.single("resume"),
  getResumeAnalysisUpload
);

module.exports = router;
