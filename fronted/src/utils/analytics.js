/**
 * Analytics Computation Utility
 * Generates all dashboard data from questions array
 */

export function computeAnalytics(items = []) {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // ============ SUMMARY STATS ============
  const totalQuestions = items.length;
  const completedQuestions = items.filter((it) => it.done).length;
  const pendingQuestions = totalQuestions - completedQuestions;
  const completionPercent = totalQuestions ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  // Revision due today
  const todayStr = new Date().toDateString();
  const revisionDueToday = items.filter((it) => {
    const lastReviewed = it.lastReviewed ? new Date(it.lastReviewed).toDateString() : null;
    return lastReviewed !== todayStr && !it.done;
  }).length;

  // Overdue revisions (not reviewed in 7 days)
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const overdueRevisions = items.filter((it) => {
    if (it.done) return false;
    const lastReviewed = it.lastReviewed ? new Date(it.lastReviewed) : new Date(0);
    return lastReviewed < sevenDaysAgo;
  }).length;

  // Streak calculation
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000).toDateString();
    const studiedToday = items.some((it) => {
      const updatedAt = it.updatedAt ? new Date(it.updatedAt).toDateString() : null;
      return updatedAt === checkDate;
    });

    if (studiedToday) {
      if (i === 0) currentStreak++;
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // ============ WEEKLY ACTIVITY (7 days) ============
  const weeklyActivity = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toDateString();
    const dayName = days[date.getDay()];
    
    const count = items.filter((it) => {
      const createdAt = it.createdAt ? new Date(it.createdAt).toDateString() : null;
      return createdAt === dateStr;
    }).length;

    weeklyActivity.push({
      day: dayName,
      date: dateStr,
      count,
      timestamp: date.getTime(),
    });
  }

  const totalThisWeek = weeklyActivity.reduce((sum, day) => sum + day.count, 0);
  const avgPerDay = weeklyActivity.length ? Math.round(totalThisWeek / weeklyActivity.length) : 0;
  const bestDay = weeklyActivity.reduce((max, day) => (day.count > max.count ? day : max), weeklyActivity[0]);

  // ============ 30-DAY HEATMAP ============
  const heatmapData = [];
  const activeDays = new Set();
  let maxRevisionCount = 0;
  // First pass: collect counts and determine max
  const tempHeat = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toDateString();
    const iso = date.toISOString().slice(0, 10);

    const revisionCount = items.filter((it) => {
      const lastReviewed = it.lastReviewed ? new Date(it.lastReviewed).toDateString() : null;
      return lastReviewed === dateStr;
    }).length;

    if (revisionCount > 0) activeDays.add(dateStr);
    maxRevisionCount = Math.max(maxRevisionCount, revisionCount);

    tempHeat.push({ dateStr, iso, dateObj: date, revisions: revisionCount });
  }

  // Second pass: compute intensity based on maxRevisionCount
  tempHeat.forEach((h) => {
    const intensity = h.revisions === 0 ? 0 : Math.min(4, Math.ceil((h.revisions / (maxRevisionCount || 1)) * 4));
    heatmapData.push({
      date: h.dateStr,
      iso: h.iso,
      dayOfMonth: h.dateObj.getDate(),
      month: h.dateObj.getMonth(),
      year: h.dateObj.getFullYear(),
      revisions: h.revisions,
      intensity,
    });
  });

  // ============ CATEGORY PERFORMANCE ============
  const categories = ["all", "dsa", "react", "nodejs", "express", "mongodb"];
  const categoryPerformance = categories.map((cat) => {
    const inCategory = items.filter((it) => (it.category || "all") === cat);
    const completed = inCategory.filter((it) => it.done).length;
    const total = inCategory.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const avgDifficulty = inCategory.length
      ? (inCategory.reduce((sum, it) => {
          const difficulty = { easy: 1, medium: 2, hard: 3 }[it.difficulty] || 2;
          return sum + difficulty;
        }, 0) / inCategory.length).toFixed(1)
      : 0;

    return {
      category: cat,
      total,
      completed,
      pending: total - completed,
      percent,
      avgDifficulty: parseFloat(avgDifficulty),
    };
  });

  const totalCategoryPercent = categoryPerformance.reduce((sum, cat) => sum + cat.percent * cat.total, 0);
  const avgCategoryCompletion = totalCategoryPercent / totalQuestions || 0;

  // ============ DIFFICULTY ANALYSIS ============
  const difficultyStats = {
    easy: items.filter((it) => it.difficulty === "easy").length,
    medium: items.filter((it) => it.difficulty === "medium").length,
    hard: items.filter((it) => it.difficulty === "hard").length,
  };

  const totalDifficulty = Object.values(difficultyStats).reduce((a, b) => a + b, 0);
  const difficultyPercent = {
    easy: totalDifficulty ? Math.round((difficultyStats.easy / totalDifficulty) * 100) : 0,
    medium: totalDifficulty ? Math.round((difficultyStats.medium / totalDifficulty) * 100) : 0,
    hard: totalDifficulty ? Math.round((difficultyStats.hard / totalDifficulty) * 100) : 0,
  };

  // Completion rates by difficulty
  const easyCompleted = items.filter((it) => it.difficulty === "easy" && it.done).length;
  const mediumCompleted = items.filter((it) => it.difficulty === "medium" && it.done).length;
  const hardCompleted = items.filter((it) => it.difficulty === "hard" && it.done).length;

  const difficultyCompletionRate = {
    easy: difficultyStats.easy ? Math.round((easyCompleted / difficultyStats.easy) * 100) : 0,
    medium: difficultyStats.medium ? Math.round((mediumCompleted / difficultyStats.medium) * 100) : 0,
    hard: difficultyStats.hard ? Math.round((hardCompleted / difficultyStats.hard) * 100) : 0,
  };

  // ============ TIME SPENT ANALYTICS ============
  const timeSpentData = [];
  const timePerDayMap = {};

  items.forEach((it) => {
    if (it.createdAt) {
      const dateStr = new Date(it.createdAt).toDateString();
      timePerDayMap[dateStr] = (timePerDayMap[dateStr] || 0) + 5; // Assume 5 min per question
    }
  });

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toDateString();
    const minutes = timePerDayMap[dateStr] || 0;
    const dayName = days[date.getDay()];

    timeSpentData.push({
      day: dayName,
      date: dateStr,
      minutes,
      hours: (minutes / 60).toFixed(1),
    });
  }

  const totalWeeklyTime = timeSpentData.reduce((sum, day) => sum + day.minutes, 0);
  const longestSession = Math.max(...timeSpentData.map((d) => d.minutes), 0);

  // ============ UPCOMING REVISION FORECAST ============
  const revisionForecast = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toDateString();
    const dayName = days[date.getDay()];

    // Predict revision count based on review schedule
    const dueForRevision = items.filter((it) => {
      if (it.done) return false;
      const lastReviewed = it.lastReviewed ? new Date(it.lastReviewed) : new Date(0);
      const daysToReview = Math.pow(2, (it.reviewLevel || 1) - 1); // Spaced repetition
      const nextReviewDate = new Date(lastReviewed.getTime() + daysToReview * 24 * 60 * 60 * 1000);
      return nextReviewDate.toDateString() === dateStr;
    }).length;

    revisionForecast.push({
      day: dayName,
      date: dateStr,
      count: dueForRevision,
    });
  }

  // ============ TAG PERFORMANCE ============
  const tagMap = {};
  items.forEach((it) => {
    (it.tags || []).forEach((tag) => {
      if (!tagMap[tag]) {
        tagMap[tag] = { tag, count: 0, completed: 0 };
      }
      tagMap[tag].count++;
      if (it.done) tagMap[tag].completed++;
    });
  });

  const tagPerformance = Object.values(tagMap)
    .map((t) => ({
      tag: t.tag,
      count: t.count,
      completed: t.completed,
      percent: t.count ? Math.round((t.completed / t.count) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 tags

  // ============ RECENT ACTIVITY ============
  const recentActivity = [];
  const activityMap = {};

  items.slice(0, 20).forEach((it) => {
    const dateStr = it.updatedAt ? new Date(it.updatedAt).toDateString() : "Unknown";
    if (!activityMap[dateStr]) {
      activityMap[dateStr] = {
        date: dateStr,
        activities: [],
        timestamp: it.updatedAt || 0,
      };
    }

    if (it.done) {
      activityMap[dateStr].activities.push(`Completed: ${it.question.substring(0, 50)}...`);
    } else if (it.lastReviewed && new Date(it.lastReviewed).toDateString() === dateStr) {
      activityMap[dateStr].activities.push(`Reviewed: ${it.question.substring(0, 50)}...`);
    }
  });

  Object.values(activityMap)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .forEach((act) => {
      recentActivity.push(act);
    });

  // ============ FLASHCARD PERFORMANCE ============
  const reviewedQuestions = items.filter((it) => it.lastReviewed && it.reviewLevel > 1);
  const goodQuestions = reviewedQuestions.filter((it) => it.reviewLevel === 3).length;
  const hardQuestions = reviewedQuestions.filter((it) => it.reviewLevel === 2).length;
  const forgotQuestions = reviewedQuestions.filter((it) => it.reviewLevel === 1).length;

  const totalReviewed = goodQuestions + hardQuestions + forgotQuestions;
  const flashcardPerformance = {
    reviewed: totalReviewed,
    good: totalReviewed ? Math.round((goodQuestions / totalReviewed) * 100) : 0,
    hard: totalReviewed ? Math.round((hardQuestions / totalReviewed) * 100) : 0,
    forgot: totalReviewed ? Math.round((forgotQuestions / totalReviewed) * 100) : 0,
  };

  // ============ ACHIEVEMENTS ============
  const achievements = [];

  // 10-day streak
  if (currentStreak >= 10) {
    achievements.push({
      id: "streak-10",
      name: "10-Day Streak",
      icon: "🔥",
      unlocked: true,
    });
  }

  // 100 questions completed
  if (completedQuestions >= 100) {
    achievements.push({
      id: "completed-100",
      name: "100 Questions Completed",
      icon: "🧠",
      unlocked: true,
    });
  }

  // All in a category
  categoryPerformance.forEach((cat) => {
    if (cat.category !== "all" && cat.total > 0 && cat.completed === cat.total) {
      achievements.push({
        id: `category-${cat.category}`,
        name: `All ${cat.category} Questions Done`,
        icon: "🗂",
        unlocked: true,
      });
    }
  });

  // Most productive day
  if (bestDay.count >= 20) {
    achievements.push({
      id: "productive-day",
      name: `Most Productive Day (${bestDay.count} Q's)`,
      icon: "🔥",
      unlocked: true,
    });
  }

  // Perfect revision week
  const revisionsThisWeek = weeklyActivity.filter((day) => day.count > 0).length;
  if (revisionsThisWeek === 7) {
    achievements.push({
      id: "perfect-week",
      name: "Perfect Revision Week",
      icon: "🥇",
      unlocked: true,
    });
  }

  // 1000 study minutes
  if (totalWeeklyTime * 4 >= 1000) {
    achievements.push({
      id: "1000-minutes",
      name: "1000 Study Minutes",
      icon: "📚",
      unlocked: true,
    });
  }

  // Default locked achievements
  const lockedAchievements = [
    { id: "streak-30", name: "30-Day Streak", icon: "🔥", unlocked: currentStreak >= 30 },
    { id: "completed-500", name: "500 Questions Completed", icon: "🧠", unlocked: completedQuestions >= 500 },
  ].filter((a) => !a.unlocked);

  const allAchievements = [...achievements, ...lockedAchievements];

  // ============ RETURN COMPLETE ANALYTICS ============
  return {
    summary: {
      totalQuestions,
      completedQuestions,
      pendingQuestions,
      completionPercent,
      revisionDueToday,
      overdueRevisions,
      currentStreak,
      bestStreak,
    },
    weeklyActivity,
    weeklyStats: {
      total: totalThisWeek,
      avgPerDay,
      bestDay: bestDay.day,
      bestDayCount: bestDay.count,
    },
    heatmap: heatmapData,
    heatmapStats: {
      activeDays: activeDays.size,
      bestStreak,
      maxRevisionCount,
    },
    categoryPerformance,
    avgCategoryCompletion,
    difficultyStats,
    difficultyPercent,
    difficultyCompletionRate,
    timeSpent: timeSpentData,
    timeStats: {
      totalWeeklyMinutes: totalWeeklyTime,
      longestSessionMinutes: longestSession,
      avgPerDay: totalWeeklyTime / 7,
    },
    revisionForecast,
    tagPerformance,
    recentActivity,
    flashcardPerformance,
    achievements: allAchievements,
  };
}
