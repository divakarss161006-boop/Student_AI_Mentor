import React, { useState, useRef, useEffect } from "react";
import { mentorChatApi } from "../api/aiApi";
import { useAuth } from "../context/AuthContext";
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const MentorChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello ${user?.name || "Student"}! I am your 24/7 AI Academic Mentor. Ask me any subject question, formula explanation, or study advice.`,
      resources: [],
      nextSteps: [],
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "How can I improve my math calculus scores?",
    "Explain the concept of momentum in Physics.",
    "What are the best revision techniques for board exams?",
    "How to manage study time during exams?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionToSend) => {
    const query = questionToSend || inputQuestion;

    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!questionToSend) setInputQuestion("");
    setLoading(true);

    try {
      const studentData = { name: user?.name || "Student" };
      const res = await mentorChatApi(studentData, query);

      if (res.success && res.data) {
        const aiMsg = {
          sender: "ai",
          text: res.data.answer || "I'm here to help with your studies!",
          resources: res.data.recommendedResources || [],
          nextSteps: res.data.nextSteps || [],
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        toast.error(res.message || "AI Mentor response failed");
      }
    } catch (err) {
      toast.error(err.message || "Failed to communicate with AI Mentor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-amber-500" />
            24/7 AI Mentor Tutor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ask any academic question and get instant step-by-step guidance.
          </p>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Quick Prompts:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-slate-200">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gradient-to-tr from-amber-500 to-amber-600 text-white"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm space-y-3 shadow-xs ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none"
                }`}
              >
                <p className="leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>

                {/* Recommended Resources */}
                {msg.resources && msg.resources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                    <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Recommended Learning Resources:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.resources.map((res, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-800"
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {msg.nextSteps && msg.nextSteps.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Action Steps:
                    </p>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {msg.nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs font-semibold text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                Gemini AI is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask your AI tutor anything..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
            <Button
              type="submit"
              variant="accent"
              disabled={loading || !inputQuestion.trim()}
              icon={Send}
              className="shrink-0"
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MentorChatPage;
