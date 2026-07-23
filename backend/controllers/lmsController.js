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
      name: req.user?.name || "Student",
      subjects: subjects.map((s) => ({
        subjectName: s.subjectName || s.subject || s.name || "Subject",
        score: Number(s.score || s.marks || 0),
        maxScore: Number(s.maxScore || 100),
      })),
    };

    const aiRes = await analyzePerformance(studentData);

    const summary = aiRes.summary || "LMS performance evaluated.";
    const strongSubjects = Array.isArray(aiRes.strongSubjects) ? aiRes.strongSubjects : [];
    const weakSubjects = Array.isArray(aiRes.weakSubjects) ? aiRes.weakSubjects : [];
    const targetSuggestions = Array.isArray(aiRes.targetSuggestions) ? aiRes.targetSuggestions : [];

    const totalScore = studentData.subjects.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = Math.round(totalScore / studentData.subjects.length);

    const sorted = [...studentData.subjects].sort((a, b) => b.score - a.score);
    const bestSubject = sorted[0]?.subjectName || "N/A";
    const weakestSubject = sorted[sorted.length - 1]?.subjectName || "N/A";

    // Save record to database for history tracking
    try {
      await LmsRecord.create({
        user: req.user._id,
        fileName: fileName || "LMS_Export.xlsx",
        subjects: studentData.subjects,
        averageScore,
        bestSubject,
        weakestSubject,
        aiAnalysis: {
          summary,
          strongSubjects,
          weakSubjects,
          targetSuggestions,
        },
      });
    } catch (dbErr) {
      console.warn("LmsRecord DB save warning:", dbErr.message);
    }

    return res.status(200).json({
      success: true,
      data: {
        summary,
        strongSubjects,
        weakSubjects,
        targetSuggestions,
      },
    });
  } catch (error) {
    console.error("LMS Controller Error:", error.message);
    return res.status(500).json({
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
