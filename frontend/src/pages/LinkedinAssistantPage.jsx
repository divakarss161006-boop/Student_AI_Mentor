import React, { useState } from "react";
import { generateLinkedinPostApi } from "../api/linkedinApi";
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  Award,
  Briefcase,
  Code,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

const LinkedinAssistantPage = () => {
  const [postType, setPostType] = useState("Project");
  const [topic, setTopic] = useState("Student AI Mentor Platform");
  const [details, setDetails] = useState(
    "Built a fullstack MERN application with Google Gemini AI for automated study schedules, performance analytics, and ATS resume scanning."
  );
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error("Please enter a project, internship, or certification topic");
      return;
    }

    setLoading(true);
    try {
      const res = await generateLinkedinPostApi({ postType, topic, details });
      if (res.success && res.data) {
        setGeneratedResult(res.data);
        toast.success("LinkedIn post generated successfully!");
      } else {
        toast.error(res.message || "Failed to generate post");
      }
    } catch (err) {
      toast.error(err.message || "Server error generating LinkedIn post");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult?.generatedPost) return;
    const fullContent = `${generatedResult.generatedPost}\n\n${generatedResult.hashtags?.join(" ")}`;
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    toast.success("Copied post to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Share2 className="w-7 h-7 text-blue-600" />
          LinkedIn Personal Branding Assistant
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate professional LinkedIn posts, captions, and trending hashtags for your projects, internships, and certifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Post Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Post Generator Settings">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block uppercase tracking-wide mb-1.5">
                  Select Milestone Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Project", "Internship", "Certification"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPostType(type)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        postType === type
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Milestone / Project Name"
                placeholder="e.g. Student AI Mentor App"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 block uppercase tracking-wide mb-1">
                  Key Accomplishments / Tech Stack
                </label>
                <textarea
                  rows="4"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Mention key features, frameworks used, or goals achieved..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full shadow-md shadow-blue-500/20"
                icon={Sparkles}
              >
                Generate LinkedIn Post
              </Button>
            </form>
          </Card>
        </div>

        {/* Generated Post Output */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <Card className="min-h-[400px] flex items-center justify-center">
              <LoadingSpinner label="Crafting engaging LinkedIn post with Gemini AI..." />
            </Card>
          ) : generatedResult ? (
            <div className="space-y-6">
              {/* Post Box */}
              <Card
                title="Generated LinkedIn Post"
                subtitle="Ready to copy and share on your profile"
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    icon={copied ? Check : Copy}
                  >
                    {copied ? "Copied!" : "Copy Post"}
                  </Button>
                }
              >
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {generatedResult.generatedPost}
                </div>
              </Card>

              {/* Caption & Hashtags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Short Caption Option">
                  <p className="text-xs text-slate-700 font-semibold bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                    "{generatedResult.caption}"
                  </p>
                </Card>

                <Card title="Suggested Hashtags" icon={Tag}>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedResult.hashtags?.map((tag, i) => (
                      <Badge key={i} variant="primary" className="py-1 px-2.5 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Share2 className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-bold text-slate-800 text-base">Generate Engaging Posts</h3>
                <p className="text-xs text-slate-500">
                  Select a milestone type and enter key details on the left to create professional LinkedIn posts with hashtags.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedinAssistantPage;
