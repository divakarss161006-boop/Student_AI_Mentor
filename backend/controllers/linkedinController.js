const LinkedinPost = require("../models/LinkedinPost");
const { mentorChat } = require("../services/geminiService");

/**
 * @desc    Generate professional LinkedIn post, caption, & hashtags using Gemini AI
 * @route   POST /api/linkedin/generate
 * @access  Private
 */
const generateLinkedinPost = async (req, res) => {
  try {
    const { postType, topic, details } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Please provide a project name, internship, or certification topic",
      });
    }

    const prompt = `As a Social Media & Personal Branding Coach AI, generate an engaging, professional LinkedIn post for a student:
Post Type: ${postType || "Project"}
Topic/Title: ${topic}
Additional Context: ${details || "Highlighting skills learned, key achievements, and takeaways"}

Generate a JSON response with exact keys:
{
  "generatedPost": "Full professional LinkedIn post text formatted with emojis and line breaks...",
  "caption": "Short eye-catching 1-sentence caption for the post",
  "hashtags": ["#WebDevelopment", "#MERNStack", "#StudentDeveloper", "#AI", "#CareerGrowth"]
}`;

    const aiRes = await mentorChat({ name: req.user.name }, prompt);

    const post = await LinkedinPost.create({
      user: req.user._id,
      postType: postType || "Project",
      topic,
      generatedPost: aiRes.generatedPost || `🚀 Thrilled to share my latest ${postType || "project"}: ${topic}!`,
      caption: aiRes.caption || `Excited to announce my new milestone in ${topic}!`,
      hashtags: aiRes.hashtags || ["#StudentDeveloper", "#CareerGrowth", "#TechCommunity"],
    });

    return res.status(201).json({
      success: true,
      message: "LinkedIn post generated successfully",
      data: post,
    });
  } catch (error) {
    console.error("LinkedIn Post Generator Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error generating LinkedIn post: " + error.message,
    });
  }
};

/**
 * @desc    Get user's generated LinkedIn posts
 * @route   GET /api/linkedin/posts
 * @access  Private
 */
const getLinkedinPosts = async (req, res) => {
  try {
    const posts = await LinkedinPost.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      message: "LinkedIn posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Get LinkedIn Posts Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching LinkedIn posts: " + error.message,
    });
  }
};

module.exports = {
  generateLinkedinPost,
  getLinkedinPosts,
};
