const express = require("express");
const router = express.Router();
const {
  getInternships,
  generateInternshipGuidance,
  getInternshipRecords,
} = require("../controllers/internshipController");
const { protect } = require("../middlewares/authMiddleware");

// Protected Live Internship search & AI ranking route
router.post("/search", protect, getInternships);

// Legacy guidance routes
router.post("/guidance", protect, generateInternshipGuidance);
router.get("/guidance", protect, getInternshipRecords);

module.exports = router;
