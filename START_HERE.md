# 🚀 START HERE - Quick Setup

## Prerequisites

✅ Node.js installed (you have v25.2.1)
✅ npm installed (you have v11.7.0)
❓ XAMPP installed?

## Step 1: Install XAMPP (if not installed)

1. Download: https://www.apachefriends.org/download.html
2. Run installer (use default settings)
3. Install to: `C:\xampp`

## Step 2: Setup Backend

**Double-click:** `setup-backend.bat`

This will:
- Copy backend to XAMPP
- Check if services are running

## Step 3: Start XAMPP Services

1. Open **XAMPP Control Panel** (search in Windows)
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**
4. Both should show green "Running"

## Step 4: Import Database

1. Open browser: http://localhost/phpmyadmin
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Select: `C:\xampp\htdocs\backend\database.sql`
5. Click **"Go"** at bottom
6. Wait for success message

## Step 5: Run the App

**Double-click:** `start-app.bat`

The app will start and open at: http://localhost:5173

## 🎉 Done!

Your app is running:
- **Website**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
  - Email: `admin@lookcasquette.com`
  - Password: `admin123`

## 🛑 To Stop

Press `Ctrl+C` in the command window

## ❌ Problems?

### "XAMPP not found"
Install XAMPP from link above

### "Apache/MySQL not running"
Open XAMPP Control Panel and start them

### "Backend not found"
Run `setup-backend.bat` first

### "Database connection error"
Import database in phpMyAdmin (Step 4)

### Port 80 already in use
1. Close Skype or other apps
2. Restart Apache in XAMPP

## 📁 Quick Reference

- `setup-backend.bat` - Setup backend (run once)
- `start-app.bat` - Start the app (run every time)
- `RUN_APP.md` - Detailed instructions
- `backend/database.sql` - Database file to import
