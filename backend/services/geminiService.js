require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const { createPerformancePrompt } = require("../prompts/performancePrompt");

const { createStudyPlannerPrompt } = require("../prompts/studyPlannerPrompt");

const { createMentorPrompt } = require("../prompts/mentorPrompt");

const { createResumePrompt } = require("../prompts/resumePrompt");

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate content from Gemini
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function generateResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const text = response.text.trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw new Error("Failed to generate AI response");
  }
}

async function analyzePerformance(studentData) {
  const prompt = createPerformancePrompt(studentData);
  return await generateResponse(prompt);
}

async function generateStudyPlan(studentData) {
  const prompt = createStudyPlannerPrompt(studentData);
  return await generateResponse(prompt);
}

async function mentorChat(studentData, question) {
  const prompt = createMentorPrompt(studentData, question);
  return await generateResponse(prompt);
}

async function analyzeResume(resumeText) {
  const prompt = createResumePrompt(resumeText);
  return await generateResponse(prompt);
}

module.exports = {
  generateResponse,
  analyzePerformance,
  generateStudyPlan,
  mentorChat,
  analyzeResume,
};