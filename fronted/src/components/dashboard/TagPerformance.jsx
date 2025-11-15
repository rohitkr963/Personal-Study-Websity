import React from "react";
import { Tag } from "lucide-react";

function TagPerformance({ data }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Tag size={24} className="text-pink-600" />
        <div>
          <h2 className="text-xl font-bold">Tag Performance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Top tags by activity and completion rate</p>
        </div>
      </div>

      {/* Tags List */}
      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((tag, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 text-xs font-bold text-pink-600">
                        #{idx + 1}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{tag.tag}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tag.count} questions • {tag.completed} completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-pink-600">{tag.percent}%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">completion</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500"
                  style={{ width: `${tag.percent}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400">No tags yet. Add questions with tags to see performance data here.</p>
          </div>
        )}
      </div>

      {/* Insight */}
      {data.length > 0 && (
        <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl border border-pink-200 dark:border-pink-800">
          <p className="text-sm text-pink-700 dark:text-pink-300">
            🏷️ <strong>Insight:</strong> Your strongest tag is <strong>{data[0]?.tag}</strong> with {data[0]?.percent}% completion. Focus on weaker tags to improve overall! 📖
          </p>
        </div>
      )}
    </div>
  );
}

export default TagPerformance;
