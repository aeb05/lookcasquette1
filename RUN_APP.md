# 🚀 How to Run This App

## Step 1: Install XAMPP

1. Download XAMPP: https://www.apachefriends.org/download.html
2. Install it (default location: `C:\xampp`)
3. Open XAMPP Control Panel

## Step 2: Start Services

In XAMPP Control Panel:
- Click **Start** next to Apache
- Click **Start** next to MySQL

Both should show green "Running" status.

## Step 3: Setup Backend

1. Copy the `backend` folder to XAMPP:
```
From: C:\Users\bhj\Desktop\lookcasquette-main\backend
To:   C:\xampp\htdocs\backend
```

2. Import database:
   - Open browser: http://localhost/phpmyadmin
   - Click "Import" tab
   - Click "Choose File"
   - Select: `C:\xampp\htdocs\backend\database.sql`
   - Click "Go" button at bottom
   - Wait for "Import has been successfully finished"

3. Test backend:
   - Open browser: http://localhost/backend/api/products
   - Should see: `[]`

## Step 4: Install Frontend Dependencies

Open Command Prompt in project folder:
```bash
cd C:\Users\bhj\Desktop\lookcasquette-main
npm install
```

Wait for installation to complete (may take 2-3 minutes).

## Step 5: Run Frontend

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 6: Open in Browser

Open: http://localhost:5173

You should see the LOOK CASQUETTE website!

## Step 7: Test Admin Panel

1. Go to: http://localhost:5173/admin/login
2. Login with:
   - Email: `admin@lookcasquette.com`
   - Password: `admin123`
3. You should see the admin dashboard

## ✅ Success!

Your app is now running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost/backend/api
- **Admin Panel**: http://localhost:5173/admin/login

## 🛑 To Stop

- Press `Ctrl+C` in Command Prompt (stops frontend)
- Stop Apache & MySQL in XAMPP Control Panel

## ❌ Troubleshooting

### "npm: command not found"
Install Node.js: https://nodejs.org/

### "Port 80 already in use"
Stop Skype or other apps using port 80, then restart Apache.

### "Connection error" in browser
- Check MySQL is running in XAMPP
- Check database was imported successfully

### Frontend shows blank page
- Check browser console (F12) for errors
- Make sure backend is running at http://localhost/backend/api/products

### Can't login to admin
- Make sure database was imported
- Default password is `admin123`

## 📞 Need Help?

Check these files:
- `QUICKSTART.md` - Detailed setup
- `backend/README.md` - Backend info
- `MIGRATION_GUIDE.md` - Full documentation
