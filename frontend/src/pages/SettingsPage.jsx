import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings, Bell, Shield, Moon, Sun, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const SettingsPage = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-slate-700" />
          Application Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize notifications, preferences, and security options.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications Card */}
        <Card title="Notification Preferences">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Email Study Reminders</h4>
                <p className="text-[11px] text-slate-500">Receive daily study schedule prompts via email.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Proactive AI Recommendations</h4>
                <p className="text-[11px] text-slate-500">Get automatic AI tips based on grade changes.</p>
              </div>
              <input
                type="checkbox"
                checked={aiSuggestions}
                onChange={(e) => setAiSuggestions(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </div>
          </div>
        </Card>

        {/* Security Info Card */}
        <Card title="Account Security">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800">Account Email</p>
                <p className="text-slate-500">{user?.email}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                Verified
              </span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
