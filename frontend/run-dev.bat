@echo off
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run dev -- --host 127.0.0.1 > "%~dp0frontend-dev.out.log" 2> "%~dp0frontend-dev.err.log"
