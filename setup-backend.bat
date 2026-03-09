@echo off
echo ========================================
echo   LOOK CASQUETTE - Backend Setup
echo ========================================
echo.

REM Check if XAMPP exists
if not exist "C:\xampp" (
    echo [ERROR] XAMPP not found at C:\xampp
    echo.
    echo Please install XAMPP first:
    echo https://www.apachefriends.org/download.html
    echo.
    pause
    exit /b 1
)

echo [1/3] Copying backend to XAMPP...
xcopy /E /I /Y "backend" "C:\xampp\htdocs\backend"
if errorlevel 1 (
    echo [ERROR] Failed to copy backend
    pause
    exit /b 1
)
echo [OK] Backend copied successfully!
echo.

echo [2/3] Checking if Apache is running...
tasklist /FI "IMAGENAME eq httpd.exe" 2>NUL | find /I /N "httpd.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] Apache is running
) else (
    echo [WARNING] Apache is not running
    echo Please start Apache in XAMPP Control Panel
)
echo.

echo [3/3] Checking if MySQL is running...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MySQL is running
) else (
    echo [WARNING] MySQL is not running
    echo Please start MySQL in XAMPP Control Panel
)
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure Apache and MySQL are running in XAMPP
echo 2. Import database: http://localhost/phpmyadmin
echo    - Click "Import"
echo    - Choose: C:\xampp\htdocs\backend\database.sql
echo    - Click "Go"
echo 3. Test backend: http://localhost/backend/api/products
echo.
pause
