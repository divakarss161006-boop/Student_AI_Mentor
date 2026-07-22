const express = require("express");
const router = express.Router();
const {
  analyzeLmsData,
  getLmsRecords,
} = require("../controllers/lmsController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/analyze", protect, analyzeLmsData);
router.get("/records", protect, getLmsRecords);

module.exports = router;
