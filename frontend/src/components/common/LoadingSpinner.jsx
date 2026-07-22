import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ fullScreen = false, label = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs flex flex-col items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      {label && <p className="text-sm font-medium text-slate-500">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
