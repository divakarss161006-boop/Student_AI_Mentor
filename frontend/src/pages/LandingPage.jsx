import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Zap,
} from "lucide-react";
import Button from "../components/common/Button";

const LandingPage = () => {
  const features = [
    {
      icon: BarChart3,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-600",
      title: "AI Performance Analysis",
      description:
        "Upload your subject marks and get instant diagnostic reports highlighting strengths, weak topics, and custom grade improvement plans.",
    },
    {
      icon: Calendar,
      color: "bg-teal-500",
      lightColor: "bg-teal-50 text-teal-600",
      title: "Smart Study Planner",
      description:
        "Generate automated weekly study schedules tailored to your available hours, exam dates, and priority revision subjects.",
    },
    {
      icon: MessageSquare,
      color: "bg-amber-500",
      lightColor: "bg-amber-50 text-amber-600",
      title: "24/7 AI Mentor Chat",
      description:
        "Get instant, step-by-step academic explanations, problem solving advice, and exam tips from your personal Gemini-powered AI tutor.",
    },
    {
      icon: FileText,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50 text-indigo-600",
      title: "ATS Resume Analyzer",
      description:
        "Analyze your student resume for internships or jobs. Receive ATS compatibility scores and actionable skill gap recommendations.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Powered by Google Gemini 2.5 AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Master Your Studies with your Personal{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              AI Academic Mentor
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Achieve top grades, automate your weekly study schedules, and get 24/7 step-by-step guidance from an intelligent AI mentor tailored to your curriculum.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-blue-500/25">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Log In to Account
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Feature Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Personalized Guidance</h4>
              <p className="text-xs text-slate-500 mt-1">Adapts to your specific grade, weak topics, and learning pace.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex items-start gap-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Real-time Insights</h4>
              <p className="text-xs text-slate-500 mt-1">Instant analysis of subject performance and exam readiness.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex items-start gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Automated Planning</h4>
              <p className="text-xs text-slate-500 mt-1">Saves hours by building structured daily study routines.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold tracking-widest text-blue-600 uppercase">
            Everything You Need
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Supercharge Your Academic Journey
          </h2>
          <p className="text-sm text-slate-500">
            Four powerful AI-driven modules designed to streamline your studies and boost your confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${item.lightColor} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                </div>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 pt-2"
                >
                  Try Module <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-3xl p-8 sm:p-14 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-500/20">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Boost Your Grades Today?</h3>
            <p className="text-sm text-blue-100">
              Join thousands of students who organize their study schedules and get AI mentorship every day.
            </p>
          </div>
          <Link to="/register">
            <Button variant="outline" size="lg" className="bg-white text-blue-700 border-none hover:bg-blue-50 whitespace-nowrap shadow-md">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
