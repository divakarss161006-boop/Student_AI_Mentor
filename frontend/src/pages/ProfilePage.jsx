import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStudentProfileApi, updateStudentProfileApi } from "../api/studentApi";
import {
  User,
  Mail,
  GraduationCap,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  BookOpen,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [grade, setGrade] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfileApi();
        if (res.success && res.data) {
          setGrade(res.data.grade || "");
          setSubjects(res.data.subjects || []);
          setGoals(res.data.goals || []);
        }
      } catch (err) {
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      { subjectName: "", score: 75, attendancePercentage: 90 },
    ]);
  };

  const handleRemoveSubject = (idx) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  const handleSubjectChange = (idx, field, value) => {
    const updated = [...subjects];
    updated[idx][field] = field === "subjectName" ? value : Number(value);
    setSubjects(updated);
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, newGoal.trim()]);
    setNewGoal("");
  };

  const handleRemoveGoal = (idx) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    setSaving(true);
    try {
      const profileData = { grade, subjects, goals };
      const res = await updateStudentProfileApi(profileData);

      if (res.success) {
        toast.success("Student profile updated successfully!");
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.message || "Server error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading student profile..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <User className="w-7 h-7 text-blue-600" />
          Student Academic Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, enrolled subjects, and target learning goals.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Basic Info Card */}
        <Card title="Personal & Account Details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Full Name" value={user?.name || ""} disabled icon={User} />
            <Input label="Email Address" value={user?.email || ""} disabled icon={Mail} />
            <Input
              label="Grade / Class"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. 12th Standard - PCM"
              icon={GraduationCap}
            />
          </div>
        </Card>

        {/* Subjects Card */}
        <Card
          title="Enrolled Subjects & Scores"
          subtitle="Add your subjects to keep your performance data updated"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSubject}
              icon={Plus}
            >
              Add Subject
            </Button>
          }
        >
          {subjects.length > 0 ? (
            <div className="space-y-3">
              {subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80"
                >
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={sub.subjectName}
                    onChange={(e) =>
                      handleSubjectChange(idx, "subjectName", e.target.value)
                    }
                    className="w-full sm:flex-1 text-xs font-bold p-2 rounded-lg border border-slate-200 bg-white"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="w-1/2 sm:w-28">
                      <input
                        type="number"
                        placeholder="Score %"
                        value={sub.score}
                        onChange={(e) =>
                          handleSubjectChange(idx, "score", e.target.value)
                        }
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div className="w-1/2 sm:w-28">
                      <input
                        type="number"
                        placeholder="Attend %"
                        value={sub.attendancePercentage}
                        onChange={(e) =>
                          handleSubjectChange(
                            idx,
                            "attendancePercentage",
                            e.target.value
                          )
                        }
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(idx)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No subjects added yet. Click "Add Subject" to begin.
            </p>
          )}
        </Card>

        {/* Goals Card */}
        <Card title="Target Academic Goals" subtitle="Define what you want to achieve">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a new goal (e.g. Score > 90% in Physics)..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <Button type="button" variant="primary" size="sm" onClick={handleAddGoal}>
                Add Goal
              </Button>
            </div>

            <div className="space-y-2">
              {goals.map((goal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 text-xs font-semibold text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{goal}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={Save}
            className="shadow-lg shadow-blue-500/20 px-8"
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
