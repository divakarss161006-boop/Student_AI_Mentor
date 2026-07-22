import React, { useEffect, useState } from "react";
import { getHistoryApi, deleteHistoryItemApi } from "../api/historyApi";
import {
  History as HistoryIcon,
  Trash2,
  Eye,
  Calendar,
  FileSpreadsheet,
  BarChart3,
  Briefcase,
  FileText,
  Sparkles,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import SkeletonLoader from "../components/common/SkeletonLoader";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await getHistoryApi();
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      toast.error("Failed to load analysis history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this history record?")) return;

    try {
      const res = await deleteHistoryItemApi(id);
      if (res.success) {
        toast.success("History item deleted");
        fetchHistory();
      }
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const filteredHistory =
    filterType === "All"
      ? history
      : history.filter((item) => item.type === filterType);

  const getTypeIcon = (type) => {
    switch (type) {
      case "LMS":
        return FileSpreadsheet;
      case "Performance":
        return BarChart3;
      case "StudyPlan":
        return Calendar;
      case "Internship":
        return Briefcase;
      case "Resume":
        return FileText;
      default:
        return Sparkles;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Analysis History</h1>
        <SkeletonLoader count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <HistoryIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          AI Analysis History Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review, reopen, and manage your past AI-generated study plans, career roadmaps, LMS reports, and ATS resume evaluations.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
        {["All", "LMS", "Performance", "StudyPlan", "Internship", "Resume"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filterType === type
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* History Grid */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => {
            const Icon = getTypeIcon(item.type);
            return (
              <Card key={item._id} className="p-5 space-y-4 relative flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{item.type}</Badge>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </h3>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItem(item)}
                    icon={Eye}
                  >
                    Reopen Report
                  </Button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12 space-y-3">
          <HistoryIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            No history records found for this category.
          </p>
        </Card>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem ? `${selectedItem.type}: ${selectedItem.title}` : "Analysis Report"}
        maxWidth="max-w-2xl"
      >
        {selectedItem && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
              Generated on {new Date(selectedItem.createdAt).toLocaleString()}
            </div>
            <pre className="text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 rounded-xl font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
              {JSON.stringify(selectedItem.data, null, 2)}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;
