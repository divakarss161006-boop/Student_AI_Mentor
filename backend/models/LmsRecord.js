const mongoose = require("mongoose");

const lmsRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      default: "LMS_Marks.xlsx",
    },
    subjects: [
      {
        subjectName: { type: String, required: true },
        score: { type: Number, required: true },
        maxScore: { type: Number, default: 100 },
      },
    ],
    averageScore: {
      type: Number,
      default: 0,
    },
    bestSubject: {
      type: String,
      default: "",
    },
    weakestSubject: {
      type: String,
      default: "",
    },
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LmsRecord", lmsRecordSchema);
