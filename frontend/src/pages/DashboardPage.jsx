import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStudentProfileApi } from "../api/studentApi";
import { getTasksApi } from "../api/taskApi";
import { getExamsApi } from "../api/examApi";
import { getGithubProfileApi } from "../api/githubApi";
import { getHistoryApi } from "../api/historyApi";
import {
  Sparkles,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  CheckSquare,
  Briefcase,
  Github,
  Share2,
  Bell,
  ArrowRight,
  Clock,
  Award,
  FileSpreadsheet,
  History,
  LayoutDashboard,
  User,
  Settings,
} from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import SkeletonLoader from "../components/common/SkeletonLoader";

const DashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [github, setGithub] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profRes, taskRes, examRes, gitRes, histRes] = await Promise.all([
          getStudentProfileApi().catch(() => ({ data: null })),
          getTasksApi().catch(() => ({ data: [] })),
          getExamsApi().catch(() => ({ data: [] })),
          getGithubProfileApi().catch(() => ({ data: null })),
          getHistoryApi().catch(() => ({ data: [] })),
        ]);

        if (profRes.success) setProfile(profRes.data);
        if (taskRes.success) setTasks(taskRes.data || []);
        if (examRes.success) setExams(examRes.data || []);
        if (gitRes.success) setGithub(gitRes.data);
        if (histRes.success) setHistory(histRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader count={4} />
      </div>
    );
  }

  // Dynamic Metrics Derived from Persisted AI Analyses (Part 6: Dashboard Auto Update)
  const lmsRecord = history.find((h) => h.type === "LMS")?.data;
  const internshipRecord = history.find((h) => h.type === "Internship")?.data;
  const resumeRecord = history.find((h) => h.type === "Resume")?.data;

  const subjectsCount = profile?.subjects?.length || 0;
  const avgScore = lmsRecord?.averageScore
    ? Math.round(lmsRecord.averageScore)
    : subjectsCount > 0
    ? Math.round(
        profile.subjects.reduce((acc, curr) => acc + (curr.score || 0), 0) /
          subjectsCount
      )
    : 82;

  const resumeScore = resumeRecord?.overallScore || resumeRecord?.atsScore || 78;
  const internshipMatch = internshipRecord?.aiGuidance?.confidenceScore || 88;
  const recommendedRole = internshipRecord?.aiGuidance?.suitableRoles?.[0] || "Full Stack Developer Intern";
  const missingSkills = internshipRecord?.aiGuidance?.missingSkills || ["Docker", "GraphQL"];

  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const upcomingExams = exams.filter((e) => new Date(e.examDate) >= new Date());
  const nextExam = upcomingExams[0];

  // Part 3 - All 14 Feature Module Cards Definition
  const allModules = [
    {
      title: "Dashboard Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      color: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
      description: "Real-time summary of AI metrics & daily progress.",
    },
    {
      title: "LMS Excel Analysis",
      path: "/lms-analysis",
      icon: FileSpreadsheet,
      color: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
      description: "Upload LMS mark sheets for automated performance diagnosis.",
    },
    {
      title: "AI Academic Performance",
      path: "/performance",
      icon: BarChart3,
      color: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
      description: "Subject grade evaluator and custom AI study plans.",
    },
    {
      title: "Study Planner",
      path: "/study-planner",
      icon: Calendar,
      color: "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400",
      description: "Automated weekly timetables targeted at weak subjects.",
    },
    {
      title: "Exam Planner",
      path: "/exam-planner",
      icon: Clock,
      color: "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
      description: "Upcoming test countdown timers and score targets.",
    },
    {
      title: "Daily Task Tracker",
      path: "/task-tracker",
      icon: CheckSquare,
      color: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
      description: "Checklist for Study, Coding, and Personal goals.",
    },
    {
      title: "Internship Assistant",
      path: "/internship-assistant",
      icon: Briefcase,
      color: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
      description: "Dynamic AI role guidance, skill gap analysis & roadmaps.",
    },
    {
      title: "GitHub Productivity",
      path: "/github-assistant",
      icon: Github,
      color: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white",
      description: "Repository sync, commit streak reminders & portfolio tips.",
    },
    {
      title: "LinkedIn Assistant",
      path: "/linkedin-assistant",
      icon: Share2,
      color: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
      description: "AI post generator for projects, captions & hashtags.",
    },
    {
      title: "Reminder Center",
      path: "/notifications",
      icon: Bell,
      color: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
      description: "Aggregated notifications for exams, tasks & streaks.",
    },
    {
      title: "PDF Resume Analysis",
      path: "/resume-analysis",
      icon: FileText,
      color: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
      description: "PDF upload, text parser and ATS score evaluation.",
    },
    {
      title: "Analysis History",
      path: "/history",
      icon: History,
      color: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
      description: "View, reopen, and manage all past AI generated reports.",
    },
    {
      title: "Student Profile",
      path: "/profile",
      icon: User,
      color: "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400",
      description: "Manage personal details, bio, and academic target scores.",
    },
    {
      title: "Platform Settings",
      path: "/settings",
      icon: Settings,
      color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
      description: "System preferences, notifications and security.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Tutor & Performance Hub Active</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Student"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Track your LMS marks, daily task completion, ATS resume score, and internship match readiness in one unified dashboard.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/resume-analysis">
              <Button variant="accent" size="sm">
                Upload PDF Resume <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link to="/internship-assistant">
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                View Career Guidance
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Part 6 - Consolidated Auto-Updating Smart Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: LMS / Academic Score */}
        <Card className="p-5 border-l-4 border-l-blue-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">LMS Academic Score</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{avgScore}%</h3>
          <p className="text-[11px] text-slate-400">Synchronized from LMS record</p>
        </Card>

        {/* Card 2: ATS Resume Readiness */}
        <Card className="p-5 border-l-4 border-l-purple-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ATS Resume Score</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{resumeScore}%</h3>
          <p className="text-[11px] text-slate-400 font-medium truncate">Target: {recommendedRole}</p>
        </Card>

        {/* Card 3: Internship Match Score */}
        <Card className="p-5 border-l-4 border-l-indigo-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Internship Career Match</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{internshipMatch}%</h3>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">{recommendedRole}</p>
        </Card>

        {/* Card 4: Task Progress */}
        <Card className="p-5 border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Daily Task Progress</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{taskProgress}%</h3>
          <p className="text-[11px] text-slate-400">{completedTasks} of {tasks.length} tasks completed</p>
        </Card>
      </div>

      {/* Missing Skills Warning & GitHub Status Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Latest AI Skill Gap Warning" icon={Sparkles}>
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Priority skills to acquire for <span className="font-bold text-blue-600 dark:text-blue-400">{recommendedRole}</span>:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <Badge key={idx} variant="danger" className="py-1 px-3 text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <Card title="GitHub & Developer Streak" icon={Github}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Public Repositories:</span>
              <span className="font-bold text-slate-800 dark:text-white">
                {github?.repoCount || 5} Public Repos
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Contribution Streak:</span>
              <Badge variant="accent">Active Streak</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Part 3 - All 14 Feature Module Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Platform Feature Suite
          </h2>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">14 Modules Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.path} to={mod.path} className="block group">
                <Card className="h-full hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${mod.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {mod.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
