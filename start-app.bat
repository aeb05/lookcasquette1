@echo off
echo ========================================
echo   LOOK CASQUETTE - Starting App
echo ========================================
echo.

REM Check if backend exists
if not exist "C:\xampp\htdocs\backend" (
    echo [ERROR] Backend not found!
    echo.
    echo Please run setup-backend.bat first
    echo.
    pause
    exit /b 1
)

REM Check if Apache is running
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if not "%ERRORLEVEL%"=="0" (
    echo [ERROR] Apache is not running!
    echo.
    echo Please start Apache in XAMPP Control Panel
    echo.
    pause
    exit /b 1
)

REM Check if MySQL is running
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if not "%ERRORLEVEL%"=="0" (
    echo [ERROR] MySQL is not running!
    echo.
    echo Please start MySQL in XAMPP Control Panel
    echo.
    pause
    exit /b 1
)

echo [OK] Backend services are running
echo.
echo Starting frontend...
echo.
echo ========================================
echo   App URLs:
echo ========================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost/backend/api
echo   Admin:    http://localhost:5173/admin/login
echo ========================================
echo.
echo Press Ctrl+C to stop the app
echo.

npm run dev
