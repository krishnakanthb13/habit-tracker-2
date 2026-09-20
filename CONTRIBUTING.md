# Contributing to DailyHabits Pro

Thank you for your interest in contributing to **DailyHabits Pro**! We welcome bug reports, feature suggestions, documentation enhancements, and code contributions.

---

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the project maintainer.

---

## How Can I Contribute?

### 1. Reporting Bugs
Before creating a bug report, check existing [GitHub Issues](https://github.com/krishnakanthb13/habit-tracker-2/issues) to ensure the issue hasn't already been reported.

When filing an issue, please include:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Expected behavior vs. actual behavior.
- Browser name and operating system.
- Any error messages from the browser developer console (<kbd>F12</kbd>).

### 2. Suggesting Features
Enhancements and new ideas are welcome! Please open an issue using the feature request template and describe:
- The problem or routine workflow your suggestion addresses.
- The proposed solution or visual mockup.
- Any alternative approaches considered.

---

## Development Workflow

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm` (bundled with Node.js)

### Local Setup
1. **Fork the repository** on GitHub:
   ```bash
   git clone https://github.com/krishnakanthb13/habit-tracker-2.git
   cd habit-tracker-2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://127.0.0.1:5173/` in your browser.

4. **Compile the production bundle**:
   ```bash
   npm run build
   ```

---

## Pull Request Guidelines

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Adhere to Code Guidelines**:
   - Write clean, vanilla JavaScript and CSS (no Tailwind or heavy frameworks).
   - Ensure the app remains 100% offline-first.
   - Use meaningful commit messages.
3. **Pre-Submission Checklist**:
   - [ ] Run `npm run build` to ensure the production build succeeds without errors.
   - [ ] Verify keyboard shortcuts (<kbd>N</kbd>, <kbd>T</kbd>, <kbd>1</kbd>-<kbd>4</kbd>, <kbd>Esc</kbd>) continue to work.
   - [ ] Test in both Dark and Light themes.
   - [ ] Verify data persistence in `localStorage`.
4. **Submit your PR**:
   - Open a pull request targeting `main`.
   - Fill out the provided PR template.
