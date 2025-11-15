import React from "react";
import { Activity } from "lucide-react";

function RecentActivity({ data }) {
  const formatDate = (dateStr) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";

    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Activity size={24} className="text-violet-600" />
        <div>
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your recent study activity timeline</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {data.length > 0 ? (
          data.map((entry, idx) => (
            <div key={idx} className="relative">
              {/* Timeline connector */}
              {idx < data.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 to-transparent" />
              )}

              {/* Timeline item */}
              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg flex items-center justify-center text-white text-sm font-bold">
                    {idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-1">
                    {formatDate(entry.date)}
                  </p>
                  <div className="space-y-2">
                    {entry.activities.map((activity, actIdx) => (
                      <p key={actIdx} className="text-sm text-slate-700 dark:text-slate-300">
                        {activity.includes("Completed") && "✅ "}
                        {activity.includes("Reviewed") && "🔥 "}
                        {activity.includes("Added") && "➕ "}
                        {activity}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No recent activity. Start studying to see your activity here!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            👏 Keep up the good work! More activity coming soon...
          </p>
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
