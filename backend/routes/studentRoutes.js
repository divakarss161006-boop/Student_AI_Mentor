const express = require("express");
const router = express.Router();
const {
  getStudentProfile,
  upsertStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  getAllStudents,
} = require("../controllers/studentController");
const { protect } = require("../middlewares/authMiddleware");

// Protected Student Profile routes
router
  .route("/profile")
  .get(protect, getStudentProfile)
  .post(protect, upsertStudentProfile)
  .put(protect, updateStudentProfile)
  .delete(protect, deleteStudentProfile);

// Admin / List all students route
router.get("/", protect, getAllStudents);

module.exports = router;
