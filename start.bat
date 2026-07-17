@echo off
setlocal

set FE=%~dp0
set BE=%~dp0backend_service
set ITEM_XML_DIR=%~dp0..\aCis_datapack\data\xml\items

echo ============================================
echo   Starting L2 Albion Web
echo ============================================

echo.
echo Freeing ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":20200 "') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":20201 "') do taskkill /F /PID %%a >nul 2>&1
timeout /t 1 /nobreak >nul

echo.
echo Starting Backend (FastAPI on :20200)...
start "L2 Backend" cmd /k "cd /d "%BE%" && python app.py"

timeout /t 2 /nobreak >nul

echo.
echo Starting Frontend (Vite on :20201)...
start "L2 Frontend" cmd /k "cd /d "%FE%" && npm run dev -- --port 20201"

echo.
echo Done.
echo   Backend:  http://localhost:20200
echo   Frontend: http://localhost:20201
echo.
endlocal
