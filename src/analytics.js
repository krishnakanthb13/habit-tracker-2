// src/analytics.js - Advanced analytics, streak algorithms, and heatmap calculations

import { formatDateKey, parseDateKey } from './storage.js';

// Calculate current streak & best streak for a habit (with configurable skipPreservesStreak rule)
export function calculateStreak(habit, referenceDate = new Date(), skipPreservesStreak = true) {
  const completions = habit.completions || {};
  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;

  // Build sorted date keys
  const dateKeys = Object.keys(completions).sort();
  if (dateKeys.length === 0) {
    return { currentStreak: 0, bestStreak: 0, totalCompletions: 0 };
  }

  // Count total completions
  let totalCompletions = 0;
  dateKeys.forEach(k => {
    const val = completions[k];
    if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
      totalCompletions++;
    }
  });

  // Calculate Best Streak across full history
  const firstDate = new Date(dateKeys[0]);
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  
  let iterDate = new Date(firstDate);
  while (iterDate <= today) {
    const k = formatDateKey(iterDate.getFullYear(), iterDate.getMonth(), iterDate.getDate());
    const val = completions[k];

    if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
      runningStreak++;
      if (runningStreak > bestStreak) {
        bestStreak = runningStreak;
      }
    } else if (val === 'skipped' && skipPreservesStreak) {
      // Skipped/freeze day preserves streak without incrementing
    } else {
      runningStreak = 0;
    }

    iterDate.setDate(iterDate.getDate() + 1);
  }

  // Calculate Current Streak backwards from today or yesterday
  let checkDate = new Date(today);
  const todayKey = formatDateKey(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
  const todayVal = completions[todayKey];

  // If today is completed (or skipped with protection enabled), start from today.
  // If not yet completed today, start checking from yesterday so we don't prematurely break streak before day ends.
  const isTodayActive = todayVal === true ||
    (typeof todayVal === 'object' && todayVal?.value > 0) ||
    (todayVal === 'skipped' && skipPreservesStreak);

  if (!isTodayActive) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const k = formatDateKey(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
    const val = completions[k];

    if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (val === 'skipped' && skipPreservesStreak) {
      // Freezes streak, continue backwards
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    totalCompletions
  };
}

// Monthly statistics for active month
export function calculateMonthStats(habits, year, month, skipPreservesStreak = true) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const elapsedDays = isCurrentMonth ? today.getDate() : daysInMonth;

  const activeHabits = habits.filter(h => !h.archived);
  let totalTargetDays = 0;
  let totalAchievedDays = 0;
  let totalHabitsCount = activeHabits.length;
  let completedGoalsCount = 0;

  const habitStats = activeHabits.map(habit => {
    let achieved = 0;
    let skipped = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const k = formatDateKey(year, month, d);
      const val = habit.completions?.[k];
      if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
        achieved++;
      } else if (val === 'skipped') {
        skipped++;
      }
    }

    const goal = habit.goalDays || daysInMonth;
    if (achieved >= goal) {
      completedGoalsCount++;
    }

    totalTargetDays += goal;
    totalAchievedDays += achieved;

    const streakData = calculateStreak(habit, isCurrentMonth ? today : new Date(year, month, daysInMonth), skipPreservesStreak);

    return {
      habitId: habit.id,
      title: habit.title,
      color: habit.color,
      category: habit.category,
      goal,
      achieved,
      skipped,
      rate: Math.min(100, Math.round((achieved / (goal || 1)) * 100)),
      isGoalMet: achieved >= goal,
      streak: streakData.currentStreak,
      bestStreak: streakData.bestStreak
    };
  });

  const overallRate = totalTargetDays > 0 ? Math.min(100, Math.round((totalAchievedDays / totalTargetDays) * 100)) : 0;

  return {
    year,
    month,
    daysInMonth,
    elapsedDays,
    totalHabitsCount,
    completedGoalsCount,
    totalAchievedDays,
    totalTargetDays,
    overallRate,
    habitStats
  };
}

// Consistency breakdown by Day of Week (0 = Sun, 1 = Mon ... 6 = Sat)
export function calculateDayOfWeekBreakdown(habits, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
  const dayOpportunities = [0, 0, 0, 0, 0, 0, 0];
  const activeHabits = habits.filter(h => !h.archived);

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dayOfWeek = dateObj.getDay();
    const k = formatDateKey(year, month, d);

    activeHabits.forEach(habit => {
      dayOpportunities[dayOfWeek]++;
      const val = habit.completions?.[k];
      if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
        dayTotals[dayOfWeek]++;
      }
    });
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames.map((name, index) => {
    const opp = dayOpportunities[index] || 1;
    const count = dayTotals[index] || 0;
    const rate = Math.round((count / opp) * 100);
    return { name, count, rate };
  });
}

// Generate 365-day Activity Matrix (GitHub / Heatmap style) with optional habit filtering
export function generateAnnualHeatmap(habits, currentYear = new Date().getFullYear(), filterHabitId = 'all') {
  const heatmap = {}; // 'YYYY-MM-DD' => total completions on that date
  const targetHabits = habits
    .filter(h => !h.archived)
    .filter(h => filterHabitId === 'all' || h.id === filterHabitId);

  targetHabits.forEach(habit => {
    Object.entries(habit.completions || {}).forEach(([dateKey, val]) => {
      if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
        heatmap[dateKey] = (heatmap[dateKey] || 0) + 1;
      }
    });
  });

  return heatmap;
}

// Category Distribution / Effort Breakdown for active month
export function calculateCategoryDistribution(habits, year, month, categories = []) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeHabits = habits.filter(h => !h.archived);
  const catMap = {};

  categories.forEach(c => {
    catMap[c.id] = { id: c.id, name: c.name, color: c.color, count: 0, habitCount: 0 };
  });
  if (!catMap['general']) {
    catMap['general'] = { id: 'general', name: 'General', color: '#64748b', count: 0, habitCount: 0 };
  }

  let totalCompletions = 0;

  activeHabits.forEach(habit => {
    const catId = habit.category || 'general';
    if (!catMap[catId]) {
      catMap[catId] = { id: catId, name: catId, color: habit.color || '#64748b', count: 0, habitCount: 0 };
    }
    catMap[catId].habitCount++;

    for (let d = 1; d <= daysInMonth; d++) {
      const k = formatDateKey(year, month, d);
      const val = habit.completions?.[k];
      if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
        catMap[catId].count++;
        totalCompletions++;
      }
    }
  });

  return Object.values(catMap)
    .filter(c => c.habitCount > 0 || c.count > 0)
    .map(c => ({
      ...c,
      percentage: totalCompletions > 0 ? Math.round((c.count / totalCompletions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
}
