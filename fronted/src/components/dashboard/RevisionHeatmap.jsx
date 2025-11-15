import React from "react";
import { Calendar } from "lucide-react";

function RevisionHeatmap({ data, stats }) {
  const getIntensityColor = (intensity) => {
    const colors = {
      0: "bg-slate-200 dark:bg-slate-800",
      1: "bg-green-100 dark:bg-green-900/30",
      2: "bg-green-300 dark:bg-green-700",
      3: "bg-green-500 dark:bg-green-600",
      4: "bg-green-700 dark:bg-green-500",
    };
    return colors[intensity] || colors[0];
  };

  // Group by weeks
  const weeks = [];
  for (let i = 0; i < 5; i++) {
    weeks.push(data.slice(i * 7, (i + 1) * 7));
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={24} className="text-green-600" />
        <div>
          <h2 className="text-xl font-bold">Revision Heatmap</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last 30 days of activity (GitHub-style)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Active Days</p>
          <p className="text-2xl font-bold text-green-600">{stats.activeDays}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Best Streak</p>
          <p className="text-2xl font-bold text-orange-600">{stats.bestStreak} 🔥</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Max/Day</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.maxRevisionCount}</p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-2">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex gap-1">
            {week.map((day, dayIdx) => (
              <div
                key={`${weekIdx}-${dayIdx}`}
                className={`w-6 h-6 rounded-md transition-all duration-300 hover:scale-125 cursor-pointer group relative ${getIntensityColor(day.intensity)}`}
                title={`${day.dayOfMonth} - ${day.revisions} revisions`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {day.dayOfMonth}: {day.revisions} revisions
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Activity Intensity</p>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-slate-500 dark:text-slate-400">Less</span>
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div key={intensity} className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`} />
            ))}
            <span className="text-xs text-slate-500 dark:text-slate-400">More</span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-700 dark:text-green-300">
          🎯 <strong>Insight:</strong> You've been active {stats.activeDays} days this month. Keep the {stats.bestStreak} day streak going! 🔥
        </p>
      </div>
    </div>
  );
}

export default RevisionHeatmap;
