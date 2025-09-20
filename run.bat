@echo off
echo Starting Smart Street Light Dashboard...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo node_modules folder not found. Installing dependencies...
    echo.
    call start.bat
    exit /b
)

echo Opening dashboard at http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

REM Try to start Vite dev server
if exist "node_modules\vite\bin\vite.js" (
    node node_modules\vite\bin\vite.js
) else if exist "node_modules\.bin\vite.cmd" (
    node_modules\.bin\vite.cmd
) else (
    echo Vite not found. Please run start.bat first to install dependencies.
    pause
)

pause