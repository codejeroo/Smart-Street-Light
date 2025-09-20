@echo off
echo Smart Street Light Dashboard Setup
echo ===================================
echo.

echo Checking Node.js installation...
node -v
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
echo This may take a few minutes...
echo.

REM Try different npm approaches
node -e "require('child_process').execSync('npm install', {stdio: 'inherit'})"

if errorlevel 1 (
    echo.
    echo Trying alternative installation method...
    echo.
    REM Alternative: Download and run npm directly
    where npm >nul 2>&1
    if errorlevel 1 (
        echo ERROR: npm not found in PATH
        echo Please add Node.js to your system PATH
        pause
        exit /b 1
    )
    
    npm install
)

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Starting development server...
echo The dashboard will open at http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
node -e "require('child_process').spawn('npm', ['run', 'dev'], {stdio: 'inherit', shell: true})"

if errorlevel 1 (
    echo.
    echo Trying alternative start method...
    node node_modules\vite\bin\vite.js
)

pause