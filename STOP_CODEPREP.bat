@echo off
color 0C
title Stop CodePrep AI

echo ========================================
echo      Stopping CodePrep AI
echo ========================================
echo.

echo Stopping Node.js processes...
taskkill /F /IM node.exe /T 2>nul

echo.
echo Stopping MongoDB (if running locally)...
taskkill /F /IM mongod.exe /T 2>nul

echo.
echo ========================================
echo   CodePrep AI Stopped Successfully
echo ========================================
echo.
echo All services have been stopped.
echo.
pause
