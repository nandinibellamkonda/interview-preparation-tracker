@echo off
REM Interview Preparation Tracker - Windows Setup Script

title Interview Preparation Tracker - Setup
color 0A
cls

echo.
echo ====================================================
echo   Interview Preparation Tracker - Automated Setup
echo ====================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js v16+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node -v
echo.

REM Setup Backend
echo.
echo Setting up Backend...
echo.

cd backend

if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install
) else (
    echo   Dependencies already installed
)

if not exist ".env" (
    echo   Creating .env file from template...
    copy .env.example .env
    echo   [WARNING] Please update backend\.env with your MongoDB URI
) else (
    echo   .env file already exists
)

cd ..
echo [OK] Backend setup complete
echo.

REM Setup Frontend
echo.
echo Setting up Frontend...
echo.

cd frontend

if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install
) else (
    echo   Dependencies already installed
)

cd ..
echo [OK] Frontend setup complete
echo.

REM Display next steps
color 0B
cls

echo.
echo ====================================================
echo   Setup Complete!
echo ====================================================
echo.
echo Next Steps:
echo.
echo 1. Update backend\.env with your MongoDB connection
echo    MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/interview-prep
echo    JWT_SECRET=your_secure_secret_key
echo.
echo 2. Open TWO terminal windows and run:
echo.
echo    Terminal 1 - Backend:
echo      cd backend
echo      npm run dev
echo.
echo    Terminal 2 - Frontend:
echo      cd frontend
echo      npm run dev
echo.
echo 3. Open http://localhost:5173 in your browser
echo.
echo 4. Register and login to get started!
echo.
echo ====================================================
echo   Documentation:
echo ====================================================
echo   - README_COMPLETE.md     (Full documentation)
echo   - DEPLOYMENT_GUIDE.md    (Deployment steps)
echo   - PROJECT_SUMMARY.md     (Project overview)
echo.

pause
