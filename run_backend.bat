@echo off
echo Starting TechPlacify Django REST Backend on http://127.0.0.1:8000 ...
cd backend
..\venv\Scripts\python manage.py runserver 127.0.0.1:8000
pause
