function createStudyPlannerPrompt(studentData) {
  return `
You are an AI Study Planner.

Based on the student's academic performance, create a personalized weekly study plan.

Student Data:
${JSON.stringify(studentData, null, 2)}

Return ONLY valid JSON in this format:

{
  "weeklyPlan": [
    {
      "day": "",
      "subjects": [],
      "studyHours": 0,
      "tasks": []
    }
  ],
  "revisionTips": [],
  "examPreparation": []
}

Do not include markdown.
Do not include explanations.
Return only JSON.
`;
}

module.exports = {
  createStudyPlannerPrompt,
};