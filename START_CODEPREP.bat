@echo off
color 0A
title CodePrep AI - Startup

echo ========================================
echo      CodePrep AI - Starting Up
echo ========================================
echo.

:: Check if MongoDB is running
echo [1/3] Checking MongoDB...
timeout /t 1 >nul

:: Option to use MongoDB Atlas instead
echo.
echo MongoDB Options:
echo 1. Use MongoDB Atlas (Cloud - Recommended)
echo 2. Use Local MongoDB (Must be installed)
echo.
set /p MONGO_CHOICE="Choose option (1 or 2): "

if "%MONGO_CHOICE%"=="1" (
    echo.
    echo ========================================
    echo   Using MongoDB Atlas (Cloud Database)
    echo ========================================
    echo.
    echo Please ensure you have:
    echo 1. Created a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
    echo 2. Created a cluster
    echo 3. Updated MONGODB_URI in backend\.env file
    echo.
    echo Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeprep
    echo.
    set /p CONTINUE="Have you configured MongoDB Atlas? (y/n): "
    if /i not "%CONTINUE%"=="y" (
        echo.
        echo Please configure MongoDB Atlas first, then run this script again.
        pause
        exit
    )
) else (
    echo.
    echo [INFO] Attempting to start local MongoDB...
    start "MongoDB" cmd /k "mongod --dbpath C:\data\db"
    timeout /t 3 >nul
)

echo.
echo [2/3] Starting Backend Server...
start "CodePrep Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 5 >nul

echo.
echo [3/3] Starting Frontend Server...
start "CodePrep Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo          CodePrep AI Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Three new windows have opened:
echo - MongoDB (if using local)
echo - Backend Server
echo - Frontend Server
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:5173

echo.
echo CodePrep AI is running!
echo Close this window when you're done.
echo.
pause
