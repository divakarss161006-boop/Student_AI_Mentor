const Student = require("../models/Student");

/**
 * @desc    Get student profile
 * @route   GET /api/students/profile
 * @access  Private
 */
const getStudentProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user._id });

    if (!student) {
      const studentName =
        req.user.name ||
        req.user.fullName ||
        req.body?.name ||
        "Student";

      student = await Student.create({
        user: req.user._id,
        name: studentName,
        email: req.user.email,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully",
      data: student,
    });
  } catch (error) {
    console.error("Get Student Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Create / Update Student Profile
 * @route   POST /api/students/profile
 * @access  Private
 */
const upsertStudentProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ user: req.user._id });

    if (!student) {
      student = new Student({
        user: req.user._id,
        name:
          req.body.name ||
          req.user.name ||
          req.user.fullName ||
          "Student",
        email: req.body.email || req.user.email,
      });
    }

    if (req.body.subjects)
      student.subjects = req.body.subjects;

    if (req.body.grade)
      student.grade = req.body.grade;

    if (req.body.performanceData)
      student.performanceData = req.body.performanceData;

    if (req.body.studyPlan)
      student.studyPlan = req.body.studyPlan;

    if (req.body.resumeText)
      student.resumeText = req.body.resumeText;

    if (req.body.goals)
      student.goals = req.body.goals;

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student profile saved successfully",
      data: student,
    });
  } catch (error) {
    console.error("Upsert Student Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update Student Profile
 */
const updateStudentProfile = async (req, res) => {
  return upsertStudentProfile(req, res);
};

/**
 * @desc    Delete Student Profile
 */
const deleteStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get All Students
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get All Students Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
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