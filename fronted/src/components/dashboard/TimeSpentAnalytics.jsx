import React from "react";
import { Clock } from "lucide-react";

function TimeSpentAnalytics({ data, stats }) {
  const maxMinutes = Math.max(...data.map((d) => d.minutes), 1);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Clock size={24} className="text-cyan-600" />
        <div>
          <h2 className="text-xl font-bold">Time Spent Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Study time per day this week</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Total Week</p>
          <p className="text-2xl font-bold text-cyan-600">{formatTime(stats.totalWeeklyMinutes)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Avg/Day</p>
          <p className="text-2xl font-bold text-blue-600">{formatTime(Math.round(stats.avgPerDay))}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Longest</p>
          <p className="text-2xl font-bold text-purple-600">{formatTime(stats.longestSessionMinutes)}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        {data.map((day, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{day.day}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{formatTime(day.minutes)}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  day.minutes === stats.longestSessionMinutes
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                    : "bg-gradient-to-r from-cyan-400 to-blue-400"
                }`}
                style={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="mt-6 p-4 bg-cyan-50 dark:bg-cyan-950/30 rounded-xl border border-cyan-200 dark:border-cyan-800">
        <p className="text-sm text-cyan-700 dark:text-cyan-300">
          ⏱️ <strong>Insight:</strong> You spent {formatTime(stats.totalWeeklyMinutes)} studying this week. {stats.totalWeeklyMinutes > 300 ? "Great dedication! 🌟" : "Try to invest more time in learning. 💡"}
        </p>
      </div>
    </div>
  );
}

export default TimeSpentAnalytics;
