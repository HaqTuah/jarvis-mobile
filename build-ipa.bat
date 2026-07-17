@echo off
title Jarvis IPA Builder
color 0B
cd /d "%~dp0"

echo.
echo   ╔══════════════════════════════════════════╗
echo   ║     📱  JARVIS IPA BUILDER              ║
echo   ╚══════════════════════════════════════════╝
echo.
echo   Builds a standalone IPA for SideStore
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check EAS CLI
where eas >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing EAS CLI...
    call npm install -g eas-cli
)

:: Install deps if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install --legacy-peer-deps
)

echo.
echo ════════════════════════════════════════════════
echo   STEP 1: Login to Expo
echo ════════════════════════════════════════════════
echo.
echo   You need an Expo account (free at expo.dev/signup)
echo.
eas login
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Login failed
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════
echo   STEP 2: Build the IPA
echo ════════════════════════════════════════════════
echo.
echo   This builds a standalone IPA for sideloading.
echo   EAS will upload it to Expo's servers and build it
echo   in the cloud. Takes ~5-10 minutes.
echo.
echo   After the build finishes, you'll get a download link.
echo.
echo   Press any key to start the build...
pause >nul

eas build --platform ios --profile sidestore

echo.
echo ════════════════════════════════════════════════
echo   BUILD COMPLETE
echo ════════════════════════════════════════════════
echo.
echo   ✅ Your IPA is ready!
echo.
echo   Next steps:
echo   1. Download the IPA from the link above
echo   2. Open SideStore on your iPhone
echo   3. Go to My Apps tab
echo   4. Tap the + button
echo   5. Select the downloaded .ipa file
echo   6. Enter your Apple ID credentials
echo   7. Wait for sideload to finish
echo.
echo   ⚠️  Free Apple ID: app expires in 7 days
echo      Just re-run this script and re-sideload
echo.
pause
