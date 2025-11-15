import React from "react";
import { BookMarked } from "lucide-react";

function FlashcardPerformance({ data }) {
  const { reviewed, good, hard, forgot } = data;

  const performanceItems = [
    { label: "Good", percent: good, color: "from-green-400 to-green-600", icon: "✅", description: "Mastered" },
    { label: "Hard", percent: hard, color: "from-yellow-400 to-yellow-600", icon: "⚠️", description: "Challenging" },
    { label: "Forgot", percent: forgot, color: "from-red-400 to-red-600", icon: "❌", description: "Need review" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookMarked size={24} className="text-emerald-600" />
        <div>
          <h2 className="text-xl font-bold">Flashcard Performance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{reviewed} questions reviewed • Performance breakdown</p>
        </div>
      </div>

      {/* Circle Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {performanceItems.map((item, idx) => (
          <div key={idx} className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              {/* Circle Background */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-slate-800" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(item.percent / 100) * 282.6} 282.6`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient
                    id={`gradient-${idx}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={item.color.split(" ")[1]} />
                    <stop offset="100%" stopColor={item.color.split(" ")[3]} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.percent}%</p>
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-3 gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 text-center border border-green-200 dark:border-green-800">
          <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">Mastered</p>
          <p className="text-2xl font-bold text-green-600">{Math.round((good / 100) * reviewed) || 0}</p>
          <p className="text-xs text-green-600 dark:text-green-400">questions</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3 text-center border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1">Hard</p>
          <p className="text-2xl font-bold text-yellow-600">{Math.round((hard / 100) * reviewed) || 0}</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">questions</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 text-center border border-red-200 dark:border-red-800">
          <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Forgot</p>
          <p className="text-2xl font-bold text-red-600">{Math.round((forgot / 100) * reviewed) || 0}</p>
          <p className="text-xs text-red-600 dark:text-red-400">questions</p>
        </div>
      </div>

      {/* Insight */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {reviewed === 0 ? (
            <>🎯 <strong>Get Started:</strong> Start reviewing questions to see your performance breakdown here. 📚</>
          ) : (
            <>
              ✨ <strong>Progress:</strong> You've reviewed {reviewed} questions. {good > 60 ? "Excellent mastery! Keep it up! 🚀" : "Keep reviewing to improve mastery! 💪"}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default FlashcardPerformance;
