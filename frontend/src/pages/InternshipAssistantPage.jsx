import React, { useState, useEffect, useMemo } from "react";
import { searchLiveInternshipsApi } from "../api/internshipApi";
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  X,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const InternshipAssistantPage = () => {
  const [query, setQuery] = useState("React Node.js internship india");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("MATCH");
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [topRecommendation, setTopRecommendation] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Fetch live internships on mount & on search submit
  const fetchInternships = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await searchLiveInternshipsApi({ query: searchQuery || query });
      if (res.success) {
        setInternships(res.internships || []);
        setTopRecommendation(res.topRecommendation || null);
      } else {
        toast.error("Unable to fetch internships. Please try again later.");
      }
    } catch (err) {
      console.error("Live internship search error:", err);
      toast.error("Unable to fetch internships. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships("React Node.js internship india");
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchInternships(query);
  };

  // Filtered & Sorted Internship List
  const filteredInternships = useMemo(() => {
    let list = [...internships];

    // Category Filter Chips
    if (activeFilter === "REMOTE") {
      list = list.filter(
        (i) =>
          i.location?.toLowerCase().includes("remote") ||
          i.employmentType?.toLowerCase().includes("remote")
      );
    } else if (activeFilter === "HYBRID") {
      list = list.filter((i) => i.location?.toLowerCase().includes("hybrid"));
    } else if (activeFilter === "ONSITE") {
      list = list.filter(
        (i) =>
          !i.location?.toLowerCase().includes("remote") &&
          !i.location?.toLowerCase().includes("hybrid")
      );
    } else if (activeFilter === "INTERNSHIP") {
      list = list.filter(
        (i) =>
          i.employmentType?.toLowerCase().includes("intern") ||
          i.role?.toLowerCase().includes("intern")
      );
    } else if (activeFilter === "FULLTIME") {
      list = list.filter(
        (i) =>
          i.employmentType?.toLowerCase().includes("full") ||
          i.role?.toLowerCase().includes("full")
      );
    }

    // Sort
    if (sortBy === "MATCH") {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === "NEWEST") {
      list.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
    }

    return list;
  }, [internships, activeFilter, sortBy]);

  // Statistics
  const totalCount = internships.length;
  const highMatches = internships.filter((i) => (i.matchScore || 0) >= 85).length;
  const avgMatchScore =
    totalCount > 0
      ? Math.round(
          internships.reduce((acc, i) => acc + (i.matchScore || 75), 0) / totalCount
        )
      : 88;

  return (
    <div className="min-h-screen bg-[#F6F8FC] p-4 sm:p-6 lg:p-8 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* =====================================================
            TOP HERO SECTION
            ===================================================== */}
        <div className="bg-gradient-to-r from-[#2563EB] via-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase text-blue-100 border border-white/20">
              <Zap className="w-3.5 h-3.5 text-[#14B8A6]" />
              Live RapidAPI + Gemini AI Match Engine
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Live Internship Finder
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-medium">
              Discover AI-recommended internships based on your profile, skills, and target engineering domain.
            </p>

            {/* Large Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search internship by role, skill, or location (e.g. React Node.js India)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 bg-[#14B8A6] hover:bg-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-70"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? "Searching Live..." : "Search Opportunities"}
              </button>
            </form>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-blue-200 font-semibold mr-1">Filter by:</span>
              {[
                { label: "All Opportunities", val: "ALL" },
                { label: "Remote", val: "REMOTE" },
                { label: "Hybrid", val: "HYBRID" },
                { label: "Onsite", val: "ONSITE" },
                { label: "Internships", val: "INTERNSHIP" },
                { label: "Full Time", val: "FULLTIME" },
              ].map((chip) => (
                <button
                  key={chip.val}
                  onClick={() => setActiveFilter(chip.val)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    activeFilter === chip.val
                      ? "bg-white text-[#2563EB] shadow-sm font-bold"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            STATISTICS CARDS
            ===================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Internships</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-[#2563EB] rounded-2xl">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI High Matches</p>
              <h3 className="text-2xl font-extrabold text-[#14B8A6] mt-1">{highMatches}</h3>
            </div>
            <div className="p-3 bg-teal-50 text-[#14B8A6] rounded-2xl">
              <Target className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications Ready</p>
              <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{totalCount}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Match Score</p>
              <h3 className="text-2xl font-extrabold text-amber-500 mt-1">{avgMatchScore}%</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT: LISTINGS & RIGHT PANEL
            ===================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: INTERNSHIP CARDS GRID (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header & Sort Selector */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">
                  Showing {filteredInternships.length} Live Opportunities
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-none"
                >
                  <option value="MATCH">Highest AI Match %</option>
                  <option value="NEWEST">Newest Listings</option>
                </select>
              </div>
            </div>

            {/* Skeleton Loading State */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                        <div className="space-y-2">
                          <div className="w-36 h-4 bg-slate-200 rounded" />
                          <div className="w-24 h-3 bg-slate-200 rounded" />
                        </div>
                      </div>
                      <div className="w-16 h-8 bg-slate-200 rounded-xl" />
                    </div>
                    <div className="w-full h-12 bg-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredInternships.length === 0 ? (
              /* Premium Empty State */
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 space-y-4">
                <div className="w-20 h-20 bg-blue-50 text-[#2563EB] rounded-3xl flex items-center justify-center mx-auto">
                  <Briefcase className="w-10 h-10" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">No internships found</h3>
                  <p className="text-xs text-slate-500">
                    We couldn't find any opportunities matching "{query}" under filter "{activeFilter}". Try refining your keywords or searching for standard terms like "React Node.js".
                  </p>
                </div>
                <button
                  onClick={() => {
                    setQuery("React Node.js internship india");
                    setActiveFilter("ALL");
                    fetchInternships("React Node.js internship india");
                  }}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              /* Internship Cards List */
              <div className="space-y-4">
                {filteredInternships.map((job, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 space-y-4 relative group"
                  >
                    {/* Top Row: Logo, Role, Company, Match Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={job.logo}
                          alt={job.company}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                          }}
                          className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-100 bg-slate-50 shrink-0"
                        />
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                            {job.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1 text-slate-700 font-bold">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              {job.company}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {job.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-teal-600">
                              <DollarSign className="w-3.5 h-3.5" />
                              {job.salary}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI Match % Badge */}
                      <div className="flex sm:flex-col items-center justify-between sm:items-end gap-1">
                        <div className="px-3 py-1 rounded-xl bg-teal-50 text-[#14B8A6] font-extrabold text-xs flex items-center gap-1 border border-teal-100 shadow-sm">
                          <Sparkles className="w-3.5 h-3.5" />
                          {job.matchScore || 90}% AI Match
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {job.postedDate}
                        </span>
                      </div>
                    </div>

                    {/* AI Recommendation Reason Banner */}
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <span className="font-medium">
                        <strong className="text-[#2563EB]">AI Recommendation:</strong> {job.reason}
                      </span>
                    </div>

                    {/* Missing Skills & Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                      {job.missingSkills && job.missingSkills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Missing Skills:
                          </span>
                          {job.missingSkills.slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 font-bold text-[11px] border border-rose-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        {job.employmentType}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedInternship(job)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                        View Details
                      </button>

                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        Apply Now
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =====================================================
              RIGHT COLUMN: AI RECOMMENDATION PANEL (4 cols)
              ===================================================== */}
          <div className="lg:col-span-4 space-y-6">
            {topRecommendation ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6 sticky top-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#14B8A6]" />
                  Top Recommended Internship
                </div>

                {/* Top Card Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {topRecommendation.role}
                      </h4>
                      <p className="text-xs font-bold text-[#2563EB]">
                        {topRecommendation.company}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#14B8A6] font-extrabold text-sm flex items-center justify-center shadow-sm border border-teal-100">
                      {topRecommendation.matchScore}%
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {topRecommendation.reason}
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Resume Readiness</span>
                      <span className="text-[#2563EB]">{topRecommendation.resumeReadiness}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                        style={{ width: `${topRecommendation.resumeReadiness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Interview Readiness</span>
                      <span className="text-[#14B8A6]">{topRecommendation.interviewReadiness}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#14B8A6] h-full rounded-full transition-all duration-500"
                        style={{ width: `${topRecommendation.interviewReadiness}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Estimated Selection Chance */}
                <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between text-xs font-bold text-[#14B8A6]">
                  <span>Selection Probability:</span>
                  <span className="px-2.5 py-1 bg-white rounded-xl shadow-xs">
                    {topRecommendation.estimatedSelectionChance}
                  </span>
                </div>

                {/* Missing Skills */}
                {topRecommendation.missingSkills && topRecommendation.missingSkills.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Key Skill Gaps
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {topRecommendation.missingSkills.map((sk, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Courses */}
                {topRecommendation.suggestedCourses && topRecommendation.suggestedCourses.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Suggested Prep Courses
                    </h5>
                    <div className="space-y-1.5">
                      {topRecommendation.suggestedCourses.map((crs, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between border border-slate-100">
                          <span>{crs}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#2563EB] mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">AI Recommendation Engine Active</h4>
                <p className="text-xs text-slate-500">
                  Search live internships to receive tailored readiness scores and skill gap analyses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          SIDE DRAWER MODAL: VIEW DETAILS
          ===================================================== */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto p-6 sm:p-8 space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedInternship.logo}
                    alt={selectedInternship.company}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                    }}
                    className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-100 bg-slate-50"
                  />
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {selectedInternship.role}
                    </h3>
                    <p className="text-xs font-bold text-[#2563EB]">
                      {selectedInternship.company} • {selectedInternship.location}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedInternship(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* AI Match Summary */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-600">
                    AI Match Rating
                  </span>
                  <h4 className="text-2xl font-extrabold text-[#14B8A6]">
                    {selectedInternship.matchScore}% Match
                  </h4>
                </div>
                <div className="px-3 py-1 bg-white rounded-xl text-xs font-bold text-teal-700 shadow-xs">
                  {selectedInternship.salary}
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Full Internship Description
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedInternship.description}
                </p>
              </div>

              {/* Responsibilities */}
              {selectedInternship.responsibilities && selectedInternship.responsibilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Responsibilities & Qualifications
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedInternship.responsibilities.map((item, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Benefits */}
              {selectedInternship.requirements && selectedInternship.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Key Requirements
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedInternship.requirements.map((req, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full shrink-0 mt-1.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Application Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Posted Date:</span>
                <span className="font-extrabold text-slate-800">{selectedInternship.postedDate}</span>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedInternship(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Drawer
              </button>

              <a
                href={selectedInternship.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipAssistantPage;
