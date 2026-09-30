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
2. **Custom Category Management (Add & Edit Life Areas)**:
   - **Personalized Taxonomy**: Create unlimited custom categories (e.g. `Career`, `Parenting`, `Mindfulness`, `Finance`) with custom names and accent color swatches.
   - **Edit Existing Categories**: Rename existing categories and re-color them with instant reactive updates across filter chips, habit row badges, and creation forms.
   - **Safe Deletion Guards**: Deleting a category automatically moves affected habits to an active fallback category so no routine data is ever lost.
   - **Instant Access**: Open the Category Manager from the sub-header filter bar (`Categories`), the Habit modal (`+ Manage`), or the Pro Tools dropdown.
3. **Flexible Goal Types & Frequencies**:
   - **Standard Daily Checkbox**: Classic yes/no tick.
   - **Specific Days of the Week**: Target specific routines (e.g., Mon, Wed, Fri only).
   - **Numeric / Metric Target**: Log quantities (e.g., 2500 ml water, 30 pages reading, 10,000 steps) with easy stepper controls.
4. **Streak Protection / Freeze Days (🛡️)**:
   - **Alt-click** any cell to freeze your streak during sick, travel, or rest days without breaking continuous momentum.
5. **Advanced Analytics & Streaks Matrix**:
   - **Individual Habit Heatmap Drilldown**: Filter the 365-day annual consistency matrix to view completion history for any individual routine or all habits combined.
   - **Category Balance & Effort Distribution**: Real-time progress bar and metrics breakdown showing monthly completion percentages across custom life domains.
   - **Streak Milestone Badges**: Gamified recognition on the leaderboard: 💎 **100d Centurion**, 🏆 **66d Automaticity**, 🥈 **21d Habit Loop**, and 🥉 **7d Momentum**.
   - **Discipline by Day of Week**: Bar chart identifying your peak productivity days.
   - **Real-Time KPIs**: Monthly completion rate, goals smashed, and lifetime repetitions.
6. **Integrated Daily Journal & Quick Reflections**:
   - **Frictionless Grid Reflections**: Add or edit daily thoughts directly from the Habit Grid by **Right-clicking any cell**, clicking the header **Daily Note** icon, tapping the habit row `📝` action, clicking the glowing blue cell note dot (`.has-note-dot`), or pressing <kbd>J</kbd>.
   - **Mood Filter Chips**: Filter your reflection history instantly by mood tag (`All`, `⚡ Energized`, `🎯 Focused`, `🌿 Peaceful`, `😴 Tired`).
   - **Inspire Me Prompts (💡)**: One-click thought provokers for moments of writer's block.
   - Searchable reflection history with blue indicator dots directly on grid cells, plus one-click reflection card editing.
7. **Habit Archiving & Un-Archiving Vault (📦)**:
   - **Non-Destructive Pausing**: Retire or pause habits without permanently deleting your history, lifetime streaks, or reflections.
   - **Instant Un-Archiving Everywhere**: Restore archived habits back to your active grid from:
     - The **`📦 Archived (N)`** category chip on the filter bar.
     - The habit row restore button (`📤`) in archived view.
     - The **Habit Edit Modal** toggle ("Restore to Active").
     - The **Data Manager Modal** dedicated Archived Habits tab with batch restore ("Restore All to Active").
   - **Instant Undo Action**: Archiving or restoring a habit provides an interactive toast with a 1-click **Undo** button.
8. **Upgraded Data Management & Vault (Vertical Tabs & 900px Wide Layout)**:
   - **Modern Sidebar Navigation**: Redesigned 900px modal dialog featuring vertical tabs on the left for seamless workflow switching:
     - 📤 **Export Data**: Full JSON backup with *Recommended* badge, Current Month CSV, and Lifetime CSV.
     - 📥 **Import Data**: Drag-and-drop file upload, JSON code editor, and clean *Replace All* vs *Merge* strategy toggles.
     - 📦 **Archived Vault**: Dedicated tab with count badge, habit cards, and individual/batch restore.
     - ⚠️ **Reset Data**: Protected Danger Zone to reset to starter demo routines or wipe data to a blank canvas.
   - **100% Offline & Local**: Your routine data never leaves your browser origin.
   - **Quick Pro Tools Menu**: 1-click downloads for Month CSV, Lifetime CSV, and JSON Backups without opening full modals.
9. **6 Cycling Color Themes & Tactile Audio**:
   - One-click cycling between 6 curated themes: **Midnight Dark 🌙**, **Midnight OLED Pure Black 🖤**, **Crisp Paper Light ☀️**, **Forest Sage 🌲**, **Nordic Ocean 🌊**, and **Sunset Ember 🌅**.
   - Synthesized pop sounds and celebration chords on milestone completions via the native Web Audio API.
   - Resilient celebration confetti burst upon completing monthly goals that works out-of-the-box across both bundled and standalone static environments.
10. **Custom Category Management Studio (🏷️)**:
    - **Full Domain Control**: Create, rename, recolor, and organize custom life categories (Health & Body, Focus & Work, Mind & Peace, Knowledge, Fitness & Sport, etc.).
    - **Safe Deletion & Auto-Reassignment**: Deleting a category prompts a safe selection modal allowing you to reassign all associated habits to another category or General, ensuring no habit is ever orphaned.
    - **Themed Custom Scrollbars**: Dedicated category list with theme-synchronized custom scrollbars across all dark and light palettes.
11. **Comprehensive Toast Notification & Feedback System (🍞)**:
    - Non-intrusive animated feedback across key application actions: daily 100% routine completion celebration, routine creation & editing, metric updates, sound feedback muting/unmuting, streak freeze shields, goal smashed celebrations, jumping to today (<kbd>T</kbd>), and JSON/CSV data operations.
    - Interactive 1-click **Undo** toasts for instant reversal of archiving or routine restorations.
12. **Dedicated "How to Use" User Manual & Guide**:
    - Comprehensive in-app documentation with a 4-step quickstart, deep-dives on Streak Freeze, numeric logging, category studio, reflection journaling, habit archive/restore vault, keyboard cheat sheets, and behavioral psychology strategies (Two-Day Rule, Habit Stacking).
13. **In-App Confirmation Dialogs & Non-Destructive Guards**:
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
