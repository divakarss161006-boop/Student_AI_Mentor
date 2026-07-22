import React, { useState, useEffect } from "react";
import { uploadResumePdfApi, analyzeResumeApi } from "../api/aiApi";
import { saveAnalysisApi, getLatestByTypeApi } from "../api/historyApi";
import {
  FileText,
  Upload,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ResumeAnalysisPage = () => {
  const [fileName, setFileName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSaved, setFetchingSaved] = useState(true);
  const [resumeResult, setResumeResult] = useState(null);

  // Auto-fetch saved resume analysis on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await getLatestByTypeApi("Resume");
        if (res.success && res.data) {
          setResumeResult(res.data);
        }
      } catch (err) {
        console.error("Failed to load saved resume analysis:", err);
      } finally {
        setFetchingSaved(false);
      }
    };

    fetchLatest();
  }, []);

  // PDF File Upload Handler (Multipart Form-Data to Backend Multer + PDF-Parse + Gemini)
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume exceeds size limit (10MB maximum).");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    toast.loading("Uploading PDF & analyzing ATS score...", { id: "pdf-toast" });

    try {
      const res = await uploadResumePdfApi(file);

      if (res.success && res.data) {
        setResumeResult(res.data);
        if (res.extractedText) setResumeText(res.extractedText);

        // Auto-save to Mongo history
        await saveAnalysisApi("Resume", `ATS Review: ${file.name}`, res.data);
        toast.success("Resume ATS Analysis complete!", { id: "pdf-toast" });
      } else {
        toast.error(res.message || "Failed to analyze resume", { id: "pdf-toast" });
      }
    } catch (err) {
      console.error("PDF upload error:", err);
      // Display specific backend error message
      const errMsg = err.response?.data?.message || err.message || "Failed to analyze uploaded PDF";
      toast.error(errMsg, { id: "pdf-toast" });
    } finally {
      setLoading(false);
    }
  };

  const runAnalysisFromText = async (e) => {
    if (e) e.preventDefault();

    if (!resumeText || resumeText.trim().length < 10) {
      toast.error("Please upload a PDF resume or paste plain text (at least 10 characters)");
      return;
    }

    setLoading(true);
    try {
      const res = await analyzeResumeApi(resumeText);
      if (res.success && res.data) {
        setResumeResult(res.data);
        await saveAnalysisApi("Resume", `ATS Review: ${fileName || "Resume Text"}`, res.data);
        toast.success("Resume ATS Analysis complete!");
      } else {
        toast.error(res.message || "Failed to analyze resume");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Gemini analysis failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingSaved) {
    return <LoadingSpinner label="Loading saved ATS resume analysis..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          PDF Resume ATS Analysis
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload your PDF resume to extract text, evaluate ATS compatibility scores, and discover missing skills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Box */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Upload PDF Resume">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors bg-slate-50/50 dark:bg-slate-800/50">
                <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {fileName ? fileName : "Upload PDF Resume"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PDF documents (max 10MB)</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  id="pdf-resume-input"
                />
                <label
                  htmlFor="pdf-resume-input"
                  className="inline-block mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
                >
                  Select PDF File
                </label>
              </div>

              {/* Text Fallback Area */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wide mb-1">
                  Extracted Resume Text (Editable)
                </label>
                <textarea
                  rows="8"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Extracted text from PDF will appear here..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={runAnalysisFromText}
                className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                icon={Sparkles}
              >
                Re-Analyze Resume Text
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <Card className="p-6">
              <LoadingSpinner label="Parsing PDF text & scoring ATS readiness with Gemini AI..." />
            </Card>
          ) : resumeResult ? (
            <div className="space-y-6">
              {/* Score Header */}
              <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                      ATS Score Assessment
                    </span>
                    <h3 className="text-3xl font-extrabold mt-1">
                      {resumeResult.overallScore || resumeResult.atsScore || 75}%
                    </h3>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Award className="w-8 h-8 text-amber-300" />
                  </div>
                </div>
              </Card>

              {/* Strengths & Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Resume Strengths">
                  <div className="space-y-2">
                    {resumeResult.strengths?.map((str, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Missing Skills & Keywords">
                  <div className="space-y-2">
                    {resumeResult.missingSkills?.map((skill, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Improvements */}
              <Card title="ATS Optimization Suggestions">
                <div className="space-y-2">
                  {resumeResult.suggestedImprovements?.map((imp, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      • {imp}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recommended Roles */}
              {resumeResult.recommendedRoles && (
                <Card title="Target Internship & Job Roles" icon={Briefcase}>
                  <div className="flex flex-wrap gap-2">
                    {resumeResult.recommendedRoles.map((role, i) => (
                      <Badge key={i} variant="primary" className="py-1 px-3 text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Upload Your PDF Resume</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a PDF resume file on the left to extract text and analyze ATS compatibility.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;
