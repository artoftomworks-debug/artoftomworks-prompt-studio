@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Restart-Studio.ps1"
set "studioRestartExit=%errorlevel%"
echo.
pause
exit /b %studioRestartExit%
