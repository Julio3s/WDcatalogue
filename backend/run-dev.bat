@echo off
cd /d "%~dp0"
"C:\Users\NEW USER\AppData\Local\Programs\Python\Python313\python.exe" manage.py runserver 127.0.0.1:8000 > "%~dp0backend-dev.out.log" 2> "%~dp0backend-dev.err.log"
