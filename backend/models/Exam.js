const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Please add a subject"],
      trim: true,
    },
    examName: {
      type: String,
      required: [true, "Please add an exam name"],
      trim: true,
    },
    examDate: {
      type: Date,
      required: [true, "Please add an exam date"],
    },
    targetMarks: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exam", examSchema);
