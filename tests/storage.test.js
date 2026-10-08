// tests/storage.test.js
// Regression and Unit tests for storage, settings schema, effective dates, and health repair

import test from 'node:test';
import assert from 'node:assert/strict';

// In-memory mock for localStorage in Node test environment
function setupMockLocalStorage() {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

setupMockLocalStorage();

// Import after setting up mock
const {
  loadSettings,
  saveSettings,
  getEffectiveDate,
  getEffectiveTodayKey,
  validateAndRepairStorage,
  formatDateKey
} = await import('../src/storage.js');

test('Storage & Settings Suite', async (t) => {
  // ==========================================
  // SECTION 1: HAPPY PATH
  // ==========================================
  await t.test('Happy Path: default settings contain all new toggles and options', () => {
    localStorage.clear();
    const settings = loadSettings();

    assert.equal(settings.confettiEnabled, true, 'confettiEnabled should default to true');
    assert.equal(settings.soundEnabled, true, 'soundEnabled should default to true');
    assert.equal(settings.animationsEnabled, true, 'animationsEnabled should default to true');
    assert.equal(settings.dayExtensionEnabled, false, 'dayExtensionEnabled should default to false');
    assert.equal(settings.dayExtensionHour, 3, 'dayExtensionHour should default to 3 AM');
    assert.equal(settings.skipPreservesStreak, true, 'skipPreservesStreak should default to true');
    assert.equal(settings.firstDayOfWeek, 1, 'firstDayOfWeek should default to 1 (Monday)');
    assert.equal(settings.compactMode, false, 'compactMode should default to false');
    assert.equal(settings.autoScrollToday, true, 'autoScrollToday should default to true');
    assert.equal(settings.showCompletedRanks, true, 'showCompletedRanks should default to true');
  });

  await t.test('Happy Path: saveSettings persists modified values and loadSettings restores them', () => {
    localStorage.clear();
    const custom = {
      confettiEnabled: false,
      soundEnabled: false,
      animationsEnabled: false,
      dayExtensionEnabled: true,
      dayExtensionHour: 4,
      skipPreservesStreak: false,
      compactMode: true
    };
    saveSettings(custom);
    const loaded = loadSettings();

    assert.equal(loaded.confettiEnabled, false);
    assert.equal(loaded.soundEnabled, false);
    assert.equal(loaded.animationsEnabled, false);
    assert.equal(loaded.dayExtensionEnabled, true);
    assert.equal(loaded.dayExtensionHour, 4);
    assert.equal(loaded.skipPreservesStreak, false);
    assert.equal(loaded.compactMode, true);
  });

  // ==========================================
  // SECTION 2: EDGE CASES
  // ==========================================
  await t.test('Edge Case: getEffectiveDate behaves normally during daytime (14:00)', () => {
    const afternoon = new Date(2026, 8, 15, 14, 0, 0); // 2:00 PM Sep 15
    const eff = getEffectiveDate(afternoon, true, 3);
    assert.equal(eff.getDate(), 15);
    assert.equal(eff.getMonth(), 8);
  });

  await t.test('Edge Case: Night Owl mode at 01:30 AM before cutoff (3 AM) shifts back to previous day', () => {
    const lateNight = new Date(2026, 8, 15, 1, 30, 0); // 1:30 AM Sep 15
    const eff = getEffectiveDate(lateNight, true, 3);
    assert.equal(eff.getDate(), 14, 'Effective date should be yesterday (Sep 14)');
  });

  await t.test('Edge Case: Exactly at cutoff hour (03:00 AM) shifts to current calendar day', () => {
    const atCutoff = new Date(2026, 8, 15, 3, 0, 0); // 3:00 AM Sep 15
    const eff = getEffectiveDate(atCutoff, true, 3);
    assert.equal(eff.getDate(), 15, 'Effective date should now be Sep 15');
  });

  await t.test('Edge Case: Night owl at year boundary (Jan 1 01:00 AM) shifts to Dec 31 of prior year', () => {
    const newYearNight = new Date(2026, 0, 1, 1, 0, 0); // Jan 1, 2026 1:00 AM
    const eff = getEffectiveDate(newYearNight, true, 3);
    assert.equal(eff.getFullYear(), 2025, 'Year should roll back to 2025');
    assert.equal(eff.getMonth(), 11, 'Month should be December');
    assert.equal(eff.getDate(), 31, 'Date should be 31st');
  });

  await t.test('Edge Case: getEffectiveTodayKey produces correct YYYY-MM-DD formatted string', () => {
    const lateNight = new Date(2026, 8, 15, 2, 0, 0);
    const key = getEffectiveTodayKey({ dayExtensionEnabled: true, dayExtensionHour: 3 }, lateNight);
    assert.equal(key, '2026-09-14');
  });

  // ==========================================
  // SECTION 3: ERROR HANDLING & AUTO-REPAIR
  // ==========================================
  await t.test('Error Handling: validateAndRepairStorage sanitizes corrupted data cleanly', () => {
    localStorage.clear();
    // Simulate corrupt database
    const corruptedData = {
      habits: [
        null, // null entry
        { title: 'Broken Routine', id: '', completions: { 'not-a-date': true, '2026-09-10': { value: 'NaN' } } },
        { id: 'h1', title: 'Valid Routine', completions: { '2026-09-12': true } }
      ],
      categories: null // missing categories
    };
    localStorage.setItem('dailyhabits_pro_data_v1', JSON.stringify(corruptedData));

    const result = validateAndRepairStorage();

    assert.equal(result.ok, false, 'Should have flagged corruption issues');
    assert.ok(result.issuesFound > 0, 'Issues count should be greater than zero');
    assert.ok(result.habitCount >= 2, 'Valid habits should have been salvaged');

    // Reload repaired data
    const rawRepaired = JSON.parse(localStorage.getItem('dailyhabits_pro_data_v1'));
    assert.ok(Array.isArray(rawRepaired.categories), 'Categories should be restored');
    assert.ok(rawRepaired.categories.length > 0, 'Categories should not be empty');
    assert.equal(rawRepaired.habits[0].completions['not-a-date'], undefined, 'Invalid date key was stripped');
  });
});
