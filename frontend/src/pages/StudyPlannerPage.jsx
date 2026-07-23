import React, { useState, useEffect } from "react";
import { generateStudyPlanApi } from "../api/aiApi";
import { saveAnalysisApi, getLatestByTypeApi } from "../api/historyApi";
import { useAuth } from "../context/AuthContext";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  ListTodo,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

const StudyPlannerPage = () => {
  const { user } = useAuth();
  const [examDate, setExamDate] = useState("");
  const [weakSubjects, setWeakSubjects] = useState("Data Structures, Operating Systems");
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(4);
  const [loading, setLoading] = useState(false);
  const [fetchingSaved, setFetchingSaved] = useState(true);
  const [studyPlanResult, setStudyPlanResult] = useState(null);

  // Auto-fetch saved study plan on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await getLatestByTypeApi("StudyPlan");
        if (res.success && res.data) {
          setStudyPlanResult(res.data);
        }
      } catch (err) {
        console.error("Failed to load saved study plan:", err);
      } finally {
        setFetchingSaved(false);
      }
    };

    fetchLatest();
  }, []);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();

    if (!examDate || !weakSubjects) {
      toast.error("Please fill in target exam date and weak subjects");
      return;
    }

    setLoading(true);
    try {
      const studentData = {
        name: user?.name || "Student",
        examDate,
        weakSubjects: weakSubjects.split(",").map((s) => s.trim()),
        studyHoursPerDay: Number(studyHoursPerDay),
      };

      const res = await generateStudyPlanApi(studentData);

      if (res.success && res.data) {
        setStudyPlanResult(res.data);
        await saveAnalysisApi("StudyPlan", `Study Schedule until ${examDate}`, res.data);
        toast.success("AI Study plan generated & saved!");
      } else {
        toast.error(res.message || "Failed to generate study plan");
      }
    } catch (err) {
      console.error("Study Plan Generation Error:", err);
      toast.error(
        err.response?.data?.message || err.message || "Server error generating study plan"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPlan = () => {
    const planData = studyPlanResult?.data || studyPlanResult?.aiAnalysis || studyPlanResult || {};
    const weeklyPlan = Array.isArray(planData.weeklyPlan) ? planData.weeklyPlan : [];
    if (!weeklyPlan.length) return;

    let content = `STUDENT AI MENTOR — CUSTOM STUDY PLAN\n`;
    content += `Target Exam Date: ${examDate || "Upcoming Exam"}\n`;
    content += `Daily Target: ${studyHoursPerDay} Hours/Day\n`;
    content += `==========================================\n\n`;

    weeklyPlan.forEach((dayPlan) => {
      content += `DAY: ${dayPlan.day || ""}\n`;
      if (Array.isArray(dayPlan.subjects)) {
        dayPlan.subjects.forEach((s) => {
          content += `  - Subject: ${s.subject} (${s.hours} Hrs)\n`;
          content += `    Task: ${s.task}\n`;
        });
      } else {
        content += `  - Focus: ${dayPlan.focusSubject || ""}\n`;
      }
      content += `\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Study_Plan_${examDate || "Weekly"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Study plan downloaded!");
  };

  // Normalize Plan Data for Rendering
  const planData = studyPlanResult?.data || studyPlanResult?.aiAnalysis || studyPlanResult || {};
  const weeklyPlan = Array.isArray(planData.weeklyPlan) ? planData.weeklyPlan : [];
  const tips = Array.isArray(planData.tips)
    ? planData.tips
    : Array.isArray(planData.revisionTips)
    ? planData.revisionTips
    : [];

  if (fetchingSaved) {
    return <LoadingSpinner label="Loading saved study plan..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            AI Study Planner & Schedule Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Input your upcoming exam date, target weak subjects, and daily availability to generate a structured weekly schedule.
          </p>
        </div>

        {weeklyPlan.length > 0 && (
          <Button variant="primary" size="sm" onClick={handleDownloadPlan} icon={Download}>
            Download Plan (.txt)
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Study Goals Input">
            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <Input
                label="Target Exam Date"
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
              />

              <Input
                label="Focus / Weak Subjects (comma separated)"
                placeholder="e.g. Data Structures, Algorithms"
                value={weakSubjects}
                onChange={(e) => setWeakSubjects(e.target.value)}
                required
              />

              <Input
                label="Daily Study Commitment (Hours)"
                type="number"
                min="1"
                max="16"
                value={studyHoursPerDay}
                onChange={(e) => setStudyHoursPerDay(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-500/20"
                icon={Sparkles}
              >
                Generate Study Schedule
              </Button>
            </form>
          </Card>
        </div>

        {/* Weekly Plan View */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <Card className="p-6">
              <LoadingSpinner label="Formulating weekly study schedule with Gemini AI..." />
            </Card>
          ) : weeklyPlan.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                  Weekly Study Roadmap
                </h3>
                <Badge variant="secondary">{weeklyPlan.length} Days Planned</Badge>
              </div>

              <div className="space-y-4">
                {weeklyPlan.map((dayPlan, idx) => (
                  <Card key={idx} className="p-5 border-l-4 border-l-teal-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
                          {dayPlan.day || `Day ${idx + 1}`}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                          {dayPlan.focusSubject || (dayPlan.subjects?.[0]?.subject) || "Study Sessions"}
                        </h4>
                      </div>
                      <Badge variant="accent" className="w-fit">
                        <Clock className="w-3 h-3 mr-1" />{" "}
                        {dayPlan.hoursAllocated ||
                          dayPlan.subjects?.reduce((sum, s) => sum + (s.hours || 0), 0) ||
                          studyHoursPerDay}{" "}
                        Hours
                      </Badge>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {Array.isArray(dayPlan.subjects) && dayPlan.subjects.length > 0 ? (
                        <div className="space-y-2">
                          {dayPlan.subjects.map((subItem, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-white">
                                <span className="text-teal-700 dark:text-teal-400">• {subItem.subject}</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  {subItem.hours || 2} Hours
                                </span>
                              </div>
                              {subItem.task && (
                                <p className="text-slate-600 dark:text-slate-400 text-[11px] pl-3">
                                  Task: {subItem.task}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {dayPlan.topics?.map((topic, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {tips.length > 0 && (
                <Card title="AI Revision & Exam Preparation Tips">
                  <div className="space-y-2">
                    {tips.map((tip, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Generate Your Custom Study Schedule</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your target exam date and weak subjects on the left to generate an AI weekly timetable.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlannerPage;
