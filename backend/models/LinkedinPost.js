const mongoose = require("mongoose");

const linkedinPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postType: {
      type: String,
      enum: ["Project", "Internship", "Certification"],
      default: "Project",
    },
    topic: {
      type: String,
      required: true,
    },
    generatedPost: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    hashtags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LinkedinPost", linkedinPostSchema);
