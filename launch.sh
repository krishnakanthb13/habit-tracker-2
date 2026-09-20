#!/usr/bin/env bash
set -e

# Navigate to project directory
cd "$(dirname "$0")"

echo "==================================================="
echo "          DailyHabits Pro - Launcher"
echo "==================================================="
echo ""

# 1. Pre-flight Check: Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not installed or not in PATH!"
    echo "Please install Node.js from https://nodejs.org/ to run this app."
    exit 1
fi

# 2. Check dependencies
if [ ! -d "node_modules" ]; then
    echo "[*] Node dependencies not found. Installing packages..."
    npm install
    echo "[OK] Dependencies installed successfully."
    echo ""
fi

# 3. Build step (Build before run)
echo "[*] Building production bundle (vite build)..."
npm run build
echo "[OK] Build completed successfully."
echo ""

# 4. Graceful cleanup on Ctrl+C / exit
cleanup() {
    echo ""
    echo "[*] Shutting down DailyHabits Pro server..."
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 5. Run preview server
echo "[*] Starting DailyHabits Pro server..."
echo "[*] Local URL: http://127.0.0.1:4173/"
echo "[*] Press Ctrl+C in this terminal window to stop the server."
echo ""

npx vite preview --host 127.0.0.1 --port 4173 --open
