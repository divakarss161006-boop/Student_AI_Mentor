import React, { useEffect, useState } from "react";
import { syncGithubProfileApi, getGithubProfileApi } from "../api/githubApi";
import {
  Github,
  Sparkles,
  GitBranch,
  Star,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

const GithubAssistantPage = () => {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getGithubProfileApi();
        if (res.success && res.data) {
          setProfile(res.data);
          setUsername(res.data.username || "");
        }
      } catch (err) {
        console.error("Failed to load GitHub profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSync = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter a valid GitHub username");
      return;
    }

    setSyncing(true);
    try {
      const res = await syncGithubProfileApi(username, []);
      if (res.success && res.data) {
        setProfile(res.data);
        toast.success("GitHub productivity metrics synced!");
      } else {
        toast.error(res.message || "Failed to sync GitHub profile");
      }
    } catch (err) {
      toast.error(err.message || "Server error syncing GitHub data");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading GitHub metrics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Github className="w-7 h-7 text-slate-900" />
          GitHub Productivity Assistant
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track repository updates, commit reminders, and AI suggestions to build a strong developer portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Username input */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="GitHub Account Setup">
            <form onSubmit={handleSync} className="space-y-4">
              <Input
                label="GitHub Username"
                placeholder="e.g. octocat or your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={Github}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={syncing}
                className="w-full bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/20"
                icon={RefreshCw}
              >
                Sync GitHub Profile
              </Button>
            </form>
          </Card>
        </div>

        {/* Dashboard View */}
        <div className="lg:col-span-8 space-y-6">
          {syncing ? (
            <Card className="min-h-[350px] flex items-center justify-center">
              <LoadingSpinner label="Fetching public repositories & generating AI tips..." />
            </Card>
          ) : profile ? (
            <div className="space-y-6">
              {/* Profile Metrics Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="p-5 border-l-4 border-l-slate-900">
                  <p className="text-xs font-semibold text-slate-500">Public Repositories</p>
                  <h3 className="text-2xl font-extrabold text-slate-800">
                    {profile.repoCount || profile.repositories?.length || 0}
                  </h3>
                </Card>

                <Card className="p-5 border-l-4 border-l-emerald-500">
                  <p className="text-xs font-semibold text-slate-500">Commit Status</p>
                  <h3 className="text-sm font-extrabold text-emerald-600 flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Active Streak
                  </h3>
                </Card>

                <Card className="p-5 border-l-4 border-l-amber-500">
                  <p className="text-xs font-semibold text-slate-500">Last Synced Push</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">
                    {profile.lastPushDate
                      ? new Date(profile.lastPushDate).toLocaleDateString()
                      : "Today"}
                  </p>
                </Card>
              </div>

              {/* Repositories List */}
              <Card title="Public Repositories Overview">
                {profile.repositories?.length > 0 ? (
                  <div className="space-y-3">
                    {profile.repositories.map((repo, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate flex items-center gap-1.5">
                            <GitBranch className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            {repo.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {repo.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            {repo.language || "Code"}
                          </span>
                          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" /> {repo.stars || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No repositories loaded yet.
                  </p>
                )}
              </Card>

              {/* AI Suggestions */}
              <Card title="AI Portfolio Improvement Recommendations" icon={Sparkles}>
                <div className="space-y-3">
                  {profile.aiSuggestions?.map((tip, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900 text-white flex items-start gap-3 text-xs font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="min-h-[350px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <Github className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="font-bold text-slate-800 text-base">Connect Your GitHub</h3>
                <p className="text-xs text-slate-500">
                  Enter your GitHub username on the left to track public repository stats and get daily commit streak reminders.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GithubAssistantPage;
