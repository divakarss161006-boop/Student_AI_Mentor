import React from "react";

const SkeletonLoader = ({ count = 3, className = "" }) => {
  return (
    <div className={`space-y-4 animate-pulse ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-slate-200/80 dark:bg-slate-800 rounded-2xl h-24 w-full p-4 flex flex-col justify-between"
        >
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded-md w-1/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded-md w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
