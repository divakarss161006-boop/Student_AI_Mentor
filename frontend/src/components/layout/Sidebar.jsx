import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  Clock,
  CheckSquare,
  Briefcase,
  Github,
  Share2,
  Bell,
  FileText,
  History,
  User,
  Settings,
} from "lucide-react";

const Sidebar = ({ isCollapsed, isOpen, onClose }) => {
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "LMS Excel Analysis", path: "/lms-analysis", icon: FileSpreadsheet },
    { label: "AI Performance", path: "/performance", icon: BarChart3 },
    { label: "Study Planner", path: "/study-planner", icon: Calendar },
    { label: "Exam Planner", path: "/exam-planner", icon: Clock },
    { label: "Daily Task Tracker", path: "/task-tracker", icon: CheckSquare },
    { label: "Internship Assistant", path: "/internship-assistant", icon: Briefcase },
    { label: "GitHub Productivity", path: "/github-assistant", icon: Github },
    { label: "LinkedIn Assistant", path: "/linkedin-assistant", icon: Share2 },
    { label: "Reminder Center", path: "/notifications", icon: Bell },
    { label: "Resume Analysis", path: "/resume-analysis", icon: FileText },
    { label: "Analysis History", path: "/history", icon: History },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-[57px] left-0 z-40 h-[calc(100vh-57px)] bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-16 p-2" : "lg:w-64 p-3"
        } ${
          isOpen ? "translate-x-0 shadow-2xl lg:shadow-none w-64 p-3" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-1 overflow-y-auto overflow-x-hidden flex-1 pr-1">
          {!isCollapsed && (
            <div className="px-3 py-2 text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              AI Platform Navigation
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={isCollapsed ? item.label : ""}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                    isCollapsed ? "justify-center p-2.5" : "px-3 py-2"
                  } ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs border border-blue-100/50 dark:border-blue-800/50 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}

                {/* Tooltip on hover when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg hidden lg:block">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
