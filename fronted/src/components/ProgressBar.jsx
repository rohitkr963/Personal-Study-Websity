import React from "react";

function ProgressBar({ percent, total }) {
  const clamped = Math.max(0, Math.min(100, percent || 0));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium">Progress</span>
          <span className="text-slate-500">{clamped}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-sky-600 rounded-full transition-all"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
      <div className="text-right text-[11px] text-slate-500 min-w-[80px]">
        <div>Total</div>
        <div className="font-medium text-slate-800 dark:text-slate-100">
          {total}
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
