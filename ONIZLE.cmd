@echo off
cd /d "%~dp0"
call npm.cmd run build
if errorlevel 1 goto failed
call npm.cmd run preview
:failed
pause
