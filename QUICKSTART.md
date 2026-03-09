# Quick Start - PHP Backend

## 🚀 5-Minute Setup

### 1. Install XAMPP
Download: https://www.apachefriends.org/download.html

### 2. Copy Backend
```
Move: backend/ → C:\xampp\htdocs\backend\
```

### 3. Start Services
Open XAMPP Control Panel:
- ✅ Start Apache
- ✅ Start MySQL

### 4. Import Database
1. Go to: http://localhost/phpmyadmin
2. Click "Import"
3. Choose: `C:\xampp\htdocs\backend\database.sql`
4. Click "Go"

### 5. Test API
Visit: http://localhost/backend/api/products
✅ Should see: `[]`

### 6. Run Frontend
```bash
npm run dev
```
Visit: http://localhost:5173

### 7. Login as Admin
- URL: http://localhost:5173/admin/login
- Email: `admin@lookcasquette.com`
- Password: `admin123`

## ✅ Done!

Your e-commerce site is now running with PHP backend!

## 📁 Project Structure

```
lookcasquette-main/
├── backend/                    # PHP Backend
│   ├── api/                   # API Endpoints
│   │   ├── products.php       # Products CRUD
│   │   ├── orders.php         # Orders + Status
│   │   ├── auth.php           # Login/Logout
│   │   ├── blacklist.php      # Phone blocking
│   │   └── upload.php         # Image upload
│   ├── config/
│   │   ├── database.php       # DB connection
│   │   └── helpers.php        # Utilities
│   ├── uploads/products/      # Product images
│   └── database.sql           # DB schema
│
├── src/                       # React Frontend
│   ├── lib/api.ts            # API client
│   ├── hooks/useProducts.ts  # Product hooks
│   ├── pages/
│   │   ├── AdminLogin.tsx    # ✅ Updated
│   │   └── AdminDashboard.tsx # ✅ Updated
│   └── components/
│       └── CheckoutDialog.tsx # ✅ Updated
│
└── MIGRATION_GUIDE.md         # Full documentation
```

## 🔑 Key Files

- **Database Config**: `backend/config/database.php`
- **API Client**: `src/lib/api.ts`
- **Environment**: `.env.local`

## 🛠️ Common Issues

**API returns 404?**
→ Restart Apache in XAMPP

**Can't connect to database?**
→ Check MySQL is running

**CORS errors?**
→ Check `backend/config/helpers.php`

## 📞 Support

Check `MIGRATION_GUIDE.md` for detailed troubleshooting.
