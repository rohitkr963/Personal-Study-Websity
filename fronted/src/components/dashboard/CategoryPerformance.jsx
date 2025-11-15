import React from "react";
import { Layers } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryPerformance({ data, avgCompletion }) {
  const categoryNames = {
    all: "All",
    dsa: "DSA",
    react: "React",
    nodejs: "Node.js",
    express: "Express",
    mongodb: "MongoDB",
  };

  const categoryEmojis = {
    all: "📚",
    dsa: "💻",
    react: "⚛️",
    nodejs: "🌳",
    express: "⚙️",
    mongodb: "🗄️",
  };

  const colors = ["#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

  // Calculate percentages for pie
  const totalQuestions = data.reduce((sum, cat) => sum + cat.total, 0);
  const pieData = data
    .filter((cat) => cat.total > 0 && cat.category !== "all")
    .map((cat) => ({
      ...cat,
      percent: Math.round((cat.total / totalQuestions) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);

  // Prepare pie data
  const labels = pieData.map((p) => categoryNames[p.category]);
  const pieCounts = pieData.map((p) => p.total);

  const chartData = {
    labels,
    datasets: [
      {
        data: pieCounts,
        backgroundColor: colors.slice(0, pieData.length),
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Layers size={24} className="text-purple-600" />
        <div>
          <h2 className="text-xl font-bold">Category Performance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Distribution across study sections</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="flex justify-center">
          <div style={{ width: 200, height: 200 }}>
            <Pie data={chartData} />
          </div>
        </div>

        <div className="space-y-3">
          {pieData.map((cat, idx) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                  <span className="text-sm font-medium">
                    {categoryEmojis[cat.category]} {categoryNames[cat.category]}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{cat.percent}%</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{cat.total} questions</span>
                <span>•</span>
                <span>{cat.completed} done</span>
                <span>•</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{cat.completed === cat.total ? "100%" : Math.round((cat.completed / cat.total) * 100) + "%"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
        <p className="text-sm text-purple-700 dark:text-purple-300">
          📊 <strong>Insight:</strong> Your strongest section is {pieData[0]?.category ? `${categoryEmojis[pieData[0]?.category]} ${categoryNames[pieData[0]?.category]}` : "balanced"}. Keep pushing! 💪
        </p>
      </div>
    </div>
  );
}

export default CategoryPerformance;
