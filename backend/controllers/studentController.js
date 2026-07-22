const Student = require("../models/Student");
const mongoose = require("mongoose");

/**
 * @desc    Get student profile for logged in user
 * @route   GET /api/students/profile
 * @access  Private
 */
const getStudentProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user._id });

    if (!student) {
      student = await Student.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
      });
    }

    return res.json({
      success: true,
      message: "Student profile fetched successfully",
      data: student,
    });
  } catch (error) {
    console.error("Get Student Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching student profile: " + error.message,
    });
  }
};

/**
 * @desc    Create or update student profile (upsert)
 * @route   POST /api/students/profile
 * @access  Private
 */
const upsertStudentProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user._id });

    const { subjects, examDate, targetScore, weakSubjects, bio, name, email } = req.body;

    if (!student) {
      student = new Student({
        user: req.user._id,
        name: name || req.user.name,
        email: email || req.user.email,
      });
    }

    if (subjects) student.subjects = subjects;
    if (examDate) student.examDate = examDate;
    if (targetScore) student.targetScore = targetScore;
    if (weakSubjects) student.weakSubjects = weakSubjects;
    if (bio !== undefined) student.bio = bio;

    const savedStudent = await student.save();

    return res.status(200).json({
      success: true,
      message: "Student profile saved successfully",
      data: savedStudent,
    });
  } catch (error) {
    console.error("Upsert Student Profile Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Server error saving student profile: " + error.message,
    });
  }
};

/**
 * @desc    Update student profile
 * @route   PUT /api/students/profile
 * @access  Private
 */
const updateStudentProfile = async (req, res) => {
  return upsertStudentProfile(req, res);
};

/**
 * @desc    Delete student profile
 * @route   DELETE /api/students/profile
 * @access  Private
 */
const deleteStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ user: req.user._id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    return res.json({
      success: true,
      message: "Student profile deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete Student Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error deleting student profile: " + error.message,
    });
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    return res.json({
      success: true,
      message: "All students fetched successfully",
      data: students,
    });
  } catch (error) {
    console.error("Get All Students Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching students: " + error.message,
    });
  }
};

module.exports = {
  getStudentProfile,
  upsertStudentProfile,
  updateStudentProfile,
  deleteStudentProfile,
  getAllStudents,
};
