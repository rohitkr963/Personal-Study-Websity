import React from "react";

function StatsBar({ stats }) {
  const { total, completed, active, todayCompleted, revisionCount } = stats;

  const items = [
    { label: "Total", value: total },
    { label: "Completed", value: completed },
    { label: "Active", value: active },
    { label: "Today", value: todayCompleted },
    { label: "Revision", value: revisionCount },
  ];

  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-slate-100/70 dark:bg-slate-900/70 px-3 py-1">
      {items.map((it) => (
        <div key={it.label} className="flex flex-col items-start">
          <span className="text-[10px] uppercase tracking-wide text-slate-500">
            {it.label}
          </span>
          <span className="text-xs font-semibold">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;
