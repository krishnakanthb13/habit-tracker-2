# DailyHabits Pro 🌿

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Storage](https://img.shields.io/badge/Data-100%25%20Offline%20Local-10b981.svg)](DESIGN_PHILOSOPHY.md)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML%20%7C%20CSS%20%7C%20JS-6366f1.svg)](CODE_DOCUMENTATION.md)
[![Built with Vite](https://img.shields.io/badge/Bundler-Vite-purple.svg)](package.json)

An ultra-lightweight, blazing fast, and aesthetic daily habit tracker inspired by **[DailyHabits.xyz](https://app.dailyhabits.xyz/)**, crafted with **all premium paywalled features unlocked** forever.

100% private, offline-first, zero login friction, and beautifully responsive.

---

## ⚡ Quick Start (< 2 minutes)

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)

### One-Click Launchers (Builds & Runs Automatically)
- **Windows**: Double-click [`launch.bat`](launch.bat)
- **macOS / Linux**: Run `chmod +x launch.sh && ./launch.sh`

### Manual Run
```bash
# Clone the repository
git clone https://github.com/krishnakanthb13/habit-tracker-2.git
cd habit-tracker-2

# Install dependencies & start
npm install
npm run dev
```
Open **`http://127.0.0.1:5173/`** in your browser.

### 🚀 Deploy to the Web (1-Click Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkrishnakanthb13%2Fhabit-tracker-2)

Or deploy via terminal:
```bash
npx vercel
```

---

## ✨ Features

### 🌟 Core Minimalist Habit Grid (DailyHabits Spreadsheet Style)
- **Signature Monthly Calendar Spreadsheet**: Track daily habits in a clean horizontal grid with sticky column headers and sticky habit rows.
- **Visual Goal Tracking**: Set monthly targets (e.g., 25 days/month) with real-time achieved badge pills that light up emerald green `✓` when goal is hit.
- **One-Click Check**: Instant tactile toggle with sound synthesized via the Web Audio API.
- **Daily Check-in Totals**: Bottom summary row showing your aggregate habits completed on each day of the month.
- **Month Navigation**: Easily jump backward/forward across months or click `Today` to return immediately.

### 🔓 All Paywall Features Unlocked
1. **Unlimited Habits**: No 3-habit paywall cap. Track unlimited habits across all areas of your life.
2. **Custom Categories & Filtering**: Color-coded categories (`Health & Body`, `Focus & Work`, `Mind & Peace`, `Fitness`, `Knowledge`, `Creative`) with instant chip filtering.
3. **Flexible Goal Types & Frequencies**:
   - **Standard Daily Checkbox**: Classic yes/no tick.
   - **Specific Days of the Week**: Target specific routines (e.g., Mon, Wed, Fri only).
   - **Numeric / Metric Target**: Log quantities (e.g., 2500 ml water, 30 pages reading, 10,000 steps) with easy stepper controls.
4. **Streak Protection / Freeze Days (🛡️)**:
   - **Alt-click** any cell to freeze your streak during sick, travel, or rest days without breaking continuous momentum.
5. **Advanced Analytics & Streaks Matrix**:
   - **365-Day Consistency Heatmap**: Full GitHub-style annual activity matrix.
   - **Discipline by Day of Week**: Bar chart identifying your peak productivity days.
   - **Habit Leaderboard**: Current streaks vs all-time records with flame counters 🔥.
   - **Real-Time KPIs**: Monthly completion rate, goals smashed, and lifetime repetitions.
6. **Integrated Daily Journal & Quick Reflections**:
   - **Frictionless Grid Reflections**: Add or edit daily thoughts directly from the Habit Grid by **Right-clicking any cell**, clicking the header **Daily Note** icon, tapping the habit row `📝` action, clicking the glowing blue cell note dot (`.has-note-dot`), or pressing <kbd>J</kbd>.
   - Attach reflections and mood tags (`⚡ Energized`, `🎯 Focused`, `🌿 Peaceful`, `🌧️ Struggling`, `🚀 Victorious`) to any date or habit.
   - Searchable reflection history with blue indicator dots directly on grid cells.
7. **Complete Data Management & Freedom (100% Offline & Local)**:
   - **Centralized Data Manager**: Comprehensive modal for import, export, and guarded resets.
   - **Quick Pro Tools Menu**: 1-click downloads for Month CSV, Lifetime CSV, and JSON Backups without opening full modals.
   - **Full JSON Backup & Restore**: Export all habits, streak history, notes, and preferences into a single file. Drag & drop or paste JSON to restore anytime.
   - **Import Strategies**: Choose between **Clean Overwrite (Replace All)** or **Merge with Current Routines**.
   - **Spreadsheet Exports**:
     - **Export Month (CSV)**: Formatted table of the current active month.
     - **Export Lifetime (CSV)**: Complete chronological matrix of every recorded check-in across all months/years.
   - **Guarded Reset Options (Data Manager Danger Zone)**:
     - **Wipe All Data (Blank Slate)**: Permanently erases all habits, check-ins, and notes to start completely from scratch (0 habits), protected by double confirmation modals.
     - **Reset to Demo Starter Routines**: Re-populates fresh starter routines (Meditation, Reading, Hydration, etc.).
8. **5 Cycling Color Themes & Tactile Audio**:
   - One-click cycling between 5 curated themes: **Midnight OLED Dark 🌙**, **Crisp Paper Light ☀️**, **Forest Sage 🌲**, **Nordic Ocean 🌊**, and **Sunset Ember 🌅**.
   - Synthesized pop sounds and celebration chords on milestone completions via the native Web Audio API.
   - Confetti burst animation upon completing monthly goals.
9. **Dedicated "How to Use" User Manual & Guide**:
   - Comprehensive in-app documentation with a 4-step quickstart, deep-dives on Streak Freeze and numeric logging, keyboard cheat sheets, and behavioral psychology strategies (Two-Day Rule, Habit Stacking).
10. **In-App Confirmation Dialogs**:
    - Custom non-blocking modal dialogs protect against accidental data wiping, habit deletion, or reflection loss with clear warning previews and <kbd>Esc</kbd> dismissal.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>N</kbd> | Open New Habit dialog |
| <kbd>J</kbd> | Open Quick Daily Reflection / Journal entry (<kbd>Ctrl</kbd>+<kbd>Enter</kbd> to save) |
| <kbd>T</kbd> | Jump to today's date & current month |
| <kbd>&larr;</kbd> / <kbd>&rarr;</kbd> | Navigate previous / next month |
| <kbd>1</kbd> | Switch to **Habit Grid** view |
| <kbd>2</kbd> | Switch to **Analytics & Streaks** view |
| <kbd>3</kbd> | Switch to **Journal & Notes** view |
| <kbd>4</kbd> | Switch to **How to Use / Guide** view |
| <kbd>?</kbd> | Show Keyboard Shortcuts modal |
| <kbd>Esc</kbd> | Close any open modal or dropdown |

---

## 📚 Documentation & Architecture

Detailed project documentation is available in the repository:

- 📖 **[Code Documentation](CODE_DOCUMENTATION.md)**: Deep-dive into architecture, function signatures, data flows, and state lifecycle.
- 🧠 **[Design Philosophy](DESIGN_PHILOSOPHY.md)**: Ideology, behavioral science principles (Atomic Habits), and engineering trade-offs.
- 🤝 **[Contributing Guidelines](CONTRIBUTING.md)**: Guide for setting up, filing bugs, and submitting pull requests.
- 🛡️ **[Security Policy](SECURITY.md)**: Supported versions and vulnerability disclosure protocol.
- 📜 **[Code of Conduct](CODE_OF_CONDUCT.md)**: Community standards and expectations.

---

## 🛠️ Build & Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server at `http://127.0.0.1:5173/` |
| `npm run build` | Compiles optimized production bundle in `dist/` (~26 kB total gzipped) |
| `npm run preview`| Serves the production `dist/` build locally |

---

## 📄 License

This project is open-source software licensed under the **GNU General Public License v3.0**.  
See the [LICENSE](LICENSE) file for details.

Copyright (C) 2026 **Krishna Kanth B** ([@krishnakanthb13](https://github.com/krishnakanthb13))
