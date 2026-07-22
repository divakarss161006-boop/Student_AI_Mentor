const LmsRecord = require("../models/LmsRecord");
const { analyzePerformance } = require("../services/geminiService");

/**
 * @desc    Analyze LMS export data (.xlsx/.csv marks) using Gemini AI
 * @route   POST /api/lms/analyze
 * @access  Private
 */
const analyzeLmsData = async (req, res) => {
  try {
    const { fileName, subjects } = req.body;

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload a valid LMS file or provide at least one subject mark record",
      });
    }

    // Format student data for Gemini
    const studentData = {
      name: req.user.name,
      subjects: subjects.map((s) => ({
        subjectName: s.subjectName || s.name || "Subject",
        score: Number(s.score || s.marks || 0),
        maxScore: Number(s.maxScore || 100),
      })),
    };

    const aiRes = await analyzePerformance(studentData);

    const totalScore = studentData.subjects.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = Math.round(totalScore / studentData.subjects.length);

    const sorted = [...studentData.subjects].sort((a, b) => b.score - a.score);
    const bestSubject = sorted[0]?.subjectName || "N/A";
    const weakestSubject = sorted[sorted.length - 1]?.subjectName || "N/A";

    const record = await LmsRecord.create({
      user: req.user._id,
      fileName: fileName || "LMS_Export.xlsx",
      subjects: studentData.subjects,
      averageScore,
      bestSubject,
      weakestSubject,
      aiAnalysis: aiRes,
    });

    return res.status(201).json({
      success: true,
      message: "LMS data analyzed successfully",
      data: record,
    });
  } catch (error) {
    console.error("LMS Controller Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Unable to analyze LMS data: " + error.message,
    });
  }
};

/**
 * @desc    Get user LMS analysis history
 * @route   GET /api/lms/records
 * @access  Private
 */
const getLmsRecords = async (req, res) => {
  try {
    const records = await LmsRecord.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      message: "LMS records fetched successfully",
      data: records,
    });
  } catch (error) {
    console.error("Get LMS Records Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching LMS records: " + error.message,
    });
  }
};

module.exports = {
  analyzeLmsData,
  getLmsRecords,
};
