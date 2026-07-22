import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Sparkles, ArrowRight, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password criteria checks
  const hasLength = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  const isFormValid =
    name &&
    email &&
    hasLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isFormValid) {
      toast.error("Please ensure all password requirements are satisfied");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Start optimizing your study performance today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="student@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            required
          />

          {/* Real-time Password Criteria Checklist */}
          {password && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-[11px]">
              <p className="font-bold text-slate-700 dark:text-slate-300">Password Requirements:</p>
              <div className="grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-400">
                <div className={`flex items-center gap-1 ${hasLength ? "text-emerald-600 font-bold" : ""}`}>
                  {hasLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} At least 6 chars
                </div>
                <div className={`flex items-center gap-1 ${hasUpper ? "text-emerald-600 font-bold" : ""}`}>
                  {hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} Uppercase letter
                </div>
                <div className={`flex items-center gap-1 ${hasLower ? "text-emerald-600 font-bold" : ""}`}>
                  {hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} Lowercase letter
                </div>
                <div className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 font-bold" : ""}`}>
                  {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} Number (0-9)
                </div>
                <div className={`flex items-center gap-1 ${hasSpecial ? "text-emerald-600 font-bold" : ""}`}>
                  {hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} Special (@$!%*?&)
                </div>
                <div className={`flex items-center gap-1 ${passwordsMatch ? "text-emerald-600 font-bold" : ""}`}>
                  {passwordsMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-red-500" />} Passwords match
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!isFormValid}
            className="w-full shadow-md shadow-blue-500/20"
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
