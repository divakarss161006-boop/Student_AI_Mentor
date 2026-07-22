import React, { useEffect, useState } from "react";
import {
  getExamsApi,
  createExamApi,
  updateExamApi,
  deleteExamApi,
} from "../api/examApi";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ExamPlannerPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [subject, setSubject] = useState("");
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [targetMarks, setTargetMarks] = useState(90);

  const fetchExams = async () => {
    try {
      const res = await getExamsApi();
      if (res.success && res.data) {
        setExams(res.data);
      }
    } catch (err) {
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const openAddModal = () => {
    setEditingExam(null);
    setSubject("");
    setExamName("");
    setExamDate("");
    setTargetMarks(90);
    setIsModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setSubject(exam.subject);
    setExamName(exam.examName);
    setExamDate(exam.examDate ? exam.examDate.slice(0, 10) : "");
    setTargetMarks(exam.targetMarks);
    setIsModalOpen(true);
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();

    if (!subject || !examName || !examDate) {
      toast.error("Please fill in subject, exam name, and date");
      return;
    }

    try {
      const examData = { subject, examName, examDate, targetMarks: Number(targetMarks) };

      if (editingExam) {
        const res = await updateExamApi(editingExam._id, examData);
        if (res.success) {
          toast.success("Exam updated successfully!");
        }
      } else {
        const res = await createExamApi(examData);
        if (res.success) {
          toast.success("Exam added to planner!");
        }
      }

      setIsModalOpen(false);
      fetchExams();
    } catch (err) {
      toast.error(err.message || "Failed to save exam");
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam entry?")) return;

    try {
      const res = await deleteExamApi(id);
      if (res.success) {
        toast.success("Exam deleted");
        fetchExams();
      }
    } catch (err) {
      toast.error("Failed to delete exam");
    }
  };

  const calculateCountdown = (dateString) => {
    const today = new Date();
    const target = new Date(dateString);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Completed", variant: "neutral" };
    if (diffDays === 0) return { text: "Today!", variant: "danger" };
    if (diffDays === 1) return { text: "Tomorrow!", variant: "danger" };
    if (diffDays <= 7) return { text: `In ${diffDays} days`, variant: "accent" };
    return { text: `In ${diffDays} days`, variant: "primary" };
  };

  if (loading) {
    return <LoadingSpinner label="Loading exam schedule..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-blue-600" />
            Exam Planner & Countdown
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of upcoming exams, target marks, and countdown dates.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={openAddModal} icon={Plus}>
          Add New Exam
        </Button>
      </div>

      {/* Exam Grid */}
      {exams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => {
            const countdown = calculateCountdown(exam.examDate);
            return (
              <Card key={exam._id} className="p-5 space-y-4 relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      {exam.subject}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 mt-0.5">
                      {exam.examName}
                    </h3>
                  </div>
                  <Badge variant={countdown.variant}>{countdown.text}</Badge>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5" /> Date:
                    </span>
                    <span className="font-bold text-slate-800">
                      {new Date(exam.examDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Target Marks:
                    </span>
                    <span className="font-extrabold text-blue-600">{exam.targetMarks}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEditModal(exam)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="font-bold text-slate-800 text-base">No Exams Scheduled</h3>
            <p className="text-xs text-slate-500">
              Click "Add New Exam" to start tracking upcoming tests and target scores.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={openAddModal} icon={Plus}>
            Add Your First Exam
          </Button>
        </Card>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExam ? "Edit Exam Entry" : "Add New Exam"}
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
          <Input
            label="Subject"
            placeholder="e.g. Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <Input
            label="Exam Name / Title"
            placeholder="e.g. Midterm Board Exam"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            required
          />

          <Input
            label="Exam Date"
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />

          <Input
            label="Target Score (%)"
            type="number"
            min="1"
            max="100"
            value={targetMarks}
            onChange={(e) => setTargetMarks(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingExam ? "Update Exam" : "Add Exam"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamPlannerPage;
