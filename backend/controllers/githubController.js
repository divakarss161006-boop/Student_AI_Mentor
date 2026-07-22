const GithubProfile = require("../models/GithubProfile");
const { mentorChat } = require("../services/geminiService");

/**
 * @desc    Fetch GitHub profile data or save manual entry & generate AI suggestions
 * @route   POST /api/github/profile
 * @access  Private
 */
const syncGithubProfile = async (req, res) => {
  try {
    const { username, repositories: manualRepos } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Please provide a GitHub username",
      });
    }

    let repoCount = 0;
    let repositories = manualRepos || [];
    let lastPushDate = new Date();

    // Try fetching from GitHub Public API
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          repoCount = data.length;
          repositories = data.map((repo) => ({
            name: repo.name,
            description: repo.description || "No description provided",
            stars: repo.stargazers_count || 0,
            language: repo.language || "JavaScript",
            updatedAt: new Date(repo.updated_at),
          }));
          if (data[0] && data[0].updated_at) {
            lastPushDate = new Date(data[0].updated_at);
          }
        }
      }
    } catch (apiErr) {
      console.warn("GitHub API request failed, using manual/fallback data:", apiErr.message);
    }

    // AI Suggestions for GitHub productivity
    const prompt = `As a Tech Lead AI Mentor, analyze this developer's GitHub profile:
Username: ${username}
Total Public Repositories: ${repoCount || repositories.length}
Repositories: ${repositories.map((r) => r.name + " (" + (r.language || "Code") + ")").join(", ")}

Generate a JSON response with key "aiSuggestions":
{
  "aiSuggestions": [
    "Push today's code to maintain contribution streak",
    "Improve README.md for project X with setup instructions and screenshots",
    "Add live demo links to project descriptions",
    "Next project recommendation: Build a MERN Fullstack Dashboard"
  ]
}`;

    let aiSuggestions = [
      "Commit and push code daily to maintain your contribution streak",
      "Add comprehensive README.md files with screenshots for top projects",
      "Include live preview URLs in your repository descriptions",
      "Next recommended project: Real-time Collaborative Board App",
    ];

    try {
      const aiRes = await mentorChat({ name: req.user.name }, prompt);
      if (aiRes && aiRes.aiSuggestions) {
        aiSuggestions = aiRes.aiSuggestions;
      }
    } catch (e) {
      console.warn("AI GitHub suggestion fallback used");
    }

    let profile = await GithubProfile.findOne({ user: req.user._id });

    if (profile) {
      profile.username = username;
      profile.repoCount = repoCount || repositories.length;
      profile.lastPushDate = lastPushDate;
      profile.repositories = repositories;
      profile.aiSuggestions = aiSuggestions;
      await profile.save();
    } else {
      profile = await GithubProfile.create({
        user: req.user._id,
        username,
        repoCount: repoCount || repositories.length,
        lastPushDate,
        repositories,
        aiSuggestions,
      });
    }

    return res.json({
      success: true,
      message: "GitHub productivity profile synced successfully",
      data: profile,
    });
  } catch (error) {
    console.error("GitHub Sync Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error syncing GitHub profile: " + error.message,
    });
  }
};

/**
 * @desc    Get user's saved GitHub profile
 * @route   GET /api/github/profile
 * @access  Private
 */
const getGithubProfile = async (req, res) => {
  try {
    const profile = await GithubProfile.findOne({ user: req.user._id });
    return res.json({
      success: true,
      message: "GitHub profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Get GitHub Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching GitHub profile: " + error.message,
    });
  }
};

module.exports = {
  syncGithubProfile,
  getGithubProfile,
};
