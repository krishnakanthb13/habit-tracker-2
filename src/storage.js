// src/storage.js - LocalStorage management, seeding, and export/import

const STORAGE_KEY = 'dailyhabits_pro_data_v1';
const SETTINGS_KEY = 'dailyhabits_settings_v1';

export const DEFAULT_CATEGORIES = [
  { id: 'health', name: 'Health & Body', color: '#10b981', icon: 'heart-pulse' },
  { id: 'focus', name: 'Focus & Work', color: '#6366f1', icon: 'zap' },
  { id: 'mind', name: 'Mind & Peace', color: '#8b5cf6', icon: 'sparkles' },
  { id: 'fitness', name: 'Fitness & Sport', color: '#f43f5e', icon: 'activity' },
  { id: 'learning', name: 'Knowledge', color: '#0284c7', icon: 'book-open' },
  { id: 'creative', name: 'Creative', color: '#f59e0b', icon: 'palette' }
];

export const CATEGORIES = DEFAULT_CATEGORIES;

export const HABIT_COLORS = [
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#0284c7', // Sky Blue
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#14b8a6', // Teal
  '#ec4899', // Pink
  '#84cc16'  // Lime
];

// Helper to format date string YYYY-MM-DD
export function formatDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

// Generate realistic seed data for the current month
function getSeedHabits() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDay = now.getDate();

  const habits = [
    {
      id: 'habit_1',
      title: 'Morning Sunlight & Walk',
      category: 'health',
      color: '#10b981',
      goalDays: 25,
      frequencyType: 'daily', // daily, weekly_target, specific_days, numeric
      frequencyConfig: { daysPerWeek: 7 },
      targetMetric: null,
      archived: false,
      createdAt: new Date(year, month, 1).toISOString(),
      completions: {}, // dateKey: true | { value: 1, note: '' } | 'skipped'
    },
    {
      id: 'habit_2',
      title: 'Deep Work (2 Hours)',
      category: 'focus',
      color: '#6366f1',
      goalDays: 22,
      frequencyType: 'daily',
      frequencyConfig: { daysPerWeek: 5 },
      targetMetric: null,
      archived: false,
      createdAt: new Date(year, month, 1).toISOString(),
      completions: {},
    },
    {
      id: 'habit_3',
      title: 'Read Non-Fiction (20 pgs)',
      category: 'learning',
      color: '#0284c7',
      goalDays: 20,
      frequencyType: 'numeric',
      frequencyConfig: { target: 20, unit: 'pages' },
      targetMetric: { target: 20, unit: 'pages' },
      archived: false,
      createdAt: new Date(year, month, 1).toISOString(),
      completions: {},
    },
    {
      id: 'habit_4',
      title: 'Hydration (2.5L Water)',
      category: 'health',
      color: '#14b8a6',
      goalDays: 28,
      frequencyType: 'numeric',
      frequencyConfig: { target: 2500, unit: 'ml' },
      targetMetric: { target: 2500, unit: 'ml' },
      archived: false,
      createdAt: new Date(year, month, 1).toISOString(),
      completions: {},
    },
    {
      id: 'habit_5',
      title: 'Gym / Strength Training',
      category: 'fitness',
      color: '#f43f5e',
      goalDays: 16,
      frequencyType: 'specific_days',
      frequencyConfig: { daysOfWeek: [1, 3, 5] }, // Mon, Wed, Fri
      targetMetric: null,
      archived: false,
      createdAt: new Date(year, month, 1).toISOString(),
      completions: {},
    },
    {
      id: 'habit_6',
      title: 'Evening Meditation & Gratitude',
      category: 'mind',
      color: '#8b5cf6',
      goalDays: 24,
      frequencyType: 'daily',
      frequencyConfig: { daysPerWeek: 7 },
      targetMetric: null,
      archived: false,
      createdAt: new Date(year, month, 1).toISOString(),
      completions: {},
    }
  ];

  // Populate past days up to today with realistic completion patterns
  for (let d = 1; d <= todayDay; d++) {
    const dKey = formatDateKey(year, month, d);
    const dayOfWeek = new Date(year, month, d).getDay(); // 0 is Sun

    // Habit 1: High completion rate (~85%)
    if (d % 6 !== 0) {
      habits[0].completions[dKey] = true;
    }

    // Habit 2: Weekdays
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && d % 4 !== 0) {
      habits[1].completions[dKey] = true;
    }

    // Habit 3: Numeric reading
    if (d % 3 !== 0) {
      habits[2].completions[dKey] = { value: d % 2 === 0 ? 25 : 20, note: d === todayDay ? 'Great chapter on habits formation!' : '' };
    }

    // Habit 4: Water
    if (d % 5 !== 0) {
      habits[3].completions[dKey] = { value: 2500, note: '' };
    }

    // Habit 5: Mon/Wed/Fri
    if ([1, 3, 5].includes(dayOfWeek) && d % 7 !== 0) {
      habits[4].completions[dKey] = true;
    }

    // Habit 6: Meditation
    if (d % 4 !== 0) {
      habits[5].completions[dKey] = true;
    }
  }

  // Add 1 streak freeze skip day for realistic feel
  if (todayDay > 4) {
    const freezeKey = formatDateKey(year, month, todayDay - 3);
    habits[0].completions[freezeKey] = 'skipped';
  }

  return habits;
}

const SEED_NOTES = [
  {
    id: 'note_1',
    date: formatDateKey(new Date().getFullYear(), new Date().getMonth(), Math.max(1, new Date().getDate() - 1)),
    habitId: 'habit_1',
    text: 'Felt so energized after the 20-minute sunlit walk. Noticeable difference in mental clarity by 10 AM.',
    mood: 'energized'
  },
  {
    id: 'note_2',
    date: formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
    habitId: 'habit_3',
    text: 'Finished Chapter 4 of Atomic Habits. Key takeaway: "You do not rise to the level of your goals. You fall to the level of your systems."',
    mood: 'focused'
  }
];

export function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.habits)) {
        if (!parsed.categories || !Array.isArray(parsed.categories) || parsed.categories.length === 0) {
          if (Array.isArray(parsed.customCategories) && parsed.customCategories.length > 0) {
            parsed.categories = [...DEFAULT_CATEGORIES, ...parsed.customCategories];
          } else {
            parsed.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
          }
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored habit data:', e);
  }

  // First time initialization
  const initialData = {
    habits: getSeedHabits(),
    notes: SEED_NOTES,
    categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
    customCategories: [],
    version: 2
  };
  saveAppData(initialData);
  return initialData;
}

export function saveAppData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save habit data:', e);
  }
}

export function loadSettings() {
  const defaultSettings = {
    theme: 'dark', // 'dark', 'light', 'system', 'midnight', etc.
    soundEnabled: true,
    confettiEnabled: true,
    animationsEnabled: true,
    dayExtensionEnabled: false,
    dayExtensionHour: 3,
    skipPreservesStreak: true,
    firstDayOfWeek: 1, // 1 = Monday, 0 = Sunday
    compactMode: false,
    autoScrollToday: true,
    showCompletedRanks: true,
    activeCategory: 'all'
  };

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return defaultSettings;
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// Effective Date & Night Owl Logic (harvested from v1 day_boundary)
export function getEffectiveDate(timestamp = new Date(), dayExtensionEnabled = false, cutoffHour = 3) {
  const date = new Date(timestamp);
  if (dayExtensionEnabled && date.getHours() < cutoffHour) {
    // Current time is before cutoff (e.g. 1:30 AM before 3:00 AM) - treat as previous calendar day
    date.setDate(date.getDate() - 1);
  }
  return date;
}

export function getEffectiveTodayKey(settings = {}, timestamp = new Date()) {
  const effDate = getEffectiveDate(
    timestamp,
    Boolean(settings.dayExtensionEnabled),
    Number(settings.dayExtensionHour) || 3
  );
  return formatDateKey(effDate.getFullYear(), effDate.getMonth(), effDate.getDate());
}

// Storage Doctor & Self-Repair Diagnostic (harvested from v1 health/db_repair)
export function validateAndRepairStorage() {
  const currentData = loadAppData();
  const issues = [];
  const repairs = [];

  // 1. Check categories
  let categories = currentData.categories;
  if (!Array.isArray(categories) || categories.length === 0) {
    categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
    repairs.push('Restored missing categories with standard defaults.');
  }

  // 2. Validate habits
  const validHabits = [];
  const seenIds = new Set();
  const dateKeyRegex = /^\d{4}-\d{2}-\d{2}$/;

  (currentData.habits || []).forEach((habit, idx) => {
    if (!habit || typeof habit !== 'object') {
      issues.push(`Removed invalid habit record at position ${idx + 1}`);
      return;
    }

    let id = habit.id;
    if (!id || seenIds.has(id)) {
      id = 'habit_' + Date.now() + '_' + idx;
      repairs.push(`Assigned fresh unique ID "${id}" to habit "${habit.title || 'Untitled'}"`);
    }
    seenIds.add(id);

    // Clean completions map
    const cleanCompletions = {};
    if (habit.completions && typeof habit.completions === 'object') {
      Object.entries(habit.completions).forEach(([dateKey, val]) => {
        if (!dateKeyRegex.test(dateKey)) {
          issues.push(`Stripped non-standard date format "${dateKey}" in "${habit.title}"`);
          return;
        }
        if (val === true || val === 'skipped') {
          cleanCompletions[dateKey] = val;
        } else if (typeof val === 'object' && val !== null) {
          const num = Number(val.value);
          cleanCompletions[dateKey] = {
            value: isNaN(num) ? 1 : num,
            note: typeof val.note === 'string' ? val.note.slice(0, 500) : ''
          };
        }
      });
    }

    validHabits.push({
      id,
      title: (typeof habit.title === 'string' && habit.title.trim()) ? habit.title.trim() : 'Routine #' + (idx + 1),
      category: habit.category || 'health',
      color: habit.color || '#10b981',
      goalDays: Number(habit.goalDays) || 20,
      frequencyType: habit.frequencyType || 'daily',
      frequencyConfig: habit.frequencyConfig || { daysPerWeek: 7 },
      targetMetric: habit.targetMetric || null,
      archived: Boolean(habit.archived),
      createdAt: habit.createdAt || new Date().toISOString(),
      completions: cleanCompletions
    });
  });

  // 3. Clean reflections & notes
  const cleanNotes = {};
  if (currentData.notes && typeof currentData.notes === 'object') {
    Object.entries(currentData.notes).forEach(([k, note]) => {
      if (dateKeyRegex.test(k) && typeof note === 'object' && note !== null) {
        cleanNotes[k] = note;
      }
    });
  }

  const repairedData = {
    habits: validHabits,
    notes: cleanNotes,
    categories,
    customCategories: currentData.customCategories || [],
    version: 2
  };

  saveAppData(repairedData);

  return {
    ok: issues.length === 0,
    issuesFound: issues.length,
    issues,
    repairsMade: repairs,
    habitCount: validHabits.length
  };
}

// Export data to JSON string for downloading
export function exportToJSON(data) {
  return JSON.stringify(data, null, 2);
}

// Reset functions
export function clearAllData() {
  const blankData = {
    habits: [],
    notes: [],
    categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
    customCategories: [],
    version: 2
  };
  saveAppData(blankData);
  return blankData;
}

export function resetToDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  const demoData = {
    habits: getSeedHabits(),
    notes: SEED_NOTES,
    categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
    customCategories: [],
    version: 2
  };
  saveAppData(demoData);
  return demoData;
}

// Export current monthly view to CSV
export function exportToCSV(habits, year, month) {
  // Only export active habits for monthly tracking CSV
  const activeHabits = habits.filter(h => !h.archived);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const headers = ['Habit Name', 'Category', 'Goal Days', 'Achieved Days'];
  
  for (let d = 1; d <= daysInMonth; d++) {
    headers.push(`Day ${d}`);
  }

  const rows = [headers.join(',')];

  activeHabits.forEach(habit => {
    let achievedCount = 0;
    const dayCells = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dKey = formatDateKey(year, month, d);
      const val = habit.completions?.[dKey];
      if (val === true) {
        achievedCount++;
        dayCells.push('✓');
      } else if (typeof val === 'object' && val !== null) {
        achievedCount++;
        dayCells.push(`${val.value || '✓'}`);
      } else if (val === 'skipped') {
        dayCells.push('SKIP');
      } else {
        dayCells.push('');
      }
    }

    const row = [
      `"${habit.title.replace(/"/g, '""')}"`,
      `"${habit.category || 'general'}"`,
      habit.goalDays || daysInMonth,
      achievedCount,
      ...dayCells
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

// Export full all-time history across all months to CSV
export function exportAllTimeToCSV(habits) {
  // Collect all unique date keys across all habits
  const dateSet = new Set();
  habits.forEach(h => {
    Object.keys(h.completions || {}).forEach(k => dateSet.add(k));
  });

  const sortedDates = Array.from(dateSet).sort();
  const headers = ['Habit Name', 'Status', 'Category', 'Frequency', 'Total Completions', ...sortedDates];
  const rows = [headers.join(',')];

  habits.forEach(habit => {
    let completionsCount = 0;
    const dayCells = [];

    sortedDates.forEach(dateKey => {
      const val = habit.completions?.[dateKey];
      if (val === true) {
        completionsCount++;
        dayCells.push('✓');
      } else if (typeof val === 'object' && val !== null) {
        completionsCount++;
        dayCells.push(`${val.value || '✓'}`);
      } else if (val === 'skipped') {
        dayCells.push('SKIP');
      } else {
        dayCells.push('');
      }
    });

    const row = [
      `"${habit.title.replace(/"/g, '""')}"`,
      habit.archived ? 'Archived' : 'Active',
      `"${habit.category || 'general'}"`,
      `"${habit.frequencyType || 'daily'}"`,
      completionsCount,
      ...dayCells
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

// Import data with mode: 'replace' | 'merge'
export function importHabitData(currentData, incomingData, mode = 'replace') {
  if (!incomingData || typeof incomingData !== 'object') {
    throw new Error('Invalid backup file: Not a valid JSON object.');
  }

  // Support both direct array of habits or full object { habits, notes }
  let importedHabits = [];
  let importedNotes = [];

  if (Array.isArray(incomingData)) {
    importedHabits = incomingData;
  } else if (Array.isArray(incomingData.habits)) {
    importedHabits = incomingData.habits;
    importedNotes = Array.isArray(incomingData.notes) ? incomingData.notes : [];
  } else {
    throw new Error('Invalid habit data: missing habits list in JSON.');
  }

  // Validate and sanitize habits
  const sanitizedHabits = importedHabits.map((h, i) => ({
    id: h.id || 'habit_' + Date.now() + '_' + i,
    title: String(h.title || 'Untitled Habit'),
    category: h.category || 'health',
    color: h.color || '#10b981',
    goalDays: Number(h.goalDays) || 25,
    frequencyType: h.frequencyType || 'daily',
    frequencyConfig: h.frequencyConfig || {},
    targetMetric: h.targetMetric || null,
    archived: Boolean(h.archived),
    createdAt: h.createdAt || new Date().toISOString(),
    completions: h.completions && typeof h.completions === 'object' ? h.completions : {}
  }));

  const importedCategories = Array.isArray(incomingData.categories) && incomingData.categories.length > 0
    ? incomingData.categories
    : (Array.isArray(incomingData.customCategories) && incomingData.customCategories.length > 0
      ? [...DEFAULT_CATEGORIES, ...incomingData.customCategories]
      : (currentData.categories || JSON.parse(JSON.stringify(DEFAULT_CATEGORIES))));

  if (mode === 'replace') {
    const updated = {
      habits: sanitizedHabits,
      notes: importedNotes,
      categories: importedCategories,
      customCategories: incomingData.customCategories || currentData.customCategories || [],
      version: 2
    };
    saveAppData(updated);
    return updated;
  } else {
    // Merge mode: Add non-duplicate habits or assign fresh IDs
    const existingIds = new Set(currentData.habits.map(h => h.id));
    const mergedHabits = [...currentData.habits];

    sanitizedHabits.forEach(h => {
      let candidateId = h.id;
      if (existingIds.has(candidateId)) {
        candidateId = 'habit_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      }
      existingIds.add(candidateId);
      mergedHabits.push({ ...h, id: candidateId });
    });

    const mergedNotes = [...(currentData.notes || []), ...importedNotes];

    // Merge categories by ID
    const catMap = new Map();
    (currentData.categories || DEFAULT_CATEGORIES).forEach(c => catMap.set(c.id, { ...c }));
    importedCategories.forEach(c => {
      if (!catMap.has(c.id)) {
        catMap.set(c.id, { ...c });
      }
    });

    const updated = {
      habits: mergedHabits,
      notes: mergedNotes,
      categories: Array.from(catMap.values()),
      customCategories: currentData.customCategories || [],
      version: 2
    };
    saveAppData(updated);
    return updated;
  }
}

