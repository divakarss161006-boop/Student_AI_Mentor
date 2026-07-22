function createResumePrompt(resumeText) {
  return `
You are an AI Resume Analyzer.

Analyze the following resume.

Resume:
${resumeText}

Return ONLY valid JSON in this format:

{
  "overallScore": 0,
  "strengths": [],
  "missingSkills": [],
  "suggestedImprovements": [],
  "recommendedRoles": [],
  "atsScore": 0
}

Rules:
- overallScore should be between 0 and 100.
- atsScore should be between 0 and 100.
- Do not return markdown.
- Do not explain your answer.
- Return only valid JSON.
`;
}

module.exports = {
  createResumePrompt,
};