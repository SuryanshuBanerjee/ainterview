@echo off
color 0B
title Install MongoDB

echo ========================================
echo      MongoDB Installation Helper
echo ========================================
echo.

echo This script will help you install MongoDB.
echo.
echo Option 1: MongoDB Atlas (Cloud - Recommended for beginners)
echo   - Free tier available
echo   - No local installation needed
echo   - Always accessible
echo   - Setup guide: https://www.mongodb.com/docs/atlas/getting-started/
echo.
echo Option 2: Local MongoDB Installation
echo   - Runs on your computer
echo   - Requires installation
echo.
set /p INSTALL_CHOICE="Which option do you prefer? (1 or 2): "

if "%INSTALL_CHOICE%"=="1" (
    echo.
    echo ========================================
    echo   MongoDB Atlas Setup Instructions
    echo ========================================
    echo.
    echo 1. Go to https://www.mongodb.com/cloud/atlas/register
    echo 2. Create a free account
    echo 3. Create a new cluster (choose FREE tier)
    echo 4. Create a database user
    echo 5. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
    echo 6. Get your connection string
    echo 7. Update backend\.env file with:
    echo    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codeprep
    echo.
    echo Opening MongoDB Atlas website...
    start https://www.mongodb.com/cloud/atlas/register
    echo.
    echo After setup, run START_CODEPREP.bat
    echo.
) else (
    echo.
    echo ========================================
    echo   Local MongoDB Installation
    echo ========================================
    echo.
    echo Opening MongoDB download page...
    start https://www.mongodb.com/try/download/community
    echo.
    echo Installation Steps:
    echo 1. Download MongoDB Community Server
    echo 2. Run the installer
    echo 3. Choose "Complete" installation
    echo 4. Install MongoDB as a Service (recommended)
    echo 5. Create data directory: C:\data\db
    echo.
    echo After installation:
    echo - MongoDB will run automatically as a service
    echo - Run START_CODEPREP.bat to start the app
    echo.
    echo Creating data directory...
    if not exist "C:\data\db" (
        mkdir "C:\data\db"
        echo Data directory created: C:\data\db
    ) else (
        echo Data directory already exists: C:\data\db
    )
    echo.
)

echo.
pause
