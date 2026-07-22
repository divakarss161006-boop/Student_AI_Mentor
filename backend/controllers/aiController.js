const {
  analyzePerformance,
  generateStudyPlan,
  mentorChat,
  analyzeResume,
} = require("../services/geminiService");
const { PDFParse } = require("pdf-parse");

/**
 * @desc    Analyze student performance using Gemini AI
 * @route   POST /api/ai/performance
 * @access  Private
 */
const getPerformanceAnalysis = async (req, res) => {
  try {
    const { studentData } = req.body;

    if (!studentData) {
      return res.status(400).json({
        success: false,
        message: "Please provide student academic data for analysis",
      });
    }

    const result = await analyzePerformance(studentData);

    return res.json({
      success: true,
      message: "Performance analysis generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("AI Performance Controller Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Unable to generate AI performance analysis: " + error.message,
    });
  }
};

/**
 * @desc    Generate personalized study plan using Gemini AI
 * @route   POST /api/ai/study-plan
 * @access  Private
 */
const getStudyPlan = async (req, res) => {
  try {
    const { studentData } = req.body;

    if (!studentData) {
      return res.status(400).json({
        success: false,
        message: "Please provide student target exam date and weak subjects",
      });
    }

    const result = await generateStudyPlan(studentData);

    return res.json({
      success: true,
      message: "Study plan generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("AI Study Plan Controller Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Unable to generate study plan: " + error.message,
    });
  }
};

/**
 * @desc    AI Mentor Chat assistance
 * @route   POST /api/ai/mentor
 * @access  Private
 */
const getMentorChat = async (req, res) => {
  try {
    const { studentData, question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid question for the AI Tutor",
      });
    }

    const result = await mentorChat(studentData || { name: req.user.name }, question);

    return res.json({
      success: true,
      message: "Mentor response generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("AI Mentor Controller Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Unable to generate AI mentor response: " + error.message,
    });
  }
};

/**
 * @desc    Analyze resume text using Gemini AI
 * @route   POST /api/ai/resume
 * @access  Private
 */
const getResumeAnalysis = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please upload a valid PDF resume or paste plain resume text (at least 10 characters)",
      });
    }

    const result = await analyzeResume(resumeText);

    return res.json({
      success: true,
      message: "Resume analysis generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("AI Resume Controller Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Unable to analyze resume: " + error.message,
    });
  }
};

/**
 * @desc    Upload PDF resume, extract text using pdf-parse v2.4.5 PDFParse class, and analyze using Gemini AI
 * @route   POST /api/ai/resume/upload
 * @access  Private
 */
const getResumeAnalysisUpload = async (req, res) => {
  try {
    console.log("✓ Upload received");

    if (!req.file) {
      console.warn("❌ Resume Upload Failed: No PDF uploaded.");
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded.",
      });
    }

    console.log(`✓ File name: ${req.file.originalname}`);
    console.log(`✓ File size: ${req.file.size} bytes`);
    console.log(`✓ MIME type: ${req.file.mimetype}`);
    console.log("✓ Correct import type: { PDFParse } from pdf-parse@2.4.5");

    let parsedResult;
    try {
      const parser = new PDFParse({ data: req.file.buffer });
      parsedResult = await parser.getText();
      console.log("✓ PDF loaded");
    } catch (parseErr) {
      console.error("❌ PDF Parse Exception:", parseErr.message);
      return res.status(400).json({
        success: false,
        message: "Invalid PDF. Unable to parse file.",
      });
    }

    const rawText = (parsedResult?.text || "").trim();

    // Strip header lines like "-- 1 of 1 --" if present
    const extractedText = rawText.replace(/-- \d+ of \d+ --/g, "").trim();

    const pageCount = parsedResult?.total || parsedResult?.pages?.length || 1;

    console.log(`✓ Pages: ${pageCount}`);

    if (!extractedText || extractedText.length < 5) {
      console.warn("❌ PDF text extraction failed: PDF contains no readable text.");
      return res.status(400).json({
        success: false,
        message: "PDF contains no readable text.",
      });
    }

    console.log("✓ Text extracted");
    console.log(`✓ Character count: ${extractedText.length}`);

    console.log("✓ Gemini request sent");
    const result = await analyzeResume(extractedText);

    console.log("✓ Gemini response received");
    console.log("✓ Final API response ready");

    return res.json({
      success: true,
      message: "Resume ATS analysis generated successfully",
      data: result,
      extractedText,
    });
  } catch (error) {
    console.error("Resume Upload Controller Exception:", error.message);
    return res.status(400).json({
      success: false,
      message: "Gemini analysis failed: " + error.message,
    });
  }
};

module.exports = {
  getPerformanceAnalysis,
  getStudyPlan,
  getMentorChat,
  getResumeAnalysis,
  getResumeAnalysisUpload,
  handleAnalyzePerformance: getPerformanceAnalysis,
  handleGenerateStudyPlan: getStudyPlan,
  handleMentorChat: getMentorChat,
  handleAnalyzeResume: getResumeAnalysis,
};
