@echo off
color 0E
title Setup MongoDB Atlas

echo ========================================
echo   MongoDB Atlas Setup - Quick Guide
echo ========================================
echo.

echo This will help you configure MongoDB Atlas (Cloud Database)
echo.

echo Step 1: Create Account
echo -------------------
echo Opening MongoDB Atlas...
timeout /t 2 >nul
start https://www.mongodb.com/cloud/atlas/register
echo.

echo Step 2: After creating account and cluster
echo ----------------------------------------
echo 1. Click "Connect" on your cluster
echo 2. Choose "Connect your application"
echo 3. Copy the connection string
echo 4. It looks like: mongodb+srv://username:password@cluster.mongodb.net/
echo.

set /p MONGO_URI="Paste your MongoDB Atlas connection string here: "

if "%MONGO_URI%"=="" (
    echo.
    echo No connection string provided. Exiting...
    pause
    exit
)

echo.
echo Updating backend\.env file...

:: Backup existing .env
if exist "%~dp0backend\.env" (
    copy "%~dp0backend\.env" "%~dp0backend\.env.backup" >nul
    echo Backup created: backend\.env.backup
)

:: Update MONGODB_URI in .env
powershell -Command "(gc '%~dp0backend\.env') -replace 'MONGODB_URI=.*', 'MONGODB_URI=%MONGO_URI%/codeprep' | Out-File -encoding ASCII '%~dp0backend\.env'"

echo.
echo ========================================
echo   Configuration Updated!
echo ========================================
echo.
echo MongoDB Atlas has been configured successfully!
echo.
echo Connection string: %MONGO_URI%/codeprep
echo.
echo You can now run START_CODEPREP.bat to start the application.
echo.
pause
