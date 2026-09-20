# Security Policy

## Supported Versions

DailyHabits Pro is a client-side, offline-first application that runs entirely inside the user's browser. Security updates and patches are applied directly to the `main` branch.

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

---

## Reporting a Vulnerability

Because DailyHabits Pro handles user data strictly via client-side `localStorage` without transmission to any backend server, vulnerabilities typically relate to cross-site scripting (XSS), data serialization flaws, or asset integrity.

If you discover a security vulnerability:
1. **Do NOT open a public GitHub issue.**
2. Please privately notify the maintainer via GitHub security advisories or by contacting **Krishna Kanth B** at [krishnakanthb13 on GitHub](https://github.com/krishnakanthb13).
3. Include steps to reproduce the issue, an explanation of the potential impact, and suggested remediations if known.

We appreciate responsible disclosure and aim to review and address all valid reports promptly.
