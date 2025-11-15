import React from "react";
import { Zap } from "lucide-react";

function DifficultyAnalysis({ stats, percent, completionRate }) {
  const difficulties = [
    { level: "Easy", key: "easy", color: "from-green-400 to-green-600", bgColor: "bg-green-50 dark:bg-green-950", textColor: "text-green-700 dark:text-green-300" },
    { level: "Medium", key: "medium", color: "from-yellow-400 to-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950", textColor: "text-yellow-700 dark:text-yellow-300" },
    { level: "Hard", key: "hard", color: "from-red-400 to-red-600", bgColor: "bg-red-50 dark:bg-red-950", textColor: "text-red-700 dark:text-red-300" },
  ];

  const maxCount = Math.max(stats.easy, stats.medium, stats.hard, 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Zap size={24} className="text-amber-600" />
        <div>
          <h2 className="text-xl font-bold">Difficulty Analysis</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Question distribution by difficulty</p>
        </div>
      </div>

      {/* Difficulty Bars */}
      <div className="space-y-6">
        {difficulties.map((diff) => (
          <div key={diff.key}>
            {/* Label & Count */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{diff.level}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{stats[diff.key]} questions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{percent[diff.key]}%</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">{completionRate[diff.key]}% done</span>
              </div>
            </div>

            {/* Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${diff.color} transition-all duration-500`}
                style={{ width: `${(stats[diff.key] / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        {difficulties.map((diff) => (
          <div
            key={diff.key}
            className={`${diff.bgColor} rounded-lg p-3 text-center border border-slate-200 dark:border-slate-700`}
          >
            <p className={`text-xs font-medium mb-1 ${diff.textColor}`}>{diff.level}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{completionRate[diff.key]}%</p>
            <p className={`text-xs ${diff.textColor}`}>Completion</p>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          🎯 <strong>Insight:</strong> Most of your questions are {percent.easy > percent.medium && percent.easy > percent.hard ? "easy" : percent.medium > percent.hard ? "medium" : "hard"}. {completionRate.hard > completionRate.easy ? "You're crushing hard questions! 🔥" : "Try studying harder questions to improve. 💪"}
        </p>
      </div>
    </div>
  );
}

export default DifficultyAnalysis;
