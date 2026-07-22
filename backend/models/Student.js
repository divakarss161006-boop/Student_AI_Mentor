const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      default: "",
    },
    subjects: [
      {
        subjectName: { type: String, required: true },
        score: { type: Number, default: 0 },
        maxScore: { type: Number, default: 100 },
        attendancePercentage: { type: Number, default: 100 },
      },
    ],
    performanceData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    studyPlan: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    resumeText: {
      type: String,
      default: "",
    },
    goals: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
