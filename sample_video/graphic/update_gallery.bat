@echo off
chcp 65001 >nul
title Gallery Auto Sync
echo ========================================================
echo  Syncing graphic project gallery images...
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync_gallery.ps1"

echo.
echo ========================================================
echo  Done! images.json updated.
echo ========================================================
echo.
pause
