@echo off
setlocal
cd /d "%~dp0"
if not exist "start.html" (
  echo File start.html not found.
  echo Please unpack the whole archive first, then run this file from the unpacked folder.
  pause
  exit /b 1
)

start "" "%CD%\start.html"
exit /b 0
