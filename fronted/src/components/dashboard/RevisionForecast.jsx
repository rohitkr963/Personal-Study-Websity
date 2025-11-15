import React from "react";
import { BarChart3 } from "lucide-react";

function RevisionForecast({ data }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={24} className="text-indigo-600" />
        <div>
          <h2 className="text-xl font-bold">Upcoming Revision Forecast</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Next 7 days of scheduled reviews</p>
        </div>
      </div>

      {/* Area Chart Visualization */}
      <div className="space-y-4 mb-8">
        {data.map((day, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{day.day}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{day.count} questions</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(day.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Daily Insights */}
      <div className="grid grid-cols-2 gap-3">
        {data.slice(0, 4).map((day, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{day.day}</p>
            <p className="text-2xl font-bold text-indigo-600">{day.count}</p>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          📅 <strong>Heads up:</strong> {data.reduce((max, d) => (d.count > max.count ? d : max)).day} looks busy with {data.reduce((max, d) => (d.count > max.count ? d : max)).count} reviews. Prepare ahead! 📚
        </p>
      </div>
    </div>
  );
}

export default RevisionForecast;
