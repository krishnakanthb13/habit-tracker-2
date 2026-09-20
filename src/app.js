// src/app.js - Main Application Controller for DailyHabits Pro

import confetti from 'canvas-confetti';
import {
  loadAppData,
  saveAppData,
  loadSettings,
  saveSettings,
  CATEGORIES,
  HABIT_COLORS,
  formatDateKey,
  exportToCSV,
  exportToJSON,
  clearAllData,
  resetToDemoData,
  exportAllTimeToCSV,
  importHabitData
} from './storage.js';
import {
  playCheckSound,
  playUncheckSound,
  playSkipSound,
  playGoalReachedSound
} from './audio.js';
import {
  calculateStreak,
  calculateMonthStats,
  calculateDayOfWeekBreakdown,
  generateAnnualHeatmap
} from './analytics.js';

// Application State
let appData = loadAppData();
let settings = loadSettings();

const todayDate = new Date();
let viewYear = todayDate.getFullYear();
let viewMonth = todayDate.getMonth(); // 0-indexed
let activeView = 'grid'; // 'grid' | 'analytics' | 'journal'

// Pending modal state
let activeCellModalData = null; // { habitId, dateKey, year, month, day }

// DOM Elements
const currentMonthLabel = document.getElementById('currentMonthLabel');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const todayJumpBtn = document.getElementById('todayJumpBtn');

const tabGrid = document.getElementById('tabGrid');
const tabAnalytics = document.getElementById('tabAnalytics');
const tabJournal = document.getElementById('tabJournal');
const tabGuide = document.getElementById('tabGuide');

const viewGrid = document.getElementById('viewGrid');
const viewAnalytics = document.getElementById('viewAnalytics');
const viewJournal = document.getElementById('viewJournal');
const viewGuide = document.getElementById('viewGuide');

const guideNewHabitBtn = document.getElementById('guideNewHabitBtn');
const guideGoToGridBtn = document.getElementById('guideGoToGridBtn');

const categoryChips = document.getElementById('categoryChips');
const headerStatsSummary = document.getElementById('headerStatsSummary');

const habitTableHead = document.getElementById('habitTableHead');
const habitTableBody = document.getElementById('habitTableBody');
const habitTableFoot = document.getElementById('habitTableFoot');
const gridEmptyState = document.getElementById('gridEmptyState');

const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIconOn = document.getElementById('soundIconOn');
const soundIconOff = document.getElementById('soundIconOff');

const themeCycleBtn = document.getElementById('themeCycleBtn');
const themeCycleIcon = document.getElementById('themeCycleIcon');
const themeCycleLabel = document.getElementById('themeCycleLabel');

const dropdownOpenGuideBtn = document.getElementById('dropdownOpenGuideBtn');

const proToolsMenuBtn = document.getElementById('proToolsMenuBtn');
const proToolsDropdown = document.getElementById('proToolsDropdown');

const openDataModalBtn = document.getElementById('openDataModalBtn');
const dropdownOpenDataBtn = document.getElementById('dropdownOpenDataBtn');
const dataModal = document.getElementById('dataModal');
const closeDataModalBtn = document.getElementById('closeDataModalBtn');

const dataExportJsonBtn = document.getElementById('dataExportJsonBtn');
const dataExportMonthCsvBtn = document.getElementById('dataExportMonthCsvBtn');
const dataExportAllCsvBtn = document.getElementById('dataExportAllCsvBtn');
const exportAllCsvDropdownBtn = document.getElementById('exportAllCsvDropdownBtn');

const browseJsonBtn = document.getElementById('browseJsonBtn');
const importDropZone = document.getElementById('importDropZone');
const importFileStatus = document.getElementById('importFileStatus');
const importJsonTextarea = document.getElementById('importJsonTextarea');
const executeImportBtn = document.getElementById('executeImportBtn');

const dangerResetDemoBtn = document.getElementById('dangerResetDemoBtn');
const dangerWipeAllBtn = document.getElementById('dangerWipeAllBtn');
const wipeAllDropdownBtn = document.getElementById('wipeAllDropdownBtn');

const toastContainer = document.getElementById('toastContainer');

const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importJsonBtn = document.getElementById('importJsonBtn');
const jsonFileInput = document.getElementById('jsonFileInput');
const printViewBtn = document.getElementById('printViewBtn');
const shortcutsBtn = document.getElementById('shortcutsBtn');
const resetDemoBtn = document.getElementById('resetDemoBtn');

// Modals
const habitModal = document.getElementById('habitModal');
const openNewHabitBtn = document.getElementById('openNewHabitBtn');
const emptyStateNewBtn = document.getElementById('emptyStateNewBtn');
const closeHabitModalBtn = document.getElementById('closeHabitModalBtn');
const cancelHabitModalBtn = document.getElementById('cancelHabitModalBtn');
const deleteHabitModalBtn = document.getElementById('deleteHabitModalBtn');
const habitForm = document.getElementById('habitForm');
const modalTitle = document.getElementById('modalTitle');
const editHabitId = document.getElementById('editHabitId');
const habitTitleInput = document.getElementById('habitTitleInput');
const habitCategorySelect = document.getElementById('habitCategorySelect');
const colorPickerGrid = document.getElementById('colorPickerGrid');
const habitSelectedColor = document.getElementById('habitSelectedColor');
const habitGoalDaysRange = document.getElementById('habitGoalDaysRange');
const goalDaysDisplay = document.getElementById('goalDaysDisplay');
const specificDaysGroup = document.getElementById('specificDaysGroup');
const numericTargetGroup = document.getElementById('numericTargetGroup');
const numericTargetVal = document.getElementById('numericTargetVal');
const numericUnitVal = document.getElementById('numericUnitVal');

// Cell Detail Modal
const cellDetailModal = document.getElementById('cellDetailModal');
const closeCellDetailModalBtn = document.getElementById('closeCellDetailModalBtn');
const cancelCellDetailBtn = document.getElementById('cancelCellDetailBtn');
const cellDetailForm = document.getElementById('cellDetailForm');
const cellDetailTitle = document.getElementById('cellDetailTitle');
const cellDetailSubtitle = document.getElementById('cellDetailSubtitle');
const cellNumericInputWrap = document.getElementById('cellNumericInputWrap');
const cellNumericLabel = document.getElementById('cellNumericLabel');
const cellNumericValue = document.getElementById('cellNumericValue');
const cellStepMinus = document.getElementById('cellStepMinus');
const cellStepPlus = document.getElementById('cellStepPlus');
const cellNoteInput = document.getElementById('cellNoteInput');
const cellSetFreezeBtn = document.getElementById('cellSetFreezeBtn');
const cellClearBtn = document.getElementById('cellClearBtn');

// Shortcuts Modal
const shortcutsModal = document.getElementById('shortcutsModal');
const closeShortcutsModalBtn = document.getElementById('closeShortcutsModalBtn');

// Confirmation Modal
const confirmModal = document.getElementById('confirmModal');
const confirmIconWrap = document.getElementById('confirmIconWrap');
const confirmIcon = document.getElementById('confirmIcon');
const confirmModalTitle = document.getElementById('confirmModalTitle');
const confirmModalMessage = document.getElementById('confirmModalMessage');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const confirmProceedBtn = document.getElementById('confirmProceedBtn');

// Journal elements
const journalDateInput = document.getElementById('journalDateInput');
const journalHabitSelect = document.getElementById('journalHabitSelect');
const journalTextInput = document.getElementById('journalTextInput');
const saveJournalNoteBtn = document.getElementById('saveJournalNoteBtn');
const notesFeedList = document.getElementById('notesFeedList');
const journalSearchInput = document.getElementById('journalSearchInput');
const moodSelector = document.getElementById('moodSelector');

// Month Names
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Global Toast Notification
export function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'warn' ? '⚠️' : '❌';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// In-App Confirmation Dialog (Promise-based)
export function showConfirmation({
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  icon = '⚠️',
  confirmText = 'Confirm',
  confirmType = 'danger' // 'danger' | 'warn'
}) {
  return new Promise((resolve) => {
    if (!confirmModal) {
      resolve(confirm(`${title}\n\n${message}`));
      return;
    }

    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    confirmIcon.textContent = icon;

    confirmIconWrap.className = 'confirm-icon-wrap ' + (confirmType === 'warn' ? 'warn' : '');
    confirmProceedBtn.textContent = confirmText;
    confirmProceedBtn.className = confirmType === 'warn' ? 'btn-gold-action' : 'btn-danger-action';

    confirmModal.classList.remove('hidden');

    function cleanup(result) {
      confirmModal.classList.add('hidden');
      confirmCancelBtn.removeEventListener('click', onCancel);
      confirmProceedBtn.removeEventListener('click', onProceed);
      document.removeEventListener('keydown', onKey);
      resolve(result);
    }

    function onCancel() {
      cleanup(false);
    }

    function onProceed() {
      cleanup(true);
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        cleanup(false);
      }
    }

    confirmCancelBtn.addEventListener('click', onCancel);
    confirmProceedBtn.addEventListener('click', onProceed);
    document.addEventListener('keydown', onKey);
  });
}

// ==========================================
// INITIALIZATION
// ==========================================
function init() {
  applyTheme(settings.theme);
  updateSoundIcon();
  setupEventListeners();
  populateCategorySelect();
  renderCategoryChips();
  renderColorSwatches();
  updateView();
}

// Cycling Themes List
const THEMES = [
  { id: 'dark', label: 'Midnight', icon: '🌙' },
  { id: 'light', label: 'Paper Light', icon: '☀️' },
  { id: 'forest', label: 'Forest Sage', icon: '🌲' },
  { id: 'ocean', label: 'Nordic Ocean', icon: '🌊' },
  { id: 'sunset', label: 'Sunset Ember', icon: '🌅' }
];

// Update Theme
function applyTheme(themeId) {
  const matched = THEMES.find(t => t.id === themeId) || THEMES[0];
  document.documentElement.setAttribute('data-theme', matched.id);
  if (themeCycleIcon) themeCycleIcon.textContent = matched.icon;
  if (themeCycleLabel) themeCycleLabel.textContent = matched.label;
}

function cycleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const currentIndex = THEMES.findIndex(t => t.id === current);
  const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
  
  settings.theme = nextTheme.id;
  saveSettings(settings);
  applyTheme(nextTheme.id);
  showToast(`Theme: ${nextTheme.label} ${nextTheme.icon}`, 'success');
}

function updateSoundIcon() {
  if (settings.soundEnabled) {
    soundIconOn.classList.remove('hidden');
    soundIconOff.classList.add('hidden');
  } else {
    soundIconOn.classList.add('hidden');
    soundIconOff.classList.remove('hidden');
  }
}

// ==========================================
// NAVIGATION & VIEWS
// ==========================================
function setView(viewName) {
  activeView = viewName;
  [tabGrid, tabAnalytics, tabJournal, tabGuide].forEach(tab => {
    if (!tab) return;
    const isSelected = tab.getAttribute('data-view') === viewName;
    tab.classList.toggle('active', isSelected);
    tab.setAttribute('aria-selected', isSelected);
  });

  [viewGrid, viewAnalytics, viewJournal, viewGuide].forEach(view => {
    if (view) view.classList.remove('active');
  });

  if (viewName === 'grid' && viewGrid) viewGrid.classList.add('active');
  if (viewName === 'analytics' && viewAnalytics) {
    viewAnalytics.classList.add('active');
    renderAnalytics();
  }
  if (viewName === 'journal' && viewJournal) {
    viewJournal.classList.add('active');
    renderJournal();
  }
  if (viewName === 'guide' && viewGuide) {
    viewGuide.classList.add('active');
  }
}

function goToPrevMonth() {
  if (viewMonth === 0) {
    viewMonth = 11;
    viewYear--;
  } else {
    viewMonth--;
  }
  updateView();
}

function goToNextMonth() {
  if (viewMonth === 11) {
    viewMonth = 0;
    viewYear++;
  } else {
    viewMonth++;
  }
  updateView();
}

function jumpToToday() {
  const now = new Date();
  viewYear = now.getFullYear();
  viewMonth = now.getMonth();
  updateView();
}

function updateView() {
  currentMonthLabel.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
  renderHabitGrid();
  renderCategoryChips();
  if (activeView === 'analytics') renderAnalytics();
  if (activeView === 'journal') renderJournal();
}

// ==========================================
// HABIT GRID RENDERING
// ==========================================
function renderHabitGrid() {
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const isCurrentMonth = todayDate.getFullYear() === viewYear && todayDate.getMonth() === viewMonth;
  const currentDay = todayDate.getDate();

  // Filter habits
  const activeHabits = appData.habits.filter(h => {
    if (h.archived) return false;
    if (settings.activeCategory !== 'all' && h.category !== settings.activeCategory) return false;
    return true;
  });

  if (activeHabits.length === 0) {
    gridEmptyState.classList.remove('hidden');
    document.getElementById('gridScrollWrapper').classList.add('hidden');
  } else {
    gridEmptyState.classList.add('hidden');
    document.getElementById('gridScrollWrapper').classList.remove('hidden');
  }

  // 1. Table Header
  let headHtml = `<tr>
    <th class="th-habit-name">Habit (${activeHabits.length})</th>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const dayDate = new Date(viewYear, viewMonth, d);
    const dayOfWeek = dayDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isToday = isCurrentMonth && d === currentDay;

    let colClass = 'th-day-col';
    if (isWeekend) colClass += ' is-weekend';
    if (isToday) colClass += ' is-today';

    headHtml += `
      <th class="${colClass}">
        <div class="th-day-name">${DAY_NAMES_SHORT[dayOfWeek]}</div>
        <div class="th-day-number">${d}</div>
      </th>`;
  }

  headHtml += `
    <th class="th-summary-col">Goal</th>
    <th class="th-summary-col">Achieved</th>
    <th class="th-summary-col">Streak</th>
    <th class="th-summary-col">Rate</th>
    <th class="th-actions-col">Actions</th>
  </tr>`;

  habitTableHead.innerHTML = headHtml;

  // 2. Table Body
  let bodyHtml = '';
  const dailyCompletionsCount = new Array(daysInMonth + 1).fill(0);

  activeHabits.forEach(habit => {
    let achievedDaysCount = 0;
    const streakData = calculateStreak(habit);
    const goal = habit.goalDays || daysInMonth;

    let rowHtml = `<tr class="habit-row" data-habit-id="${habit.id}">
      <td class="td-habit-info">
        <div class="habit-title-container">
          <span class="habit-color-indicator" style="background-color: ${habit.color}"></span>
          <div class="habit-text-wrap">
            <span class="habit-name-label" title="${habit.title}">${habit.title}</span>
            <div class="habit-meta-row">
              <span class="habit-category-tag">${habit.category}</span>
              ${habit.frequencyType === 'numeric' && habit.targetMetric ? 
                `<span class="habit-metric-tag">${habit.targetMetric.target} ${habit.targetMetric.unit}</span>` : ''}
              ${habit.frequencyType === 'specific_days' ? 
                `<span class="habit-metric-tag">Specific days</span>` : ''}
            </div>
          </div>
        </div>
      </td>`;

    // Render cells for each day
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = formatDateKey(viewYear, viewMonth, d);
      const dayDate = new Date(viewYear, viewMonth, d);
      const dayOfWeek = dayDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = isCurrentMonth && d === currentDay;

      let cellClass = 'td-day-cell';
      if (isWeekend) cellClass += ' is-weekend';
      if (isToday) cellClass += ' is-today';

      const completionVal = habit.completions?.[dateKey];
      let btnClasses = ['check-toggle-btn'];
      let btnContent = '';
      let isCompleted = false;

      // Check if day has attached note
      const hasNote = appData.notes?.some(n => n.date === dateKey && (!n.habitId || n.habitId === habit.id)) ||
        (typeof completionVal === 'object' && completionVal?.note);

      if (completionVal === true) {
        btnClasses.push('completed');
        btnContent = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        achievedDaysCount++;
        dailyCompletionsCount[d]++;
        isCompleted = true;
      } else if (typeof completionVal === 'object' && completionVal !== null) {
        btnClasses.push('completed numeric-check');
        btnContent = `${completionVal.value}`;
        achievedDaysCount++;
        dailyCompletionsCount[d]++;
        isCompleted = true;
      } else if (completionVal === 'skipped') {
        btnClasses.push('skipped');
        btnContent = `🛡️`;
      }

      const inlineStyle = isCompleted ? `background-color: ${habit.color}; border-color: ${habit.color};` : '';

      rowHtml += `
        <td class="${cellClass}">
          <button type="button" 
            class="${btnClasses.join(' ')}" 
            style="${inlineStyle}"
            data-habit-id="${habit.id}"
            data-date-key="${dateKey}"
            data-day="${d}"
            title="${isCompleted ? 'Completed' : completionVal === 'skipped' ? 'Streak Frozen' : 'Click to complete'} - ${dateKey}">
            ${btnContent}
            ${hasNote ? '<span class="has-note-dot" title="Note attached"></span>' : ''}
          </button>
        </td>`;
    }

    // Summary Columns
    const isGoalMet = achievedDaysCount >= goal;
    const rate = Math.min(100, Math.round((achievedDaysCount / (goal || 1)) * 100));

    rowHtml += `
      <td class="td-summary text-center">${goal}</td>
      <td class="td-summary text-center">
        <span class="badge-achieved ${isGoalMet ? 'goal-met' : ''}">
          ${isGoalMet ? '✓ ' : ''}${achievedDaysCount} / ${goal}
        </span>
      </td>
      <td class="td-summary text-center">
        <span class="streak-pill">🔥 ${streakData.currentStreak}d</span>
      </td>
      <td class="td-summary">
        <div class="progress-rate-wrap">
          <div class="mini-progress-bar">
            <div class="mini-progress-fill" style="width: ${rate}%; background-color: ${habit.color};"></div>
          </div>
          <span class="mini-progress-text">${rate}%</span>
        </div>
      </td>
      <td class="td-actions">
        <div class="row-actions-group">
          <button class="btn-row-action edit-habit-btn" data-id="${habit.id}" title="Edit habit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn-row-action archive-habit-btn" data-id="${habit.id}" title="Archive habit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
          </button>
          <button class="btn-row-action delete-action delete-habit-btn" data-id="${habit.id}" title="Delete habit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    </tr>`;

    bodyHtml += rowHtml;
  });

  habitTableBody.innerHTML = bodyHtml;

  // 3. Table Footer (Daily Totals)
  let footHtml = `<tr>
    <td class="tfoot-label">Daily Totals</td>`;

  for (let d = 1; d <= daysInMonth; d++) {
    footHtml += `<td class="text-center">${dailyCompletionsCount[d] || 0}</td>`;
  }

  footHtml += `<td colspan="5"></td></tr>`;
  habitTableFoot.innerHTML = footHtml;

  // Update header stats summary
  const monthStats = calculateMonthStats(appData.habits, viewYear, viewMonth);
  headerStatsSummary.textContent = `${activeHabits.length} Habits • ${monthStats.overallRate}% Consistency this month`;
}

// Handle Check Toggle
function handleCheckCellClick(e) {
  const btn = e.target.closest('.check-toggle-btn');
  if (!btn) return;

  const habitId = btn.getAttribute('data-habit-id');
  const dateKey = btn.getAttribute('data-date-key');
  const day = parseInt(btn.getAttribute('data-day'), 10);
  const habit = appData.habits.find(h => h.id === habitId);
  if (!habit) return;

  if (!habit.completions) habit.completions = {};
  const currentVal = habit.completions[dateKey];

  // If numeric habit, open the modal for custom amount
  if (habit.frequencyType === 'numeric') {
    openCellDetailModal(habit, dateKey, day);
    return;
  }

  // Boolean habit toggle
  const prevGoalMet = isHabitGoalMet(habit);

  if (currentVal === true) {
    delete habit.completions[dateKey];
    if (settings.soundEnabled) playUncheckSound();
  } else {
    habit.completions[dateKey] = true;
    if (settings.soundEnabled) playCheckSound();

    // Check if goal was newly achieved!
    const newGoalMet = isHabitGoalMet(habit);
    if (!prevGoalMet && newGoalMet) {
      celebrateGoalAchieved(habit);
    }
  }

  saveAppData(appData);
  renderHabitGrid();
}

function handleCheckCellRightClick(e) {
  const btn = e.target.closest('.check-toggle-btn');
  if (!btn) return;
  e.preventDefault(); // Prevent default browser context menu

  const habitId = btn.getAttribute('data-habit-id');
  const dateKey = btn.getAttribute('data-date-key');
  const habit = appData.habits.find(h => h.id === habitId);
  if (!habit) return;

  if (!habit.completions) habit.completions = {};
  const currentVal = habit.completions[dateKey];

  // Toggle freeze/skip day
  if (currentVal === 'skipped') {
    delete habit.completions[dateKey];
    if (settings.soundEnabled) playUncheckSound();
  } else {
    habit.completions[dateKey] = 'skipped';
    if (settings.soundEnabled) playSkipSound();
  }

  saveAppData(appData);
  renderHabitGrid();
}

function isHabitGoalMet(habit) {
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  let count = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const k = formatDateKey(viewYear, viewMonth, d);
    if (habit.completions?.[k] === true || (typeof habit.completions?.[k] === 'object' && habit.completions?.[k]?.value > 0)) {
      count++;
    }
  }
  return count >= (habit.goalDays || daysInMonth);
}

function celebrateGoalAchieved(habit) {
  if (settings.soundEnabled) playGoalReachedSound();
  if (settings.confettiEnabled) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ==========================================
// CATEGORIES & SWATCHES
// ==========================================
function populateCategorySelect() {
  habitCategorySelect.innerHTML = CATEGORIES.map(cat => `
    <option value="${cat.id}">${cat.name}</option>
  `).join('');
}

function renderCategoryChips() {
  const counts = { all: appData.habits.filter(h => !h.archived).length };
  CATEGORIES.forEach(c => {
    counts[c.id] = appData.habits.filter(h => !h.archived && h.category === c.id).length;
  });

  let chipsHtml = `
    <button class="category-chip ${settings.activeCategory === 'all' ? 'active' : ''}" data-cat="all">
      All Habits (${counts.all})
    </button>
  `;

  CATEGORIES.forEach(cat => {
    if (counts[cat.id] > 0 || settings.activeCategory === cat.id) {
      chipsHtml += `
        <button class="category-chip ${settings.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
          <span class="category-chip-dot" style="background-color: ${cat.color}"></span>
          ${cat.name} (${counts[cat.id] || 0})
        </button>
      `;
    }
  });

  categoryChips.innerHTML = chipsHtml;
}

function renderColorSwatches() {
  colorPickerGrid.innerHTML = HABIT_COLORS.map(color => `
    <button type="button" 
      class="color-swatch-btn ${habitSelectedColor.value === color ? 'selected' : ''}" 
      style="background-color: ${color}" 
      data-color="${color}" 
      aria-label="Color ${color}">
    </button>
  `).join('');
}

// ==========================================
// HABIT MODAL (CREATE / EDIT)
// ==========================================
function openHabitModal(habit = null) {
  habitForm.reset();

  if (habit) {
    modalTitle.textContent = 'Edit Habit';
    editHabitId.value = habit.id;
    habitTitleInput.value = habit.title;
    habitCategorySelect.value = habit.category;
    habitSelectedColor.value = habit.color;
    habitGoalDaysRange.value = habit.goalDays || 25;
    goalDaysDisplay.textContent = `${habit.goalDays || 25} days`;
    deleteHabitModalBtn.classList.remove('hidden');

    // Radio
    const radio = habitForm.querySelector(`input[name="goalType"][value="${habit.frequencyType || 'daily'}"]`);
    if (radio) radio.checked = true;

    if (habit.frequencyType === 'specific_days') {
      specificDaysGroup.classList.remove('hidden');
      const selectedDays = habit.frequencyConfig?.daysOfWeek || [1, 3, 5];
      habitForm.querySelectorAll('input[name="weekDay"]').forEach(cb => {
        cb.checked = selectedDays.includes(parseInt(cb.value, 10));
      });
    } else {
      specificDaysGroup.classList.add('hidden');
    }

    if (habit.frequencyType === 'numeric') {
      numericTargetGroup.classList.remove('hidden');
      numericTargetVal.value = habit.targetMetric?.target || 20;
      numericUnitVal.value = habit.targetMetric?.unit || 'pages';
    } else {
      numericTargetGroup.classList.add('hidden');
    }
  } else {
    modalTitle.textContent = 'Create New Habit';
    editHabitId.value = '';
    habitSelectedColor.value = '#10b981';
    habitGoalDaysRange.value = 25;
    goalDaysDisplay.textContent = '25 days';
    deleteHabitModalBtn.classList.add('hidden');
    specificDaysGroup.classList.add('hidden');
    numericTargetGroup.classList.add('hidden');
  }

  renderColorSwatches();
  habitModal.classList.remove('hidden');
  habitTitleInput.focus();
}

function closeHabitModal() {
  habitModal.classList.add('hidden');
}

function handleHabitFormSubmit(e) {
  e.preventDefault();
  const id = editHabitId.value;
  const title = habitTitleInput.value.trim();
  if (!title) return;

  const category = habitCategorySelect.value;
  const color = habitSelectedColor.value;
  const goalDays = parseInt(habitGoalDaysRange.value, 10);
  const goalType = habitForm.querySelector('input[name="goalType"]:checked').value;

  let frequencyConfig = {};
  let targetMetric = null;

  if (goalType === 'specific_days') {
    const checkedDays = Array.from(habitForm.querySelectorAll('input[name="weekDay"]:checked')).map(cb => parseInt(cb.value, 10));
    frequencyConfig = { daysOfWeek: checkedDays };
  } else if (goalType === 'numeric') {
    const target = parseFloat(numericTargetVal.value) || 1;
    const unit = numericUnitVal.value.trim() || 'units';
    targetMetric = { target, unit };
    frequencyConfig = { target, unit };
  }

  if (id) {
    // Edit existing
    const habit = appData.habits.find(h => h.id === id);
    if (habit) {
      habit.title = title;
      habit.category = category;
      habit.color = color;
      habit.goalDays = goalDays;
      habit.frequencyType = goalType;
      habit.frequencyConfig = frequencyConfig;
      habit.targetMetric = targetMetric;
    }
  } else {
    // New habit
    const newHabit = {
      id: 'habit_' + Date.now(),
      title,
      category,
      color,
      goalDays,
      frequencyType: goalType,
      frequencyConfig,
      targetMetric,
      archived: false,
      createdAt: new Date().toISOString(),
      completions: {}
    };
    appData.habits.push(newHabit);
  }

  saveAppData(appData);
  closeHabitModal();
  updateView();
}

// ==========================================
// CELL DETAIL MODAL (NUMERIC & NOTES)
// ==========================================
function openCellDetailModal(habit, dateKey, day) {
  activeCellModalData = { habitId: habit.id, dateKey, day };

  cellDetailTitle.textContent = habit.title;
  cellDetailSubtitle.textContent = `${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}`;

  const completionVal = habit.completions?.[dateKey];

  if (habit.frequencyType === 'numeric') {
    cellNumericInputWrap.classList.remove('hidden');
    cellNumericLabel.textContent = `Amount (${habit.targetMetric?.unit || 'units'})`;
    cellNumericValue.value = typeof completionVal === 'object' && completionVal !== null ? completionVal.value : (habit.targetMetric?.target || 0);
  } else {
    cellNumericInputWrap.classList.add('hidden');
  }

  const existingNote = appData.notes?.find(n => n.date === dateKey && n.habitId === habit.id);
  cellNoteInput.value = existingNote?.text || (typeof completionVal === 'object' && completionVal?.note) || '';

  cellDetailModal.classList.remove('hidden');
}

function closeCellDetailModal() {
  cellDetailModal.classList.add('hidden');
  activeCellModalData = null;
}

function handleCellDetailSubmit(e) {
  e.preventDefault();
  if (!activeCellModalData) return;

  const { habitId, dateKey } = activeCellModalData;
  const habit = appData.habits.find(h => h.id === habitId);
  if (!habit) return;

  if (!habit.completions) habit.completions = {};

  const noteText = cellNoteInput.value.trim();

  if (habit.frequencyType === 'numeric') {
    const val = parseFloat(cellNumericValue.value) || 0;
    if (val > 0) {
      habit.completions[dateKey] = { value: val, note: noteText };
      if (settings.soundEnabled) playCheckSound();
    } else {
      delete habit.completions[dateKey];
    }
  }

  // Update notes store
  if (noteText) {
    let note = appData.notes?.find(n => n.date === dateKey && n.habitId === habitId);
    if (note) {
      note.text = noteText;
    } else {
      if (!appData.notes) appData.notes = [];
      appData.notes.unshift({
        id: 'note_' + Date.now(),
        date: dateKey,
        habitId,
        text: noteText,
        mood: 'focused'
      });
    }
  }

  saveAppData(appData);
  closeCellDetailModal();
  renderHabitGrid();
}

// ==========================================
// ANALYTICS VIEW
// ==========================================
function renderAnalytics() {
  const stats = calculateMonthStats(appData.habits, viewYear, viewMonth);

  document.getElementById('kpiRate').textContent = `${stats.overallRate}%`;
  document.getElementById('kpiRateSub').textContent = `${stats.totalAchievedDays} of ${stats.totalTargetDays} target days achieved`;
  document.getElementById('kpiGoals').textContent = `${stats.completedGoalsCount} / ${stats.totalHabitsCount}`;

  // Find longest active streak
  let maxStreak = 0;
  let maxStreakHabit = 'None yet';
  let totalLifetimeCompletions = 0;

  appData.habits.forEach(h => {
    const s = calculateStreak(h);
    totalLifetimeCompletions += s.totalCompletions;
    if (s.currentStreak > maxStreak) {
      maxStreak = s.currentStreak;
      maxStreakHabit = h.title;
    }
  });

  document.getElementById('kpiStreak').textContent = `${maxStreak} Days`;
  document.getElementById('kpiStreakHabit').textContent = maxStreak > 0 ? maxStreakHabit : 'Start a streak today!';
  document.getElementById('kpiTotalCheckins').textContent = totalLifetimeCompletions.toLocaleString();

  // 1. Annual Heatmap
  renderAnnualHeatmap();

  // 2. Day of Week Breakdown
  renderDayOfWeekChart();

  // 3. Habit Leaderboard
  renderLeaderboard();
}

function renderAnnualHeatmap() {
  const container = document.getElementById('annualHeatmapContainer');
  const heatmapData = generateAnnualHeatmap(appData.habits, viewYear);

  let gridHtml = '<div class="heatmap-grid-canvas">';
  const startDate = new Date(viewYear, 0, 1);
  const endDate = new Date(viewYear, 11, 31);

  let iter = new Date(startDate);
  while (iter <= endDate) {
    const k = formatDateKey(iter.getFullYear(), iter.getMonth(), iter.getDate());
    const count = heatmapData[k] || 0;

    let lvl = 'lvl-0';
    if (count >= 5) lvl = 'lvl-4';
    else if (count >= 3) lvl = 'lvl-3';
    else if (count >= 2) lvl = 'lvl-2';
    else if (count >= 1) lvl = 'lvl-1';

    gridHtml += `<div class="heatmap-square ${lvl}" title="${k}: ${count} habits completed"></div>`;
    iter.setDate(iter.getDate() + 1);
  }
  gridHtml += '</div>';

  container.innerHTML = gridHtml;
}

function renderDayOfWeekChart() {
  const container = document.getElementById('dowBarsContainer');
  const breakdown = calculateDayOfWeekBreakdown(appData.habits, viewYear, viewMonth);

  container.innerHTML = breakdown.map(d => `
    <div class="dow-bar-row">
      <span class="dow-bar-label">${d.name}</span>
      <div class="dow-bar-track">
        <div class="dow-bar-fill" style="width: ${d.rate}%"></div>
      </div>
      <span class="dow-bar-val">${d.rate}%</span>
    </div>
  `).join('');
}

function renderLeaderboard() {
  const container = document.getElementById('leaderboardList');
  const sorted = [...appData.habits]
    .filter(h => !h.archived)
    .map(h => ({
      habit: h,
      streak: calculateStreak(h)
    }))
    .sort((a, b) => b.streak.currentStreak - a.streak.currentStreak);

  container.innerHTML = sorted.map((item, idx) => `
    <div class="leaderboard-item">
      <div class="leaderboard-left">
        <span class="leaderboard-rank">#${idx + 1}</span>
        <span class="habit-color-indicator" style="background-color: ${item.habit.color}"></span>
        <span class="leaderboard-title">${item.habit.title}</span>
      </div>
      <div class="leaderboard-right">
        <span class="streak-tag">🔥 ${item.streak.currentStreak}d (Best: ${item.streak.bestStreak}d)</span>
        <span class="badge-achieved">${item.streak.totalCompletions} check-ins</span>
      </div>
    </div>
  `).join('');
}

// ==========================================
// JOURNAL VIEW
// ==========================================
function renderJournal() {
  // Populate habits select
  journalHabitSelect.innerHTML = `<option value="">General Daily Note</option>` +
    appData.habits.filter(h => !h.archived).map(h => `<option value="${h.id}">${h.title}</option>`).join('');

  // Default to today
  if (!journalDateInput.value) {
    journalDateInput.value = formatDateKey(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  }

  renderNotesFeed();
}

function renderNotesFeed() {
  const search = journalSearchInput.value.toLowerCase().trim();
  let notes = [...(appData.notes || [])];

  if (search) {
    notes = notes.filter(n => n.text.toLowerCase().includes(search));
  }

  // Sort descending by date
  notes.sort((a, b) => b.date.localeCompare(a.date));

  if (notes.length === 0) {
    notesFeedList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No reflections found</h3>
        <p>Use daily notes to journal your progress, energy, and milestones.</p>
      </div>`;
    return;
  }

  notesFeedList.innerHTML = notes.map(note => {
    const habit = note.habitId ? appData.habits.find(h => h.id === note.habitId) : null;
    return `
      <div class="note-feed-card">
        <div class="note-feed-top">
          <span class="note-feed-date">${note.date}</span>
          <div class="note-feed-badges">
            ${habit ? `<span class="note-habit-badge" style="background-color: ${habit.color}22; color: ${habit.color}">${habit.title}</span>` : ''}
            <span class="note-habit-badge" style="background-color: var(--bg-surface-hover);">${note.mood || '🌿 Peaceful'}</span>
            <button class="btn-row-action delete-note-btn" data-id="${note.id}" title="Delete note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
        <p class="note-feed-text">${escapeHtml(note.text)}</p>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function handleSaveJournalNote() {
  const text = journalTextInput.value.trim();
  if (!text) return;

  const date = journalDateInput.value || formatDateKey(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  const habitId = journalHabitSelect.value || null;
  const moodBtn = moodSelector.querySelector('.mood-btn.active');
  const mood = moodBtn ? moodBtn.textContent.trim() : '⚡ Energized';

  if (!appData.notes) appData.notes = [];

  appData.notes.unshift({
    id: 'note_' + Date.now(),
    date,
    habitId,
    text,
    mood
  });

  saveAppData(appData);
  journalTextInput.value = '';
  renderNotesFeed();
  renderHabitGrid(); // to update note indicators
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Navigation
  prevMonthBtn.addEventListener('click', goToPrevMonth);
  nextMonthBtn.addEventListener('click', goToNextMonth);
  todayJumpBtn.addEventListener('click', jumpToToday);

  // Tabs
  tabGrid.addEventListener('click', () => setView('grid'));
  tabAnalytics.addEventListener('click', () => setView('analytics'));
  tabJournal.addEventListener('click', () => setView('journal'));
  if (tabGuide) tabGuide.addEventListener('click', () => setView('guide'));

  if (guideNewHabitBtn) guideNewHabitBtn.addEventListener('click', () => openHabitModal(null));
  if (guideGoToGridBtn) guideGoToGridBtn.addEventListener('click', () => setView('grid'));
  if (dropdownOpenGuideBtn) {
    dropdownOpenGuideBtn.addEventListener('click', () => {
      setView('guide');
      proToolsDropdown.classList.add('hidden');
    });
  }

  // Habit Grid interactive delegation
  habitTableBody.addEventListener('click', (e) => {
    // Check cell toggle
    if (e.target.closest('.check-toggle-btn')) {
      handleCheckCellClick(e);
      return;
    }

    // Edit button
    const editBtn = e.target.closest('.edit-habit-btn');
    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      const habit = appData.habits.find(h => h.id === id);
      if (habit) openHabitModal(habit);
      return;
    }

    // Archive button
    const archiveBtn = e.target.closest('.archive-habit-btn');
    if (archiveBtn) {
      const id = archiveBtn.getAttribute('data-id');
      const habit = appData.habits.find(h => h.id === id);
      if (habit) {
        showConfirmation({
          title: `Archive "${habit.title}"?`,
          message: 'This habit will be hidden from the active monthly tracking grid. Historical check-ins remain preserved in backups and lifetime analytics.',
          icon: '📦',
          confirmText: 'Archive Habit',
          confirmType: 'warn'
        }).then(confirmed => {
          if (confirmed) {
            habit.archived = true;
            saveAppData(appData);
            showToast(`Archived "${habit.title}"`, 'warn');
            updateView();
          }
        });
      }
      return;
    }

    // Delete button
    const deleteBtn = e.target.closest('.delete-habit-btn');
    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      const habit = appData.habits.find(h => h.id === id);
      if (habit) {
        showConfirmation({
          title: `Delete "${habit.title}"?`,
          message: 'This will permanently delete this habit and all its recorded check-in history across all months.\n\nThis action cannot be undone.',
          icon: '🗑️',
          confirmText: 'Delete Habit',
          confirmType: 'danger'
        }).then(confirmed => {
          if (confirmed) {
            appData.habits = appData.habits.filter(h => h.id !== id);
            saveAppData(appData);
            showToast(`Deleted habit "${habit.title}"`, 'warn');
            updateView();
          }
        });
      }
      return;
    }
  });

  // Right-click to set streak freeze
  habitTableBody.addEventListener('contextmenu', handleCheckCellRightClick);

  // Category filter chips
  categoryChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.category-chip');
    if (!chip) return;
    settings.activeCategory = chip.getAttribute('data-cat');
    saveSettings(settings);
    renderHabitGrid();
    renderCategoryChips();
  });

  // Theme Cycling & Sound
  if (themeCycleBtn) themeCycleBtn.addEventListener('click', cycleTheme);
  soundToggleBtn.addEventListener('click', () => {
    settings.soundEnabled = !settings.soundEnabled;
    saveSettings(settings);
    updateSoundIcon();
  });

  // Pro Tools Dropdown
  proToolsMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    proToolsDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    proToolsDropdown.classList.add('hidden');
  });

  // Brand logo & Month label click handlers (prevents deadclicks)
  const brandEl = document.querySelector('.brand');
  if (brandEl) {
    brandEl.style.cursor = 'pointer';
    brandEl.title = 'DailyHabits Pro - Click to return to Habit Grid';
    brandEl.addEventListener('click', () => {
      setView('grid');
      jumpToToday();
    });
  }

  const monthWrap = document.getElementById('monthDisplayWrap');
  if (monthWrap) {
    monthWrap.style.cursor = 'pointer';
    monthWrap.title = 'Click to jump to Today';
    monthWrap.addEventListener('click', jumpToToday);
  }

  // Data Modal Tabs & Controls
  function openDataModal(tab = 'export') {
    dataModal.classList.remove('hidden');
    switchDataTab(tab);
    proToolsDropdown.classList.add('hidden');
  }

  function closeDataModal() {
    dataModal.classList.add('hidden');
  }

  function switchDataTab(tabName) {
    dataModal.querySelectorAll('.data-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    document.getElementById('dataTabExport').classList.toggle('active', tabName === 'export');
    document.getElementById('dataTabImport').classList.toggle('active', tabName === 'import');
    document.getElementById('dataTabReset').classList.toggle('active', tabName === 'reset');
  }

  openDataModalBtn.addEventListener('click', () => openDataModal('export'));
  dropdownOpenDataBtn.addEventListener('click', () => openDataModal('export'));
  closeDataModalBtn.addEventListener('click', closeDataModal);

  dataModal.querySelectorAll('.data-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchDataTab(btn.getAttribute('data-tab'));
    });
  });

  // Export handlers
  function triggerJsonExport() {
    proToolsDropdown.classList.add('hidden');
    const json = exportToJSON(appData);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadFile(json, `DailyHabits_Backup_${dateStr}.json`, 'application/json');
    showToast(`Backup exported (${appData.habits.length} habits saved)!`, 'success');
  }

  function triggerMonthCsvExport() {
    proToolsDropdown.classList.add('hidden');
    const csv = exportToCSV(appData.habits, viewYear, viewMonth);
    downloadFile(csv, `DailyHabits_${MONTH_NAMES[viewMonth]}_${viewYear}.csv`, 'text/csv');
    showToast(`Monthly CSV exported for ${MONTH_NAMES[viewMonth]} ${viewYear}!`, 'success');
  }

  function triggerLifetimeCsvExport() {
    proToolsDropdown.classList.add('hidden');
    const csv = exportAllTimeToCSV(appData.habits);
    downloadFile(csv, `DailyHabits_Lifetime_History_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
    showToast('Lifetime tracking history CSV exported!', 'success');
  }

  dataExportJsonBtn.addEventListener('click', triggerJsonExport);
  exportJsonBtn.addEventListener('click', triggerJsonExport);

  dataExportMonthCsvBtn.addEventListener('click', triggerMonthCsvExport);
  exportCsvBtn.addEventListener('click', triggerMonthCsvExport);

  dataExportAllCsvBtn.addEventListener('click', triggerLifetimeCsvExport);
  exportAllCsvDropdownBtn.addEventListener('click', triggerLifetimeCsvExport);

  // Import Drag & Drop + File Selection
  browseJsonBtn.addEventListener('click', () => jsonFileInput.click());
  importJsonBtn.addEventListener('click', () => {
    openDataModal('import');
  });

  importDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    importDropZone.classList.add('dragover');
  });

  importDropZone.addEventListener('dragleave', () => {
    importDropZone.classList.remove('dragover');
  });

  importDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    importDropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleBackupFile(e.dataTransfer.files[0]);
    }
  });

  jsonFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleBackupFile(e.target.files[0]);
    }
    jsonFileInput.value = '';
  });

  function handleBackupFile(file) {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      showToast('Please select a valid .json file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      importJsonTextarea.value = event.target.result;
      importFileStatus.textContent = `Loaded: ${file.name} (${Math.round(file.size / 1024)} KB)`;
      importFileStatus.classList.remove('hidden');
      showToast(`File loaded. Choose strategy and click 'Apply Import'.`, 'warn');
    };
    reader.readAsText(file);
  }

  // Execute Import
  executeImportBtn.addEventListener('click', async () => {
    const rawText = importJsonTextarea.value.trim();
    if (!rawText) {
      showToast('Please upload a file or paste JSON code to import.', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(rawText);
      const mode = dataModal.querySelector('input[name="importModeChoice"]:checked')?.value || 'replace';
      
      if (mode === 'replace' && appData.habits.length > 0) {
        const confirmed = await showConfirmation({
          title: 'Overwrite All Existing Habits?',
          message: `You currently have ${appData.habits.length} habits. Importing this backup in "Replace All" mode will permanently overwrite them.\n\nDo you want to proceed?`,
          icon: '⚠️',
          confirmText: 'Overwrite All Data',
          confirmType: 'danger'
        });
        if (!confirmed) return;
      }

      appData = importHabitData(appData, parsed, mode);
      saveAppData(appData);
      showToast(`Successfully imported ${appData.habits.length} habits!`, 'success');
      importJsonTextarea.value = '';
      importFileStatus.classList.add('hidden');
      closeDataModal();
      updateView();
    } catch (err) {
      showToast('Import failed: ' + err.message, 'error');
    }
  });

  // Reset Handlers
  async function handleResetToDemo() {
    proToolsDropdown.classList.add('hidden');
    const confirmed = await showConfirmation({
      title: 'Reset to Starter Routines?',
      message: 'This will replace your current habits with fresh demo habits (Sunlight walk, Deep work, Reading, Water, Gym, Meditation).\n\nDo you want to proceed?',
      icon: '🌱',
      confirmText: 'Reset Habits',
      confirmType: 'warn'
    });
    if (!confirmed) return;

    appData = resetToDemoData();
    showToast('Habits reset to starter demo routines.', 'warn');
    closeDataModal();
    updateView();
  }

  async function handleWipeAllData() {
    proToolsDropdown.classList.add('hidden');
    const confirmed = await showConfirmation({
      title: 'Wipe All Tracking Data?',
      message: 'This will permanently erase ALL habits, check-in history, streaks, and daily reflections.\n\nYou will start with a 100% blank canvas (0 habits).\n\nThis cannot be undone!',
      icon: '🗑️',
      confirmText: 'Yes, Wipe Everything',
      confirmType: 'danger'
    });
    if (!confirmed) return;

    appData = clearAllData();
    showToast('All tracking data permanently cleared.', 'error');
    closeDataModal();
    updateView();
  }

  dangerResetDemoBtn.addEventListener('click', handleResetToDemo);
  resetDemoBtn.addEventListener('click', handleResetToDemo);

  dangerWipeAllBtn.addEventListener('click', handleWipeAllData);
  wipeAllDropdownBtn.addEventListener('click', handleWipeAllData);

  printViewBtn.addEventListener('click', () => {
    proToolsDropdown.classList.add('hidden');
    window.print();
  });

  shortcutsBtn.addEventListener('click', () => {
    proToolsDropdown.classList.add('hidden');
    shortcutsModal.classList.remove('hidden');
  });

  closeShortcutsModalBtn.addEventListener('click', () => {
    shortcutsModal.classList.add('hidden');
  });

  // Habit Modal actions
  openNewHabitBtn.addEventListener('click', () => openHabitModal(null));
  emptyStateNewBtn.addEventListener('click', () => openHabitModal(null));
  closeHabitModalBtn.addEventListener('click', closeHabitModal);
  cancelHabitModalBtn.addEventListener('click', closeHabitModal);
  habitForm.addEventListener('submit', handleHabitFormSubmit);

  deleteHabitModalBtn.addEventListener('click', async () => {
    const id = editHabitId.value;
    const habit = appData.habits.find(h => h.id === id);
    if (!habit) return;

    const confirmed = await showConfirmation({
      title: `Delete "${habit.title}"?`,
      message: 'This will permanently delete this habit and all its logged days across all months.\n\nThis action cannot be undone.',
      icon: '🗑️',
      confirmText: 'Delete Habit',
      confirmType: 'danger'
    });
    if (!confirmed) return;

    appData.habits = appData.habits.filter(h => h.id !== id);
    saveAppData(appData);
    closeHabitModal();
    showToast(`Deleted habit "${habit.title}"`, 'warn');
    updateView();
  });

  // Color Swatches
  colorPickerGrid.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch-btn');
    if (!swatch) return;
    habitSelectedColor.value = swatch.getAttribute('data-color');
    renderColorSwatches();
  });

  // Goal Days Range Slider
  habitGoalDaysRange.addEventListener('input', () => {
    goalDaysDisplay.textContent = `${habitGoalDaysRange.value} days`;
  });

  // Goal Type Radios
  habitForm.querySelectorAll('input[name="goalType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      specificDaysGroup.classList.toggle('hidden', radio.value !== 'specific_days');
      numericTargetGroup.classList.toggle('hidden', radio.value !== 'numeric');
    });
  });

  // Cell Detail Modal actions
  closeCellDetailModalBtn.addEventListener('click', closeCellDetailModal);
  cancelCellDetailBtn.addEventListener('click', closeCellDetailModal);
  cellDetailForm.addEventListener('submit', handleCellDetailSubmit);

  cellStepMinus.addEventListener('click', () => {
    const val = parseFloat(cellNumericValue.value) || 0;
    cellNumericValue.value = Math.max(0, val - 1);
  });

  cellStepPlus.addEventListener('click', () => {
    const val = parseFloat(cellNumericValue.value) || 0;
    cellNumericValue.value = val + 1;
  });

  cellSetFreezeBtn.addEventListener('click', () => {
    if (!activeCellModalData) return;
    const { habitId, dateKey } = activeCellModalData;
    const habit = appData.habits.find(h => h.id === habitId);
    if (habit) {
      if (!habit.completions) habit.completions = {};
      habit.completions[dateKey] = 'skipped';
      saveAppData(appData);
      closeCellDetailModal();
      renderHabitGrid();
    }
  });

  cellClearBtn.addEventListener('click', () => {
    if (!activeCellModalData) return;
    const { habitId, dateKey } = activeCellModalData;
    const habit = appData.habits.find(h => h.id === habitId);
    if (habit && habit.completions) {
      delete habit.completions[dateKey];
      saveAppData(appData);
      closeCellDetailModal();
      renderHabitGrid();
    }
  });

  // Journal actions
  moodSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('.mood-btn');
    if (!btn) return;
    moodSelector.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  saveJournalNoteBtn.addEventListener('click', handleSaveJournalNote);
  journalSearchInput.addEventListener('input', renderNotesFeed);

  notesFeedList.addEventListener('click', async (e) => {
    const delBtn = e.target.closest('.delete-note-btn');
    if (!delBtn) return;
    const noteId = delBtn.getAttribute('data-id');

    const confirmed = await showConfirmation({
      title: 'Delete Daily Reflection?',
      message: 'Are you sure you want to delete this reflection note? This action cannot be undone.',
      icon: '🗑️',
      confirmText: 'Delete Note',
      confirmType: 'danger'
    });
    if (!confirmed) return;

    appData.notes = (appData.notes || []).filter(n => n.id !== noteId);
    saveAppData(appData);
    showToast('Reflection note deleted.', 'warn');
    renderNotesFeed();
    renderHabitGrid();
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // If typing in input, don't trigger global shortcuts
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      if (e.key === 'Escape') {
        closeHabitModal();
        closeCellDetailModal();
        closeDataModal();
        shortcutsModal.classList.add('hidden');
        if (confirmModal) confirmModal.classList.add('hidden');
      }
      return;
    }

    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      openHabitModal(null);
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      jumpToToday();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevMonth();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNextMonth();
    } else if (e.key === '1') {
      setView('grid');
    } else if (e.key === '2') {
      setView('analytics');
    } else if (e.key === '3') {
      setView('journal');
    } else if (e.key === '4') {
      setView('guide');
    } else if (e.key === '?') {
      shortcutsModal.classList.toggle('hidden');
    } else if (e.key === 'Escape') {
      closeHabitModal();
      closeCellDetailModal();
      closeDataModal();
      shortcutsModal.classList.add('hidden');
      proToolsDropdown.classList.add('hidden');
      if (confirmModal) confirmModal.classList.add('hidden');
    }
  });
}

// Download Helper
function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Kick off
init();
