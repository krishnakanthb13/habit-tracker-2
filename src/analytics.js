// src/analytics.js - Advanced analytics, streak algorithms, and heatmap calculations

import { formatDateKey, parseDateKey } from './storage.js';

// Calculate current streak & best streak for a habit
export function calculateStreak(habit, referenceDate = new Date()) {
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
  // Find min and max date
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
    } else if (val === 'skipped') {
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

  // If today is completed or skipped, start from today.
  // If not yet completed today, start checking from yesterday so we don't prematurely break streak before day ends.
  if (todayVal !== true && !(typeof todayVal === 'object' && todayVal?.value > 0) && todayVal !== 'skipped') {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const k = formatDateKey(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
    const val = completions[k];

    if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (val === 'skipped') {
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
export function calculateMonthStats(habits, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const elapsedDays = isCurrentMonth ? today.getDate() : daysInMonth;

  let totalTargetDays = 0;
  let totalAchievedDays = 0;
  let totalHabitsCount = habits.filter(h => !h.archived).length;
  let completedGoalsCount = 0;

  const habitStats = habits.map(habit => {
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

    const streakData = calculateStreak(habit);

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

// Generate 365-day Activity Matrix (GitHub / Heatmap style)
export function generateAnnualHeatmap(habits, currentYear = new Date().getFullYear()) {
  const heatmap = {}; // 'YYYY-MM-DD' => total completions on that date
  const activeHabits = habits.filter(h => !h.archived);

  activeHabits.forEach(habit => {
    Object.entries(habit.completions || {}).forEach(([dateKey, val]) => {
      if (val === true || (typeof val === 'object' && val !== null && val.value > 0)) {
        heatmap[dateKey] = (heatmap[dateKey] || 0) + 1;
      }
    });
  });

  return heatmap;
}
