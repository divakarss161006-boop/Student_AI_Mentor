const Exam = require("../models/Exam");
const mongoose = require("mongoose");

/**
 * @desc    Get user exams
 * @route   GET /api/exams
 * @access  Private
 */
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ user: req.user._id }).sort({ examDate: 1 });
    return res.json({
      success: true,
      message: "Exams fetched successfully",
      data: exams,
    });
  } catch (error) {
    console.error("Get Exams Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching exams: " + error.message,
    });
  }
};

/**
 * @desc    Create a new exam entry
 * @route   POST /api/exams
 * @access  Private
 */
const createExam = async (req, res) => {
  try {
    const { subject, examName, examDate, targetMarks } = req.body;

    if (!subject || !examName || !examDate) {
      return res.status(400).json({
        success: false,
        message: "Subject name, exam title, and exam date are required",
      });
    }

    const exam = await Exam.create({
      user: req.user._id,
      subject: subject.trim(),
      examName: examName.trim(),
      examDate,
      targetMarks: Number(targetMarks) || 90,
    });

    return res.status(201).json({
      success: true,
      message: "Exam added to planner successfully",
      data: exam,
    });
  } catch (error) {
    console.error("Create Exam Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Server error creating exam: " + error.message,
    });
  }
};

/**
 * @desc    Update exam entry
 * @route   PUT /api/exams/:id
 * @access  Private
 */
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID format",
      });
    }

    const exam = await Exam.findOne({ _id: id, user: req.user._id });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const updatedExam = await Exam.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    return res.json({
      success: true,
      message: "Exam updated successfully",
      data: updatedExam,
    });
  } catch (error) {
    console.error("Update Exam Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Server error updating exam: " + error.message,
    });
  }
};

/**
 * @desc    Delete exam entry
 * @route   DELETE /api/exams/:id
 * @access  Private
 */
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID format",
      });
    }

    const exam = await Exam.findOneAndDelete({ _id: id, user: req.user._id });

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    return res.json({
      success: true,
      message: "Exam deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete Exam Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Server error deleting exam: " + error.message,
    });
  }
};

module.exports = {
  getExams,
  createExam,
  updateExam,
  deleteExam,
};
