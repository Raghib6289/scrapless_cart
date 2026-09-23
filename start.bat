@echo off
title Scrapless Cart Server
cd /d "%~dp0"
echo ========================================================
echo   Starting Scrapless Cart Server on http://localhost:3000
echo ========================================================
start http://localhost:3000
node server.js
pause
