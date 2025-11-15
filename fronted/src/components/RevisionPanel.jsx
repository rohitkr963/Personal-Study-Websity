import React from "react";

function RevisionPanel({ count, onShowRevision }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
      <div>
        <div className="font-medium flex items-center gap-1">
          <span>Today&apos;s Revision</span>
          <span className="text-sm">🔥</span>
        </div>
        <div className="text-slate-500 mt-0.5">
          {count > 0
            ? `${count} questions due for revision`
            : "No questions due right now. Keep going!"}
        </div>
      </div>
      <button
        type="button"
        onClick={onShowRevision}
        className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-[11px] bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        View
      </button>
    </div>
  );
}

export default RevisionPanel;
