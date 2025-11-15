import React from "react";
import { BookOpen, CheckCircle2, Flame, Target } from "lucide-react";

function SummaryCards({ analytics }) {
  const { summary } = analytics;

  const cards = [
    {
      icon: BookOpen,
      label: "Total Questions",
      value: summary.totalQuestions,
      detail: `${summary.completedQuestions} completed`,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      icon: CheckCircle2,
      label: "Today's Revision",
      value: summary.revisionDueToday,
      detail: `${summary.overdueRevisions} overdue`,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      icon: Flame,
      label: "Streak",
      value: `${summary.currentStreak}d`,
      detail: `Best: ${summary.bestStreak} days`,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      icon: Target,
      label: "Daily Goal",
      value: `${summary.completionPercent}%`,
      detail: "Overall completion",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`${card.bgColor} rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6 backdrop-blur`}
          >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl text-white shadow-lg`}>
                <Icon size={24} />
              </div>
            </div>

            {/* Label */}
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{card.label}</p>

            {/* Value */}
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{card.value}</p>

            {/* Detail */}
            <p className="text-xs text-slate-500 dark:text-slate-400">{card.detail}</p>
          </div>
        );
      })}
    </div>
  );
}

export default SummaryCards;
