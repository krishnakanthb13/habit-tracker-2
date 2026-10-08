// tests/analytics.test.js
// Regression and Unit tests for streak calculations, skip protection, and monthly metrics

import test from 'node:test';
import assert from 'node:assert/strict';

const { calculateStreak, calculateMonthStats } = await import('../src/analytics.js');

test('Analytics & Streak Rules Suite', async (t) => {
  // ==========================================
  // SECTION 1: HAPPY PATH
  // ==========================================
  await t.test('Happy Path: calculateStreak increments consecutive daily completions', () => {
    const habit = {
      id: 'h1',
      title: 'Workout',
      completions: {
        '2026-09-01': true,
        '2026-09-02': true,
        '2026-09-03': true,
        '2026-09-04': true,
        '2026-09-05': true
      }
    };
    const refDate = new Date(2026, 8, 5); // Sep 5, 2026
    const result = calculateStreak(habit, refDate, true);

    assert.equal(result.currentStreak, 5, 'Current streak should be 5');
    assert.equal(result.bestStreak, 5, 'Best streak should be 5');
    assert.equal(result.totalCompletions, 5, 'Total completions should be 5');
  });

  await t.test('Happy Path: if today is not yet marked, streak checks yesterday without breaking', () => {
    const habit = {
      id: 'h2',
      title: 'Reading',
      completions: {
        '2026-09-01': true,
        '2026-09-02': true,
        '2026-09-03': true,
        '2026-09-04': true
        // Sep 5 is not marked yet
      }
    };
    const refDate = new Date(2026, 8, 5); // Today is Sep 5
    const result = calculateStreak(habit, refDate, true);

    assert.equal(result.currentStreak, 4, 'Streak should count back from yesterday');
  });

  // ==========================================
  // SECTION 2: EDGE CASES (SKIP DAYS / HARVESTED FROM V1)
  // ==========================================
  await t.test('Edge Case: Skipped rest days preserve streak when skipPreservesStreak is TRUE', () => {
    const habit = {
      id: 'h3',
      title: 'Gym',
      completions: {
        '2026-09-01': true,
        '2026-09-02': true,
        '2026-09-03': 'skipped', // Rest day freeze
        '2026-09-04': true,
        '2026-09-05': true
      }
    };
    const refDate = new Date(2026, 8, 5);
    const result = calculateStreak(habit, refDate, true);

    // 4 active completed days preserved across the rest day
    assert.equal(result.currentStreak, 4, 'Streak should skip the rest day and keep running');
    assert.equal(result.bestStreak, 4);
  });

  await t.test('Edge Case: Skipped rest days break streak when skipPreservesStreak is FALSE (strict mode)', () => {
    const habit = {
      id: 'h3',
      title: 'Gym',
      completions: {
        '2026-09-01': true,
        '2026-09-02': true,
        '2026-09-03': 'skipped', // Rest day in strict mode
        '2026-09-04': true,
        '2026-09-05': true
      }
    };
    const refDate = new Date(2026, 8, 5);
    const result = calculateStreak(habit, refDate, false);

    // In strict mode, skipped day breaks the streak: only Sep 4 and 5 count
    assert.equal(result.currentStreak, 2, 'Strict mode should have reset streak at skipped day');
  });

  await t.test('Edge Case: Numeric habits with value > 0 count toward streak', () => {
    const habit = {
      id: 'h4',
      title: 'Hydration',
      completions: {
        '2026-09-01': { value: 2500, note: '' },
        '2026-09-02': { value: 2000, note: '' },
        '2026-09-03': { value: 3000, note: '' }
      }
    };
    const refDate = new Date(2026, 8, 3);
    const result = calculateStreak(habit, refDate, true);

    assert.equal(result.currentStreak, 3);
    assert.equal(result.totalCompletions, 3);
  });

  // ==========================================
  // SECTION 3: ERROR HANDLING
  // ==========================================
  await t.test('Error Handling: Empty completions or null completions does not throw', () => {
    const emptyHabit = { id: 'h5', title: 'Empty', completions: {} };
    const nullHabit = { id: 'h6', title: 'Null' };

    const res1 = calculateStreak(emptyHabit, new Date(), true);
    assert.equal(res1.currentStreak, 0);
    assert.equal(res1.bestStreak, 0);

    const res2 = calculateStreak(nullHabit, new Date(), true);
    assert.equal(res2.currentStreak, 0);
  });

  await t.test('Error Handling: calculateMonthStats with empty habits returns safe zeros', () => {
    const stats = calculateMonthStats([], 2026, 8, true);
    assert.equal(stats.totalHabitsCount, 0);
    assert.equal(stats.overallRate, 0);
    assert.equal(stats.completedGoalsCount, 0);
  });
});
