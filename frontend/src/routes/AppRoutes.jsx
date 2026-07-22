import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import LmsAnalysisPage from "../pages/LmsAnalysisPage";
import PerformancePage from "../pages/PerformancePage";
import StudyPlannerPage from "../pages/StudyPlannerPage";
import ExamPlannerPage from "../pages/ExamPlannerPage";
import TaskTrackerPage from "../pages/TaskTrackerPage";
import InternshipAssistantPage from "../pages/InternshipAssistantPage";
import GithubAssistantPage from "../pages/GithubAssistantPage";
import LinkedinAssistantPage from "../pages/LinkedinAssistantPage";
import NotificationsPage from "../pages/NotificationsPage";
import ResumeAnalysisPage from "../pages/ResumeAnalysisPage";
import HistoryPage from "../pages/HistoryPage";
import MentorChatPage from "../pages/MentorChatPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lms-analysis" element={<LmsAnalysisPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/study-planner" element={<StudyPlannerPage />} />
          <Route path="/exam-planner" element={<ExamPlannerPage />} />
          <Route path="/task-tracker" element={<TaskTrackerPage />} />
          <Route path="/internship-assistant" element={<InternshipAssistantPage />} />
          <Route path="/github-assistant" element={<GithubAssistantPage />} />
          <Route path="/linkedin-assistant" element={<LinkedinAssistantPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/resume-analysis" element={<ResumeAnalysisPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/mentor-chat" element={<MentorChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
