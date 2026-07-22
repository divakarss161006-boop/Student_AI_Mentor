import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import FloatingAiTutor from "../components/common/FloatingAiTutor";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 transition-colors relative">
      <Navbar
        onToggleSidebar={() => {
          // On mobile: toggle drawer open/close. On desktop: toggle collapse/expand.
          if (window.innerWidth < 1024) {
            setSidebarOpen((prev) => !prev);
          } else {
            setIsSidebarCollapsed((prev) => !prev);
          }
        }}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <div className="flex flex-1">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <Footer />
      {/* Floating AI Tutor — Persistent Across All Pages */}
      <FloatingAiTutor />
    </div>
  );
};

export default DashboardLayout;
