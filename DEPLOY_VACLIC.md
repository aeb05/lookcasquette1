# 🚀 Deploy to clients.vaclic.ma (cPanel)

## Step-by-Step Deployment Guide

### 📋 What You Need
- cPanel login credentials
- FTP access (FileZilla or cPanel File Manager)
- MySQL database access

---

## Part 1: Deploy Backend (PHP)

### Step 1: Access cPanel
1. Go to: https://clients.vaclic.ma:2083
2. Login with your credentials

### Step 2: Create MySQL Database

1. In cPanel, find **"MySQL Databases"**
2. **Create Database:**
   - Database name: `lookcasquette`
   - Click "Create Database"
3. **Create User:**
   - Username: `lookcasquette_user`
   - Password: (create strong password)
   - Click "Create User"
4. **Add User to Database:**
   - Select user: `lookcasquette_user`
   - Select database: `lookcasquette`
   - Check "ALL PRIVILEGES"
   - Click "Make Changes"
5. **Save these credentials!** You'll need them.

### Step 3: Import Database

1. In cPanel, find **"phpMyAdmin"**
2. Click on your database: `lookcasquette`
3. Click **"Import"** tab
4. Click **"Choose File"**
5. Select: `backend/database.sql` from your computer
6. Click **"Go"** at bottom
7. Wait for success message

### Step 4: Update Database Configuration

1. Open file: `backend/config/database.php`
2. Update with your credentials:

```php
<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        // Update these with your cPanel database credentials
        $this->host = getenv('MYSQL_HOST') ?: 'localhost';
        $this->db_name = getenv('MYSQL_DATABASE') ?: 'your_cpanel_username_lookcasquette';
        $this->username = getenv('MYSQL_USER') ?: 'your_cpanel_username_lookcasquette_user';
        $this->password = getenv('MYSQL_PASSWORD') ?: 'your_database_password';
    }
    // ... rest of code
}
```

**Important:** Replace:
- `your_cpanel_username_lookcasquette` with actual database name
- `your_cpanel_username_lookcasquette_user` with actual username
- `your_database_password` with actual password

### Step 5: Upload Backend Files

**Option A - File Manager (Easier):**
1. In cPanel, open **"File Manager"**
2. Navigate to `public_html/`
3. Create folder: `api` (or `backend`)
4. Upload all files from `backend/` folder to `public_html/api/`
5. Make sure `.htaccess` files are uploaded

**Option B - FTP (FileZilla):**
1. Open FileZilla
2. Connect to: `ftp.vaclic.ma`
3. Username: your cPanel username
4. Password: your cPanel password
5. Upload `backend/` folder to `public_html/api/`

### Step 6: Set Permissions

In File Manager:
1. Right-click `uploads/products/` folder
2. Click "Change Permissions"
3. Set to: `755`
4. Check "Recurse into subdirectories"
5. Click "Change Permissions"

### Step 7: Test Backend

Open browser:
```
https://clients.vaclic.ma/api/api/products
```

Should see: `[]`

---

## Part 2: Deploy Frontend (React)

### Step 1: Build Frontend

On your computer, in project folder:

```bash
# Update API URL
echo VITE_API_BASE_URL=https://clients.vaclic.ma/api/api > .env.production

# Build
npm run build
```

This creates a `dist/` folder.

### Step 2: Upload Frontend

**Using File Manager:**
1. In cPanel File Manager
2. Go to `public_html/`
3. Upload all files from `dist/` folder
4. Files should be directly in `public_html/`, not in a subfolder

**Your structure should be:**
```
public_html/
├── index.html          (from dist/)
├── assets/             (from dist/)
├── api/                (backend folder)
└── .htaccess           (if exists)
```

### Step 3: Create .htaccess for React Router

Create file `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API requests
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>
```

---

## ✅ Testing

### Test Backend:
```
https://clients.vaclic.ma/api/api/products
```
Should return: `[]`

### Test Frontend:
```
https://clients.vaclic.ma
```
Should show your website!

### Test Admin:
```
https://clients.vaclic.ma/admin/login
```
Login:
- Email: `admin@lookcasquette.com`
- Password: `admin123`

---

## 🔧 Troubleshooting

### "500 Internal Server Error"
- Check `.htaccess` files are uploaded
- Check file permissions (755 for folders, 644 for files)
- Check PHP version (should be 8.0+)

### "Database connection error"
- Verify database credentials in `backend/config/database.php`
- Check database name includes cPanel username prefix

### "404 Not Found" on API
- Check backend is in `public_html/api/` folder
- Check `.htaccess` exists in `api/` folder

### Frontend shows blank page
- Check browser console (F12) for errors
- Verify `VITE_API_BASE_URL` in build
- Rebuild with correct API URL

### CORS errors
- Update `backend/config/helpers.php`
- Change `ALLOWED_ORIGINS` to your domain

---

## 📋 Quick Checklist

Backend:
- [ ] MySQL database created
- [ ] Database user created and assigned
- [ ] database.sql imported
- [ ] database.php updated with credentials
- [ ] Backend files uploaded to public_html/api/
- [ ] Permissions set (755 for uploads/)
- [ ] Test: /api/api/products returns []

Frontend:
- [ ] .env.production created with API URL
- [ ] npm run build executed
- [ ] dist/ files uploaded to public_html/
- [ ] .htaccess created for React Router
- [ ] Test: Website loads
- [ ] Test: Admin login works

---

## 🎉 Done!

Your app should now be live at:
- **Frontend:** https://clients.vaclic.ma
- **Backend API:** https://clients.vaclic.ma/api/api/
- **Admin:** https://clients.vaclic.ma/admin/login

**Change admin password immediately after first login!**
