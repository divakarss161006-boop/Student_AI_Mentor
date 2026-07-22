import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { mentorChatApi } from "../../api/aiApi";
import {
  Sparkles,
  Send,
  X,
  Minus,
  Maximize2,
  Minimize2,
  User,
  Loader2,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

const FloatingAiTutor = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello ${user?.name || "Student"}! I am your 24/7 Floating AI Tutor. Ask me any study question, code help, or career advice anytime from any page!`,
      resources: [],
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen, isMinimized]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const query = inputQuestion.trim();
    if (!query) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setLoading(true);

    try {
      const studentData = { name: user?.name || "Student" };
      const res = await mentorChatApi(studentData, query);

      if (res.success && res.data) {
        const aiMsg = {
          sender: "ai",
          text: res.data.answer || "I'm here to help with your studies!",
          resources: res.data.recommendedResources || [],
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        toast.error(res.message || "AI Tutor response failed");
      }
    } catch (err) {
      toast.error(err.message || "Failed to connect to AI Tutor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Circular Button (When Closed) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="relative group w-14 h-14 bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Open AI Floating Tutor"
        >
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-25"></span>
          <Sparkles className="w-6 h-6 animate-pulse text-amber-300 relative z-10" />
        </button>
      )}

      {/* Floating Chat Drawer / Window */}
      {isOpen && (
        <div
          className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
            isMaximized
              ? "fixed inset-4 md:inset-10 z-50 max-w-none max-h-none w-auto h-auto"
              : isMinimized
              ? "w-80 h-16"
              : "w-80 sm:w-96 h-[520px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs tracking-tight">AI Floating Tutor</h3>
                <p className="text-[10px] text-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active on all pages
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1 rounded-lg hover:bg-white/10 text-blue-100 transition-colors"
                title={isMinimized ? "Restore" : "Minimize"}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsMaximized((prev) => !prev);
                  setIsMinimized(false);
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-blue-100 transition-colors"
                title={isMaximized ? "Restore Size" : "Maximize"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-blue-100 transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body (Hidden if Minimized) */}
          {!isMinimized && (
            <>
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/50 dark:bg-slate-900/50">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>

                    <div
                      className={`max-w-[80%] rounded-2xl p-3 space-y-2 shadow-xs ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none"
                      }`}
                    >
                      <p className="leading-relaxed font-medium whitespace-pre-wrap">
                        {msg.text}
                      </p>

                      {msg.resources && msg.resources.length > 0 && (
                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-700 text-[10px]">
                          <p className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Resources:
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {msg.resources.map((r, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                    AI Tutor is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSend}
                className="p-2.5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Ask AI Tutor anything..."
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !inputQuestion.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingAiTutor;
