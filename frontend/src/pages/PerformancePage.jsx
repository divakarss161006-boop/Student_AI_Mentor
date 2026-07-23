import React, { useState, useEffect } from "react";
import { analyzePerformanceApi } from "../api/aiApi";
import { saveAnalysisApi, getLatestByTypeApi } from "../api/historyApi";
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  Sparkles,
  Award,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";

const PerformancePage = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([
    { subjectName: "Data Structures", score: 85, maxScore: 100 },
    { subjectName: "Algorithms", score: 78, maxScore: 100 },
    { subjectName: "Operating Systems", score: 62, maxScore: 100 },
    { subjectName: "Database Systems", score: 90, maxScore: 100 },
  ]);

  const [loading, setLoading] = useState(false);
  const [fetchingSaved, setFetchingSaved] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Auto-fetch saved performance analysis on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await getLatestByTypeApi("Performance");
        if (res.success && res.data) {
          setAnalysisResult(res.data);
        }
      } catch (err) {
        console.error("Failed to load saved performance analysis:", err);
      } finally {
        setFetchingSaved(false);
      }
    };

    fetchLatest();
  }, []);

  const handleAddSubject = () => {
    setSubjects([...subjects, { subjectName: "", score: 75, maxScore: 100 }]);
  };

  const handleRemoveSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = field === "score" ? Number(value) : value;
    setSubjects(updated);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (subjects.length === 0) {
      toast.error("Please add at least one subject");
      return;
    }

    setLoading(true);
    try {
      const studentData = {
        name: user?.name || "Student",
        subjects,
      };

      const res = await analyzePerformanceApi(studentData);

      if (res.success && res.data) {
        setAnalysisResult(res.data);
        await saveAnalysisApi("Performance", `Academic Analysis`, res.data);
        toast.success("Performance analysis complete & saved!");
      } else {
        toast.error(res.message || "Failed to analyze performance");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred during analysis"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalScore = subjects.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = subjects.length ? Math.round(totalScore / subjects.length) : 0;

  // Normalize Analysis Data for Rendering
  const analysisData = analysisResult?.data || analysisResult?.aiAnalysis || analysisResult || {};
  const summaryText = analysisData.summary || analysisData.overallPerformance || "Performance evaluated successfully.";
  const strengthsList = Array.isArray(analysisData.strengths) ? analysisData.strengths : [];
  const improvementsList = Array.isArray(analysisData.improvements)
    ? analysisData.improvements
    : Array.isArray(analysisData.areasToImprove)
    ? analysisData.areasToImprove
    : [];
  const recommendationsList = Array.isArray(analysisData.recommendations) ? analysisData.recommendations : [];

  if (fetchingSaved) {
    return <LoadingSpinner label="Loading saved performance analysis..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          AI Academic Performance Analysis
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Input your subject scores to calculate overall performance and receive customized AI study recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Subject Scores Input">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-3">
                {subjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={sub.subjectName}
                      onChange={(e) => handleSubjectChange(idx, "subjectName", e.target.value)}
                      required
                      className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    <input
                      type="number"
                      placeholder="Score"
                      min="0"
                      max="100"
                      value={sub.score}
                      onChange={(e) => handleSubjectChange(idx, "score", e.target.value)}
                      required
                      className="w-20 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    />
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        className="p-2 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Subject
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Avg: {averageScore}%
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-md shadow-blue-500/20"
                icon={Sparkles}
              >
                Analyze Performance with Gemini AI
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <Card className="p-6">
              <LoadingSpinner label="Evaluating subject performance with Gemini AI..." />
            </Card>
          ) : analysisResult ? (
            <div className="space-y-6">
              {/* Overall Summary Card */}
              <Card title="Overall AI Academic Performance" className="border-l-4 border-l-blue-600">
                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {summaryText}
                </p>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Key Strengths">
                  <div className="space-y-3">
                    {strengthsList.length > 0 ? (
                      strengthsList.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="font-bold text-slate-900 dark:text-white">
                              • {typeof item === "string" ? item : item.subject || item.name}
                            </span>
                          </div>
                          {typeof item === "object" && item.reason && (
                            <p className="text-slate-600 dark:text-slate-400 pl-6 text-[11px]">
                              • {item.reason}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No key strengths recorded.</p>
                    )}
                  </div>
                </Card>

                <Card title="Areas to Improve">
                  <div className="space-y-3">
                    {improvementsList.length > 0 ? (
                      improvementsList.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-800 space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            <span className="font-bold text-slate-900 dark:text-white">
                              • {typeof item === "string" ? item : item.subject || item.name}
                            </span>
                          </div>
                          {typeof item === "object" && item.reason && (
                            <p className="text-slate-600 dark:text-slate-400 pl-6 text-[11px]">
                              • {item.reason}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No areas to improve recorded.</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Recommendations */}
              <Card title="AI Strategic Recommendations">
                <div className="space-y-3">
                  {recommendationsList.length > 0 ? (
                    recommendationsList.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                        💡 {typeof item === "string" ? item : item.studyPlan || item.recommendation || JSON.stringify(item)}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No strategic recommendations generated.</p>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Ready for Performance Analysis</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your subject marks on the left to receive AI study suggestions and strengths evaluation.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
