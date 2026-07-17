@echo off
title Jarvis
color 0B
cd /d "%~dp0"

echo.
echo   ╔══════════════════════════════════════════╗
echo   ║     🧠  JARVIS — INSTALL ON iPHONE      ║
echo   ╚══════════════════════════════════════════╝
echo.
echo   Choose your method:
echo.
echo     [1] 📱 Expo Go (QR code — requires PC on)
echo     [2] 🏠 SideStore (standalone IPA — no PC needed)
echo     [3] ❌ Cancel
echo.

choice /c 123 /n /m "  Pick an option (1-3): "

if %ERRORLEVEL% EQU 3 exit /b
if %ERRORLEVEL% EQU 2 goto sidestore
if %ERRORLEVEL% EQU 1 goto expogo

:expogo
cls
echo.
echo   ╔══════════════════════════════════════════╗
echo   ║     📱  EXPO GO METHOD                  ║
echo   ╚══════════════════════════════════════════╝
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1-3 delims=." %%a in ('node -v') do echo ✅ Node %%a
echo.

:: Install deps if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install --legacy-peer-deps
)

:: Start server in background
echo 🚀 Starting Jarvis brain...
start "Jarvis" cmd /c "cd /d d:\Jarvis\jarvis-server && node server.js"

:: Start Expo with tunnel
echo 📱 Starting app...
echo.
echo   When the QR code appears:
echo   1. Install "Expo Go" from App Store
echo   2. Open your iPhone Camera
echo   3. Point at the QR code
echo   4. Tap "Open in Expo Go"
echo.
npx expo start --tunnel
exit /b

:sidestore
cls
echo.
echo   ╔══════════════════════════════════════════╗
echo   ║     🏠  SIDESTORE METHOD                ║
echo   ╚══════════════════════════════════════════╝
echo.
echo   ════════════════════════════════════════════════
echo   PHASE 1: Install SideStore on your iPhone
echo   ════════════════════════════════════════════════
echo.
echo   SideStore lets you sideload apps without a PC
echo   after the initial setup. Here's how:
echo.
echo   1. On your iPhone, open Safari and go to:
echo      ➜  sidestore.io
echo.
echo   2. Tap "Install" and follow the on-screen steps
echo      (you'll need a free Apple ID)
echo.
echo   3. Once SideStore is installed, go to:
echo      Settings → General → VPN & Device Management
echo      → Trust "SideStore"
echo.
echo   ════════════════════════════════════════════════
echo   PHASE 2: Build the Jarvis IPA
echo   ════════════════════════════════════════════════
echo.
echo   Now we'll build a standalone Jarvis app that
echo   connects to your cloud server on Railway.
echo.
echo   Press any key to start building...
pause >nul
echo.
call build-ipa.bat
echo.
echo   ════════════════════════════════════════════════
echo   PHASE 3: Sideload with SideStore
echo   ════════════════════════════════════════════════
echo.
echo   1. Download the .ipa file from the link above
echo      to your iPhone's Files app
echo.
echo   2. Open SideStore on your iPhone
echo.
echo   3. Go to the "My Apps" tab
echo.
echo   4. Tap the "+" button in the top right
echo.
echo   5. Navigate to the .ipa file and select it
echo.
echo   6. Enter your Apple ID email and password
echo      (SideStore only needs this to sign the app)
echo.
echo   7. Wait for "Installing..." to finish
echo.
echo   ⚠️  Free Apple ID: app expires in 7 days
echo      When it expires, just re-sideload the .ipa
echo      (keep the .ipa file on your phone!)
echo.
pause