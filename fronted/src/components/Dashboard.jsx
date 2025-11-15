import React, { useMemo } from "react";
import { BarChart3, TrendingUp, Target, Calendar } from "lucide-react";
import { computeAnalytics } from "../utils/analytics.js";
import SummaryCards from "./dashboard/SummaryCards.jsx";
import WeeklyActivityGraph from "./dashboard/WeeklyActivityGraph.jsx";
import RevisionHeatmap from "./dashboard/RevisionHeatmap.jsx";
import CategoryPerformance from "./dashboard/CategoryPerformance.jsx";
import DifficultyAnalysis from "./dashboard/DifficultyAnalysis.jsx";
import TimeSpentAnalytics from "./dashboard/TimeSpentAnalytics.jsx";
import RevisionForecast from "./dashboard/RevisionForecast.jsx";
import TagPerformance from "./dashboard/TagPerformance.jsx";
import RecentActivity from "./dashboard/RecentActivity.jsx";
import FlashcardPerformance from "./dashboard/FlashcardPerformance.jsx";
import Achievements from "./dashboard/Achievements.jsx";

function Dashboard({ items = [] }) {
  const analytics = useMemo(() => computeAnalytics(items), [items]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 px-6 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={32} className="text-indigo-200" />
            <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
          </div>
          <p className="text-indigo-100">Track your progress, analyze your performance, and level up your learning</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 1. Summary Cards */}
        <SummaryCards analytics={analytics} />

        {/* 2. Weekly Activity & Heatmap Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyActivityGraph data={analytics.weeklyActivity} stats={analytics.weeklyStats} />
          <RevisionHeatmap data={analytics.heatmap} stats={analytics.heatmapStats} />
        </div>

        {/* 3. Category & Difficulty Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPerformance data={analytics.categoryPerformance} avgCompletion={analytics.avgCategoryCompletion} />
          <DifficultyAnalysis stats={analytics.difficultyStats} percent={analytics.difficultyPercent} completionRate={analytics.difficultyCompletionRate} />
        </div>

        {/* 4. Time & Forecast Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimeSpentAnalytics data={analytics.timeSpent} stats={analytics.timeStats} />
          <RevisionForecast data={analytics.revisionForecast} />
        </div>

        {/* 5. Tag Performance */}
        <TagPerformance data={analytics.tagPerformance} />

        {/* 6. Flashcard Performance */}
        <FlashcardPerformance data={analytics.flashcardPerformance} />

        {/* 7. Recent Activity */}
        <RecentActivity data={analytics.recentActivity} />

        {/* 8. Achievements */}
        <Achievements data={analytics.achievements} />

        {/* Footer Spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}

export default Dashboard;
