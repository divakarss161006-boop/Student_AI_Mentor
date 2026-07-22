import React, { useEffect, useState } from "react";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../api/taskApi";
import {
  CheckSquare,
  Plus,
  Trash2,
  Check,
  Clock,
  BookOpen,
  Code,
  Briefcase,
  User,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";

const TaskTrackerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState("medium");

  const categories = ["All", "Study", "Coding", "Internship", "Personal"];

  const fetchTasks = async () => {
    try {
      const res = await getTasksApi();
      if (res.success && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      const res = await createTaskApi({ title, category, priority });
      if (res.success) {
        toast.success("Task created!");
        setTitle("");
        setIsModalOpen(false);
        fetchTasks();
      }
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedStatus = !task.completed;
      const res = await updateTaskApi(task._id, { completed: updatedStatus });
      if (res.success) {
        toast.success(updatedStatus ? "Task marked complete! 🎉" : "Task marked active");
        fetchTasks();
      }
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await deleteTaskApi(id);
      if (res.success) {
        toast.success("Task deleted");
        fetchTasks();
      }
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Filter tasks
  const filteredTasks =
    filterCategory === "All"
      ? tasks
      : tasks.filter((t) => t.category === filterCategory);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Coding":
        return Code;
      case "Internship":
        return Briefcase;
      case "Personal":
        return User;
      default:
        return BookOpen;
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading tasks..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-blue-600" />
            Daily Task Tracker & Goals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize daily tasks across Study, Coding, Internship, and Personal categories.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={Plus}>
          Add Daily Task
        </Button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex items-center justify-between p-5 border-l-4 border-l-blue-600">
          <div>
            <p className="text-xs font-semibold text-slate-500">Today's Progress</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{completionPercentage}%</h3>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-slate-200 flex items-center justify-center font-bold text-xs text-blue-600">
            {completedCount}/{totalCount}
          </div>
        </Card>

        <Card className="flex items-center justify-between p-5 border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-semibold text-slate-500">Completed Tasks</p>
            <h3 className="text-2xl font-extrabold text-emerald-600">{completedCount}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Check className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between p-5 border-l-4 border-l-amber-500">
          <div>
            <p className="text-xs font-semibold text-slate-500">Remaining Tasks</p>
            <h3 className="text-2xl font-extrabold text-amber-600">
              {totalCount - completedCount}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterCategory === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const CatIcon = getCategoryIcon(task.category);
            return (
              <Card
                key={task._id}
                className={`p-4 flex items-center justify-between transition-all ${
                  task.completed ? "opacity-60 bg-slate-50/70" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                      task.completed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-blue-500 bg-white"
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs sm:text-sm font-bold text-slate-800 truncate ${
                        task.completed ? "line-through text-slate-400" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                        <CatIcon className="w-3 h-3 text-blue-600" /> {task.category}
                      </span>
                      <span className="text-slate-300">•</span>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "danger"
                            : task.priority === "medium"
                            ? "accent"
                            : "neutral"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors ml-3"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12 space-y-3">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500 font-medium">No tasks found for this category.</p>
        </Card>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Daily Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Description"
            placeholder="e.g. Complete 5 LeetCode problems or Revise Optics"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 block uppercase tracking-wide mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="Study">Study</option>
              <option value="Coding">Coding</option>
              <option value="Internship">Internship</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block uppercase tracking-wide mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskTrackerPage;
