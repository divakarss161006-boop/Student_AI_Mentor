import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full text-xs p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:outline-none focus:bg-white dark:focus:bg-slate-900 ${
            Icon ? "pl-9" : ""
          } ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
    </div>
  );
};

export default Input;
