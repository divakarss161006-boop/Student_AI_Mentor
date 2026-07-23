require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const { createPerformancePrompt } = require("../prompts/performancePrompt");
const { createStudyPlannerPrompt } = require("../prompts/studyPlannerPrompt");
const { createMentorPrompt } = require("../prompts/mentorPrompt");
const { createResumePrompt } = require("../prompts/resumePrompt");

// Initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in environment variables!");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "MISSING_KEY",
});

// Primary model for Google Gen AI SDK
const PRIMARY_MODEL = "gemini-2.0-flash";

/**
 * Clean and extract JSON object from Gemini response text
 */
function parseGeminiJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty Gemini response");
  }

  let cleaned = rawText.trim();
  // Remove markdown code fences (```json ... ``` or ``` ... ```)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON Parse Error on raw Gemini text:", rawText);
    throw new Error(`JSON parse failed: ${err.message}`);
  }
}

/**
 * Intelligent fallback generator for Performance Analysis when 429 or quota limit occurs
 */
function generateFallbackPerformanceAnalysis(studentData) {
  const subjects = studentData?.subjects || [];
  if (!subjects.length) {
    return {
      summary: "Academic performance evaluated based on submitted scores.",
      strengths: [{ subject: "General Academic", reason: "Satisfactory overall effort" }],
      improvements: [{ subject: "General Study", reason: "Focus on regular revision" }],
      recommendations: [
        "Maintain a consistent daily study schedule",
        "Practice problem solving and active recall regularly"
      ]
    };
  }

  const processed = subjects.map((s) => {
    const name = s.subjectName || s.subject || s.name || "Subject";
    const score = Number(s.score || s.marks || 0);
    const maxScore = Number(s.maxScore || 100);
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : score;
    return { name, score, maxScore, pct };
  });

  const sorted = [...processed].sort((a, b) => b.pct - a.pct);
  const strong = processed.filter((s) => s.pct >= 75);
  const weak = processed.filter((s) => s.pct < 65);

  const strongList = strong.length > 0 ? strong : [sorted[0]];
  const weakList =
    weak.length > 0
      ? weak
      : sorted[sorted.length - 1].pct < 85
      ? [sorted[sorted.length - 1]]
      : [];

  const avgPct = Math.round(
    processed.reduce((sum, item) => sum + item.pct, 0) / processed.length
  );

  return {
    summary: `Student academic performance evaluated across ${processed.length} subject(s) with an overall average score of ${avgPct}%. ${
      strongList.length ? `Strong performance shown in ${strongList.map((s) => s.name).join(", ")}.` : ""
    } ${
      weakList.length ? `Focused improvement needed in ${weakList.map((s) => s.name).join(", ")}.` : "Overall performance remains steady."
    }`,
    strengths: strongList.map((s) => ({
      subject: s.name,
      reason: `High mastery demonstrated with a score of ${s.score}/${s.maxScore} (${s.pct}%)`,
    })),
    improvements: weakList.map((s) => ({
      subject: s.name,
      reason: `Score of ${s.score}/${s.maxScore} (${s.pct}%) indicates targeted conceptual revision required`,
    })),
    recommendations: [
      `Allocate 1.5 to 2 hours daily for high-priority subjects like ${
        weakList.map((s) => s.name).join(", ") || "weak subjects"
      }.`,
      "Use active recall and solve previous examination papers.",
      "Review core concept summaries at the end of each study session.",
    ],
  };
}

/**
 * Intelligent fallback generator for Study Plan when 429 or quota limit occurs
 */
function generateFallbackStudyPlan(studentData) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let weakSubList = [];

  if (Array.isArray(studentData?.weakSubjects)) {
    weakSubList = studentData.weakSubjects;
  } else if (typeof studentData?.weakSubjects === "string") {
    weakSubList = studentData.weakSubjects.split(",").map((s) => s.trim()).filter(Boolean);
  }

  if (weakSubList.length === 0) {
    weakSubList = ["Core Technical Subject", "Problem Solving", "Revision"];
  }

  const hours = Number(studentData?.studyHoursPerDay || 4);

  const weeklyPlan = days.map((day, idx) => {
    const primarySubject = weakSubList[idx % weakSubList.length];
    const secondarySubject = weakSubList[(idx + 1) % weakSubList.length] || "Revision & Practice";

    return {
      day,
      subjects: [
        {
          subject: primarySubject,
          hours: Math.ceil(hours * 0.6),
          task: `Deep dive into ${primarySubject} fundamentals, key theories & practice problems`,
        },
        {
          subject: secondarySubject,
          hours: Math.max(1, Math.floor(hours * 0.4)),
          task: `Solve exercise questions and review ${secondarySubject} summary notes`,
        },
      ],
    };
  });

  return {
    weeklyPlan,
    tips: [
      "Follow the Pomodoro Technique (25 min study, 5 min break) to maximize retention.",
      "Prioritize weak subjects during peak focus hours.",
      "Complete active recall quizzes at the end of each study day.",
      "Review progress every Sunday evening and adjust targets accordingly.",
    ],
  };
}

/**
 * Rule-based fallback resume analyzer when Gemini API quota or rate-limit occurs
 */
function generateFallbackResumeAnalysis(resumeText) {
  const textLower = (resumeText || "").toLowerCase();
  const wordCount = textLower.split(/\s+/).filter(Boolean).length;

  const keySkills = [
    "react",
    "javascript",
    "node",
    "express",
    "mongodb",
    "python",
    "java",
    "sql",
    "git",
    "aws",
    "docker",
  ];
  const foundSkills = keySkills.filter((s) => textLower.includes(s));
  const missingSkills = keySkills.filter((s) => !textLower.includes(s));

  let score = 60 + Math.min(25, foundSkills.length * 4) + (wordCount > 150 ? 10 : 0);
  score = Math.min(95, score);

  return {
    overallScore: score,
    atsScore: score - 3,
    resumeScore: score,
    strengths: [
      foundSkills.length > 0
        ? `Identified technical competencies: ${foundSkills.slice(0, 4).join(", ")}`
        : "Clear section hierarchy and layout",
      "Contains relevant education and project history",
      "Includes key engineering terminology",
    ],
    weaknesses: [
      missingSkills.length > 0
        ? `Missing keywords: ${missingSkills.slice(0, 3).join(", ")}`
        : "Consider adding quantitative metric impact statements",
      "Ensure action verbs open every bullet point",
    ],
    missingSkills:
      missingSkills.length > 0
        ? missingSkills.slice(0, 5)
        : ["System Design", "CI/CD Pipelines", "Docker"],
    summary: `Resume evaluated with ${wordCount} words. High technical relevance detected with an estimated ATS readability of ${score}%.`,
    suggestedImprovements: [
      "Add quantifiable achievement metrics (e.g., 'Improved load times by 40%').",
      "Include missing industry keywords: " + missingSkills.slice(0, 4).join(", "),
      "Ensure contact info and LinkedIn profile URL are prominently placed at the top.",
    ],
    recommendedRoles: [
      "Full Stack Web Developer",
      "Frontend React Engineer",
      "Software Development Intern",
    ],
  };
}

/**
 * Generate content from Gemini with detailed error propagation & logging
 * @param {string} prompt
 * @returns {Promise<any>}
 */
async function generateResponse(prompt) {
  console.log(`✓ Prompt length: ${prompt.length}`);
  console.log(`✓ Gemini request started`);
  console.log(`✓ Model name: ${PRIMARY_MODEL}`);

  try {
    const response = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: prompt,
    });

    if (!response) {
      throw new Error("Empty Gemini response");
    }

    const rawText = await response.text();
    console.log("========== GEMINI RAW RESPONSE ==========");
    console.log(rawText);

    if (!rawText || !rawText.trim()) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsedJson = parseGeminiJson(rawText);
    console.log(`✓ Parsed response successfully`);
    console.log(`✓ Final JSON ready`);

    return parsedJson;
  } catch (error) {
    console.error("Gemini Execution Exception Stack:", error.stack || error);

    const errMsg = error.message || "";

    if (
      errMsg.includes("Quota exceeded") ||
      errMsg.includes("429") ||
      errMsg.includes("RESOURCE_EXHAUSTED")
    ) {
      console.warn("⚠️ Gemini Quota Exceeded (429). Returning null for fallback execution.");
      return null;
    }

    throw new Error(errMsg || "Gemini API request failed");
  }
}

async function analyzePerformance(studentData) {
  const prompt = createPerformancePrompt(studentData);
  try {
    const res = await generateResponse(prompt);
    if (
      res &&
      res.summary &&
      Array.isArray(res.strengths) &&
      Array.isArray(res.improvements) &&
      Array.isArray(res.recommendations)
    ) {
      return res;
    }

    if (res) {
      return {
        summary: res.summary || res.overallPerformance || "Performance evaluated successfully.",
        strengths: Array.isArray(res.strengths)
          ? res.strengths.map((s) => (typeof s === "string" ? { subject: "Strong Area", reason: s } : s))
          : (res.strongSubjects || []).map((s) => (typeof s === "string" ? { subject: "Strong Area", reason: s } : s)),
        improvements: Array.isArray(res.improvements)
          ? res.improvements.map((i) => (typeof i === "string" ? { subject: "Focus Area", reason: i } : i))
          : (res.weakSubjects || []).map((w) => (typeof w === "string" ? { subject: "Focus Area", reason: w } : w)),
        recommendations: Array.isArray(res.recommendations)
          ? res.recommendations
          : (res.targetSuggestions || []).map((t) => t.studyPlan || `${t.subject}: Target ${t.targetScore}%`),
      };
    }

    return generateFallbackPerformanceAnalysis(studentData);
  } catch (err) {
    console.warn("analyzePerformance Exception, using fallback:", err.message);
    return generateFallbackPerformanceAnalysis(studentData);
  }
}

async function generateStudyPlan(studentData) {
  const prompt = createStudyPlannerPrompt(studentData);
  try {
    const res = await generateResponse(prompt);
    if (res && Array.isArray(res.weeklyPlan) && res.weeklyPlan.length > 0) {
      return {
        weeklyPlan: res.weeklyPlan.map((dayObj) => ({
          day: dayObj.day || "Day",
          subjects: Array.isArray(dayObj.subjects)
            ? dayObj.subjects.map((s) => ({
                subject: s.subject || s.name || s.focusSubject || "Subject",
                hours: Number(s.hours || s.hoursAllocated || s.studyHours || 2),
                task: s.task || (Array.isArray(s.topics) ? s.topics.join(", ") : "Study core concepts & practice"),
              }))
            : [
                {
                  subject: dayObj.focusSubject || "Study Focus",
                  hours: Number(dayObj.hoursAllocated || 2),
                  task: Array.isArray(dayObj.topics) ? dayObj.topics.join(", ") : "Practice core concepts",
                },
              ],
        })),
        tips: Array.isArray(res.tips) ? res.tips : (res.revisionTips || ["Practice consistently every day."]),
      };
    }
    return generateFallbackStudyPlan(studentData);
  } catch (err) {
    console.warn("generateStudyPlan Exception, using fallback:", err.message);
    return generateFallbackStudyPlan(studentData);
  }
}

async function mentorChat(studentData, question) {
  const prompt = createMentorPrompt(studentData, question);
  const res = await generateResponse(prompt);
  return res || { answer: "AI Mentor is currently optimizing responses. Please try again shortly." };
}

async function analyzeResume(resumeText) {
  console.log(`✓ Resume character count: ${resumeText?.length || 0}`);
  const prompt = createResumePrompt(resumeText);

  try {
    const result = await generateResponse(prompt);
    if (result) {
      return {
        overallScore: result.overallScore || result.atsScore || 75,
        atsScore: result.atsScore || result.overallScore || 75,
        resumeScore: result.resumeScore || result.overallScore || 75,
        strengths: result.strengths || ["Structured technical sections"],
        weaknesses: result.weaknesses || ["Could add more metric-driven accomplishments"],
        missingSkills: result.missingSkills || ["Docker", "CI/CD"],
        summary: result.summary || "Resume text evaluated successfully.",
        suggestedImprovements:
          result.suggestedImprovements || result.suggestions || ["Add quantifiable project impact"],
        recommendedRoles: result.recommendedRoles || ["Software Engineer", "Full Stack Developer"],
      };
    }
  } catch (err) {
    console.warn("Gemini analyzeResume exception:", err.message);
    throw err;
  }

  return generateFallbackResumeAnalysis(resumeText);
}

module.exports = {
  generateResponse,
  analyzePerformance,
  generateStudyPlan,
  mentorChat,
  analyzeResume,
};