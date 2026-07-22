import React from "react";
import { Sparkles, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-8 px-4 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            Student AI Mentor &copy; {new Date().getFullYear()}
          </span>
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          Empowering academic excellence with Google Gemini AI.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
