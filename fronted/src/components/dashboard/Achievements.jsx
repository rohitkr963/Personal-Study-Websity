import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

function Achievements({ data }) {
  const [confetti, setConfetti] = useState(false);
  const unlockedCount = data.filter((a) => a.unlocked).length;

  // Trigger confetti on new achievement (optional)
  useEffect(() => {
    if (unlockedCount > 0 && unlockedCount % 2 === 0) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
    }
  }, [unlockedCount]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy size={24} className="text-yellow-600" />
          <div>
            <h2 className="text-xl font-bold">Achievements & Badges</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {unlockedCount} unlocked • {data.filter((a) => !a.unlocked).length} to go
            </p>
          </div>
        </div>
        <div className="text-4xl font-bold text-yellow-500">{unlockedCount}</div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
        {data.map((achievement, idx) => (
          <div
            key={idx}
            className={`relative group transition-all duration-300 ${
              achievement.unlocked ? "transform hover:scale-110" : ""
            }`}
          >
            {/* Achievement Card */}
            <div
              className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-400 dark:border-yellow-600 shadow-lg"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 opacity-60"
              }`}
            >
              {/* Icon */}
              <div
                className={`text-5xl mb-3 transition-transform ${
                  achievement.unlocked ? "scale-100" : "scale-75 opacity-50"
                }`}
              >
                {achievement.icon}
              </div>

              {/* Name */}
              <p className="text-xs font-bold text-center text-slate-900 dark:text-white">
                {achievement.name}
              </p>
            </div>

            {/* Unlock Badge */}
            {!achievement.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-slate-700 dark:bg-slate-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  🔒 Locked
                </div>
              </div>
            )}

            {/* Glow on Hover (Unlocked) */}
            {achievement.unlocked && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
            )}
          </div>
        ))}
      </div>

      {/* Achievement Legend */}
      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 p-6 mb-6">
        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-4">🎯 How to Unlock Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">🔥 10-Day Streak</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">Study on 10 consecutive days</p>
          </div>
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">🧠 100 Questions</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">Complete 100 questions total</p>
          </div>
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">🗂️ Category Master</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">Complete all questions in a category</p>
          </div>
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">🥇 Perfect Week</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">Study every day of the week</p>
          </div>
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">📚 1000 Minutes</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">Spend 1000 minutes studying</p>
          </div>
          <div>
            <p className="font-medium text-amber-900 dark:text-amber-100">🔥 30-Day Streak</p>
            <p className="text-xs text-amber-800 dark:text-amber-200">Study for 30 consecutive days</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">Achievement Progress</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {unlockedCount}/{data.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
            style={{ width: `${(unlockedCount / data.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-950/30 rounded-xl border border-yellow-300 dark:border-yellow-700 text-center">
        {unlockedCount === data.length ? (
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            🏆 <strong>Amazing!</strong> You've unlocked all achievements! You're a true learning champion! 🌟
          </p>
        ) : (
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💪 <strong>Keep going!</strong> {data.filter((a) => !a.unlocked).length} achievements waiting for you. The grind never stops! 🚀
          </p>
        )}
      </div>
    </div>
  );
}

export default Achievements;
