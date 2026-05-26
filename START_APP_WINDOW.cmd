@echo off
setlocal
cd /d "%~dp0"
set "TARGET=start.html"
if exist "UniversalMontage-WorkGuide.html" set "TARGET=UniversalMontage-WorkGuide.html"

if not exist "%TARGET%" (
  echo Application file not found.
  echo Please unpack the whole archive first, then run this file from the unpacked folder.
  pause
  exit /b 1
)

set "APP=%CD%\%TARGET%"
set "URL=file:///%APP:\=/%"

set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
  start "" "%EDGE%" --app="%URL%" --window-size=1280,900
  exit /b
)

set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
  start "" "%EDGE%" --app="%URL%" --window-size=1280,900
  exit /b
)

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
  start "" "%CHROME%" --app="%URL%" --window-size=1280,900
  exit /b
)

set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
  start "" "%CHROME%" --app="%URL%" --window-size=1280,900
  exit /b
)

call "%~dp0Start-Windows.bat"
