const mongoose = require("mongoose");

const githubProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    repoCount: {
      type: Number,
      default: 0,
    },
    lastPushDate: {
      type: Date,
      default: Date.now,
    },
    repositories: [
      {
        name: String,
        description: String,
        stars: Number,
        language: String,
        updatedAt: Date,
      },
    ],
    aiSuggestions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GithubProfile", githubProfileSchema);
