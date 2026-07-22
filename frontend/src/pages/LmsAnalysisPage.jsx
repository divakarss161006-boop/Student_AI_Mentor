import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { analyzeLmsDataApi } from "../api/lmsApi";
import { saveAnalysisApi, getLatestByTypeApi } from "../api/historyApi";
import {
  FileSpreadsheet,
  Upload,
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
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

const LmsAnalysisPage = () => {
  const [fileName, setFileName] = useState("");
  const [extractedSubjects, setExtractedSubjects] = useState([
    { subjectName: "Data Structures", score: 88, maxScore: 100 },
    { subjectName: "Operating Systems", score: 62, maxScore: 100 },
    { subjectName: "Computer Networks", score: 74, maxScore: 100 },
    { subjectName: "Database Systems", score: 91, maxScore: 100 },
  ]);
  const [loading, setLoading] = useState(false);
  const [fetchingSaved, setFetchingSaved] = useState(true);
  const [lmsResult, setLmsResult] = useState(null);

  // Auto-fetch saved LMS analysis on mount (Part 7: Persist AI Analysis)
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await getLatestByTypeApi("LMS");
        if (res.success && res.data) {
          setLmsResult(res.data);
        }
      } catch (err) {
        console.error("Failed to load saved LMS record:", err);
      } finally {
        setFetchingSaved(false);
      }
    };

    fetchLatest();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast.error("The uploaded file is empty");
          return;
        }

        const parsed = jsonData.map((row) => {
          const nameKey =
            Object.keys(row).find((k) =>
              /subject|name|course|topic/i.test(k)
            ) || Object.keys(row)[0];
          const scoreKey =
            Object.keys(row).find((k) =>
              /score|mark|grade|point|val/i.test(k)
            ) || Object.keys(row)[1];

          return {
            subjectName: String(row[nameKey] || "Subject"),
            score: Number(row[scoreKey]) || 0,
            maxScore: 100,
          };
        });

        setExtractedSubjects(parsed);
        toast.success(`Loaded ${parsed.length} subject entries from ${file.name}`);
      } catch (err) {
        console.error("Excel parse error:", err);
        toast.error("Could not parse file. Ensure it is a valid .xlsx or .csv file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleAddRow = () => {
    setExtractedSubjects([
      ...extractedSubjects,
      { subjectName: "", score: 75, maxScore: 100 },
    ]);
  };

  const handleRemoveRow = (idx) => {
    setExtractedSubjects(extractedSubjects.filter((_, i) => i !== idx));
  };

  const handleRowChange = (idx, field, val) => {
    const updated = [...extractedSubjects];
    updated[idx][field] = field === "score" ? Number(val) : val;
    setExtractedSubjects(updated);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (extractedSubjects.length === 0) {
      toast.error("Please add or upload at least one subject record");
      return;
    }

    setLoading(true);
    try {
      const res = await analyzeLmsDataApi(fileName || "LMS_Record.xlsx", extractedSubjects);
      if (res.success && res.data) {
        setLmsResult(res.data);
        // Persist to MongoDB history (Part 7)
        await saveAnalysisApi("LMS", `LMS Report: ${fileName || "Marks File"}`, res.data);
        toast.success("LMS Performance analysis saved!");
      } else {
        toast.error(res.message || "Failed to analyze LMS data");
      }
    } catch (err) {
      toast.error(err.message || "Server error during LMS analysis");
    } finally {
      setLoading(false);
    }
  };

  const totalScore = extractedSubjects.reduce((acc, s) => acc + (s.score || 0), 0);
  const avgScore = extractedSubjects.length ? Math.round(totalScore / extractedSubjects.length) : 0;
  const sorted = [...extractedSubjects].sort((a, b) => (b.score || 0) - (a.score || 0));
  const best = sorted[0]?.subjectName || "N/A";
  const weakest = sorted[sorted.length - 1]?.subjectName || "N/A";

  if (fetchingSaved) {
    return <LoadingSpinner label="Loading saved LMS analysis..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileSpreadsheet className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          LMS Excel / CSV Performance Analysis
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload LMS export files (.xlsx or .csv) to auto-extract student marks and receive AI improvement plans.
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">LMS Average Score</p>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{avgScore}%</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Highest Scoring Subject</p>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{best}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4 border-l-4 border-l-rose-500">
          <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Priority Focus Subject</p>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{weakest}</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Marks Table */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Upload LMS Excel / CSV File">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors bg-slate-50/50 dark:bg-slate-800/50">
                <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {fileName ? fileName : "Click or drag LMS .xlsx / .csv file here"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Supports standard Excel and CSV exports</p>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="lms-file-input"
                />
                <label
                  htmlFor="lms-file-input"
                  className="inline-block mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  Browse File
                </label>
              </div>

              {/* Extracted Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Extracted Subject Marks
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {extractedSubjects.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Subject"
                        value={row.subjectName}
                        onChange={(e) => handleRowChange(idx, "subjectName", e.target.value)}
                        className="flex-1 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                      <input
                        type="number"
                        placeholder="Marks"
                        value={row.score}
                        onChange={(e) => handleRowChange(idx, "score", e.target.value)}
                        className="w-20 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="lg"
                  loading={loading}
                  onClick={handleAnalyze}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                  icon={Sparkles}
                >
                  Analyze LMS Marks with Gemini AI
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results View */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <Card className="p-6">
              <LoadingSpinner label="Evaluating LMS report data with Gemini AI..." />
            </Card>
          ) : lmsResult ? (
            <div className="space-y-6">
              {/* Summary */}
              <Card title="LMS AI Analysis & Strategy" className="border-l-4 border-l-emerald-600">
                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lmsResult.aiAnalysis?.overallPerformance || lmsResult.overallPerformance || "LMS performance evaluated."}
                </p>
              </Card>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Strong Subjects">
                  <div className="space-y-2">
                    {(lmsResult.aiAnalysis?.strengths || lmsResult.strengths)?.map((str, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Weak Subjects Detected">
                  <div className="space-y-2">
                    {(lmsResult.aiAnalysis?.areasToImprove || lmsResult.areasToImprove)?.map((area, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Action Plan */}
              <Card title="Target Score Suggestions & Improvement Plan">
                <div className="space-y-3">
                  {(lmsResult.aiAnalysis?.recommendations || lmsResult.recommendations)?.map((rec, i) => (
                    <div key={i} className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                      🎯 {rec}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Ready for LMS Data Analysis</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload an Excel/CSV file or edit the subject marks table on the left to generate an AI performance diagnostic.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LmsAnalysisPage;
