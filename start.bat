@echo off
echo Starting AI Interview Platform...
echo.
echo Starting Flask Backend on port 5000...
start cmd /k "cd backend && python app.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting React Frontend on port 3000...
start cmd /k "npm start"

echo.
echo Both services are starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Demo Credentials:
echo Username: testuser
echo Password: password123
echo.
pause