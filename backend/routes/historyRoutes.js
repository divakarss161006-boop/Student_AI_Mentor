const express = require("express");
const router = express.Router();
const {
  saveAnalysis,
  getHistory,
  getLatestByType,
  deleteHistoryItem,
} = require("../controllers/historyController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/")
  .get(protect, getHistory)
  .post(protect, saveAnalysis);

router.get("/latest/:type", protect, getLatestByType);
router.delete("/:id", protect, deleteHistoryItem);

module.exports = router;
