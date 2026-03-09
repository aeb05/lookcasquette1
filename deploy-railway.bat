@echo off
echo ========================================
echo   Deploy to Railway - Step by Step
echo ========================================
echo.

echo Step 1: Initialize Git
git init
git add .
git commit -m "Ready for Railway deployment"
echo [OK] Git initialized
echo.

echo Step 2: Next Steps
echo.
echo 1. Create a GitHub repository:
echo    - Go to https://github.com/new
echo    - Name: lookcasquette
echo    - Click "Create repository"
echo.
echo 2. Push to GitHub (copy these commands):
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/lookcasquette.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy on Railway:
echo    - Go to https://railway.app
echo    - Click "New Project"
echo    - Select "Deploy from GitHub repo"
echo    - Choose your lookcasquette repo
echo.
echo 4. Add MySQL database in Railway
echo.
echo 5. Import database using Railway CLI:
echo    npm i -g @railway/cli
echo    railway login
echo    railway link
echo    railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD lookcasquette ^< backend/database.sql
echo.
echo See DEPLOY_TO_RAILWAY.md for detailed instructions
echo.
pause
