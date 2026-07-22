const AnalysisHistory = require("../models/AnalysisHistory");
const mongoose = require("mongoose");

/**
 * @desc    Save AI Analysis to History & Persistent Storage
 * @route   POST /api/history
 * @access  Private
 */
const saveAnalysis = async (req, res) => {
  try {
    const { type, title, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({
        success: false,
        message: "Please provide analysis type and data",
      });
    }

    const record = await AnalysisHistory.create({
      user: req.user._id,
      type,
      title: title || `${type} Analysis`,
      data,
    });

    return res.status(201).json({
      success: true,
      message: "Analysis saved to history successfully",
      data: record,
    });
  } catch (error) {
    console.error("Save Analysis Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Server error saving analysis: " + error.message,
    });
  }
};

/**
 * @desc    Get all AI Analysis history entries for logged in user
 * @route   GET /api/history
 * @access  Private
 */
const getHistory = async (req, res) => {
  try {
    const history = await AnalysisHistory.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({
      success: true,
      message: "Analysis history fetched successfully",
      data: history,
    });
  } catch (error) {
    console.error("Get History Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching history: " + error.message,
    });
  }
};

/**
 * @desc    Get latest AI Analysis by type (e.g. Internship, Resume, LMS)
 * @route   GET /api/history/latest/:type
 * @access  Private
 */
const getLatestByType = async (req, res) => {
  try {
    const { type } = req.params;
    const latest = await AnalysisHistory.findOne({
      user: req.user._id,
      type,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: `Latest ${type} analysis fetched`,
      data: latest ? latest.data : null,
    });
  } catch (error) {
    console.error("Get Latest History Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching latest analysis: " + error.message,
    });
  }
};

/**
 * @desc    Delete an analysis history item
 * @route   DELETE /api/history/:id
 * @access  Private
 */
const deleteHistoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history item ID format",
      });
    }

    const item = await AnalysisHistory.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "History item not found",
      });
    }

    return res.json({
      success: true,
      message: "History item deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete History Error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Server error deleting history item: " + error.message,
    });
  }
};

module.exports = {
  saveAnalysis,
  getHistory,
  getLatestByType,
  deleteHistoryItem,
};
