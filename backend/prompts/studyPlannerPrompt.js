function createStudyPlannerPrompt(studentData) {
  return `You are an expert AI Study Schedule Planner.

Create a personalized 7-day weekly study schedule based on the following student goals. Respond ONLY with a valid JSON object. Do not include markdown fences, explanation, or extra text.

Student Data:
${JSON.stringify(studentData, null, 2)}

Respond ONLY with this exact JSON structure:

{
  "weeklyPlan": [
    {
      "day": "Monday",
      "subjects": [
        {
          "subject": "Subject Name",
          "hours": 2,
          "task": "Actionable task or topic breakdown"
        }
      ]
    }
  ],
  "tips": [
    "Actionable study tip 1",
    "Actionable study tip 2"
  ]
}

CRITICAL: Return ONLY valid JSON. Include entries for all 7 days of the week (Monday through Sunday). No markdown fences like \`\`\`json, no preamble.`;
}

module.exports = {
  createStudyPlannerPrompt,
};