import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function WeeklyActivityGraph({ data, stats }) {
  const labels = data.map((d) => d.day);
  const counts = data.map((d) => d.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Questions",
        data: counts,
        fill: true,
        backgroundColor: "rgba(99,102,241,0.15)",
        borderColor: "rgba(99,102,241,1)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp size={24} className="text-indigo-600" />
            Weekly Activity
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Questions studied this week</p>
        </div>
      </div>

      <div style={{ height: 220 }}>
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
        <div>
          <div className="font-medium">Total</div>
          <div className="text-2xl font-bold text-indigo-600">{stats.total}</div>
        </div>
        <div>
          <div className="font-medium">Avg/Day</div>
          <div className="text-2xl font-bold text-purple-600">{stats.avgPerDay}</div>
        </div>
        <div>
          <div className="font-medium">Best Day</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.bestDay}</div>
          <div className="text-xs">{stats.bestDayCount} questions</div>
        </div>
      </div>
    </div>
  );
}

export default WeeklyActivityGraph;
