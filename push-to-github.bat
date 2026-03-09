@echo off
echo ========================================
echo   Push to GitHub - Helper Script
echo ========================================
echo.
echo Your git repository is ready!
echo.
echo STEP 1: Create GitHub Repository
echo ---------------------------------
echo 1. Go to: https://github.com/new
echo 2. Repository name: lookcasquette
echo 3. Keep it PUBLIC
echo 4. DON'T check any boxes
echo 5. Click "Create repository"
echo.
echo STEP 2: Get Your GitHub Username
echo ---------------------------------
echo After creating the repo, copy your username from the URL
echo Example: https://github.com/YOUR_USERNAME/lookcasquette
echo.
set /p username="Enter your GitHub username: "
echo.
echo STEP 3: Connecting to GitHub...
echo ---------------------------------
git remote remove origin 2>nul
git remote add origin https://github.com/%username%/lookcasquette.git
echo.
echo STEP 4: Pushing to GitHub...
echo ---------------------------------
echo You may be asked for GitHub credentials
echo.
git push -u origin main
echo.
if errorlevel 1 (
    echo [ERROR] Push failed!
    echo.
    echo Common fixes:
    echo 1. Make sure you created the GitHub repo
    echo 2. Check your username is correct
    echo 3. Use Personal Access Token instead of password
    echo    Get token at: https://github.com/settings/tokens
    echo.
) else (
    echo ========================================
    echo   SUCCESS! Code is on GitHub
    echo ========================================
    echo.
    echo Your repository: https://github.com/%username%/lookcasquette
    echo.
    echo NEXT: Deploy to Railway
    echo 1. Go to: https://railway.app
    echo 2. Sign in with GitHub
    echo 3. New Project ^> Deploy from GitHub repo
    echo 4. Select: lookcasquette
    echo.
    echo See DEPLOY_TO_RAILWAY.md for full guide
    echo.
)
pause
