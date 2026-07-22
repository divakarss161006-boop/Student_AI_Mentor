function createPerformancePrompt(studentData) {
  return `
You are an AI Student Performance Analyst.

Analyze the following student data and return ONLY valid JSON.

Student Data:
${JSON.stringify(studentData, null, 2)}

Return the response in this exact format:

{
  "overallPerformance": "",
  "strongSubjects": [],
  "weakSubjects": [],
  "strengths": [],
  "areasToImprove": [],
  "recommendations": []
}

Do not include markdown.
Do not include explanations.
Return only JSON.
`;
}

module.exports = {
  createPerformancePrompt,
};