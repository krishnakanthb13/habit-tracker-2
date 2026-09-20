@echo off
setlocal enabledelayedexpansion
title DailyHabits Pro Launcher

:: Navigate to the directory containing this script
cd /d "%~dp0"

echo ===================================================
echo           DailyHabits Pro - Launcher
echo ===================================================
echo.

:: 1. Pre-flight Check: Node.js installation
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH!
    echo Please install Node.js from https://nodejs.org/ to run this app.
    echo.
    pause
    exit /b 1
)

:: 2. Check for dependencies (node_modules)
if not exist "node_modules\" (
    echo [*] Node dependencies not found. Installing packages...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
    echo.
)

:: 3. Build step (Compile production bundle)
echo [*] Building production bundle (vite build)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Please check the console output above.
    pause
    exit /b 1
)
echo [OK] Build completed successfully.
echo.

:: 4. Run the production preview server
echo [*] Starting DailyHabits Pro server...
echo [*] Local URL: http://127.0.0.1:4173/
echo [*] Press Ctrl+C in this terminal window to stop the server.
echo.

call npx vite preview --host 127.0.0.1 --port 4173 --open

echo.
echo Server stopped.
pause
