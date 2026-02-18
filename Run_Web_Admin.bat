@echo off
echo Starting My Word Web Admin Panel...
cd web-admin
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting Web Interface...
call npm run dev
pause
