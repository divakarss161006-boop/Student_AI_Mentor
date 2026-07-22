import React, { useEffect, useState } from "react";
import { getExamsApi } from "../api/examApi";
import { getTasksApi } from "../api/taskApi";
import { getGithubProfileApi } from "../api/githubApi";
import {
  Bell,
  Calendar,
  CheckSquare,
  Github,
  Share2,
  Briefcase,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

const NotificationsPage = () => {
  const [exams, setExams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [github, setGithub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, tasksRes, githubRes] = await Promise.all([
          getExamsApi().catch(() => ({ data: [] })),
          getTasksApi().catch(() => ({ data: [] })),
          getGithubProfileApi().catch(() => ({ data: null })),
        ]);

        if (examsRes.success) setExams(examsRes.data || []);
        if (tasksRes.success) setTasks(tasksRes.data || []);
        if (githubRes.success) setGithub(githubRes.data);
      } catch (err) {
        console.error("Notifications fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Compiling reminders & notifications..." />;
  }

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const upcomingExams = exams.filter((e) => new Date(e.examDate) >= new Date());

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Bell className="w-7 h-7 text-amber-500" />
          Reminder Center & AI Notifications
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Stay on top of upcoming exams, incomplete daily tasks, GitHub commit streaks, and LinkedIn branding milestones.
        </p>
      </div>

      <div className="space-y-4">
        {/* Upcoming Exams Alerts */}
        {upcomingExams.length > 0 && (
          <Card className="border-l-4 border-l-rose-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Upcoming Exam Alert</h4>
                <p className="text-xs text-slate-500">You have {upcomingExams.length} upcoming exam(s) scheduled.</p>
              </div>
            </div>
            <div className="space-y-2 pl-10">
              {upcomingExams.slice(0, 3).map((exam) => (
                <div key={exam._id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">{exam.subject} — {exam.examName}</span>
                  <Badge variant="danger">
                    Date: {new Date(exam.examDate).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Incomplete Tasks */}
        {incompleteTasks.length > 0 && (
          <Card className="border-l-4 border-l-amber-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Pending Tasks Reminder</h4>
                <p className="text-xs text-slate-500">{incompleteTasks.length} daily task(s) remaining for today.</p>
              </div>
            </div>
            <div className="space-y-2 pl-10">
              {incompleteTasks.slice(0, 4).map((task) => (
                <div key={task._id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">{task.title}</span>
                  <Badge variant="accent">{task.category}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* GitHub Commit Reminder */}
        <Card className="border-l-4 border-l-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-900 rounded-lg">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">GitHub Contribution Streak</h4>
                <p className="text-xs text-slate-500">
                  {github?.username
                    ? `Connected as @${github.username}`
                    : "Remember to push today's code and maintain your commit green streak!"}
                </p>
              </div>
            </div>
            <Badge variant="neutral">Daily Streak</Badge>
          </div>
        </Card>

        {/* LinkedIn Post Reminder */}
        <Card className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">LinkedIn Branding Reminder</h4>
                <p className="text-xs text-slate-500">Share your latest project update or certificate on LinkedIn this week.</p>
              </div>
            </div>
            <Badge variant="primary">Weekly Goal</Badge>
          </div>
        </Card>

        {/* Internship Goal Reminder */}
        <Card className="border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Internship Readiness Goal</h4>
                <p className="text-xs text-slate-500">Review missing skill roadmaps and update your resume ATS score.</p>
              </div>
            </div>
            <Badge variant="secondary">Career Goal</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
