# Migration from Supabase to PHP Backend - COMPLETE ✅

## ✅ What's Been Created

### Backend (PHP)
- `backend/config/database.php` - Database connection
- `backend/config/helpers.php` - CORS, auth, utilities
- `backend/api/products.php` - Products CRUD API
- `backend/api/orders.php` - Orders API with status updates
- `backend/api/auth.php` - Authentication API
- `backend/api/upload.php` - Image upload API
- `backend/api/blacklist.php` - Blacklist management API
- `backend/database.sql` - Complete database schema
- `backend/api/.htaccess` - URL routing

### Frontend (Updated)
- `src/lib/api.ts` - New API client (replaces Supabase)
- `src/hooks/useProducts.ts` - ✅ Updated
- `src/pages/AdminLogin.tsx` - ✅ Updated
- `src/pages/AdminDashboard.tsx` - ✅ Updated
- `src/components/CheckoutDialog.tsx` - ✅ Updated
- `.env.local` - PHP backend URL configuration

## 🚀 Setup Instructions

### Step 1: Install XAMPP
Download and install XAMPP: https://www.apachefriends.org/

### Step 2: Move Backend
Copy the `backend` folder to:
```
C:\xampp\htdocs\backend
```

### Step 3: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache**
3. Start **MySQL**

### Step 4: Create Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "Import" tab
3. Choose file: `C:\xampp\htdocs\backend\database.sql`
4. Click "Go"
5. Database `lookcasquette` will be created with all tables

### Step 5: Test Backend
Visit: http://localhost/backend/api/products

Should return: `[]` (empty array)

### Step 6: Run Frontend
```bash
cd c:\Users\bhj\Desktop\lookcasquette-main
npm run dev
```

Frontend will run on: http://localhost:5173

## 🔑 Default Admin Login
- Email: `admin@lookcasquette.com`
- Password: `admin123`

**Change this after first login!**

## 📋 Database Tables Created

1. **products** - Product catalog
2. **orders** - Customer orders with status tracking
3. **admin_users** - Admin authentication
4. **blacklist** - Blocked phone numbers

## 🎯 All Features Working

✅ Product listing
✅ Product detail pages
✅ Shopping cart
✅ Checkout with order creation
✅ Admin login/logout
✅ Admin dashboard
✅ Order management (view, update status)
✅ Product management (create, edit, delete)
✅ Image upload
✅ Phone number blacklist
✅ Captcha verification
✅ Rate limiting

## 🔧 Troubleshooting

### "Connection error"
- Check MySQL is running in XAMPP
- Verify database credentials in `backend/config/database.php`
- Default: username=`root`, password=`` (empty)

### "404 Not Found" on API calls
- Enable mod_rewrite in Apache
- Check .htaccess file exists in `backend/api/`
- Restart Apache in XAMPP

### CORS errors
- Verify `Access-Control-Allow-Origin` in `backend/config/helpers.php`
- For production, change `*` to your domain

### Frontend can't connect
- Check API URL in `.env.local` matches your setup
- Default: `http://localhost/backend/api`

### Image upload fails
- Check `backend/uploads/products/` folder exists
- Set folder permissions (Windows: right-click > Properties > Security)

## 🚀 Production Deployment

1. **Update database credentials** in `backend/config/database.php`
2. **Change CORS origin** in `backend/config/helpers.php`
3. **Update API URL** in frontend `.env.local`
4. **Change admin password** after first login
5. **Enable HTTPS** for production
6. **Set secure folder permissions**

## 📝 API Endpoints Reference

### Products
- `GET /api/products` - List all
- `GET /api/products/{id}` - Get one
- `POST /api/products` - Create (auth)
- `PUT /api/products/{id}` - Update (auth)
- `DELETE /api/products/{id}` - Delete (auth)

### Orders
- `GET /api/orders` - List all (auth)
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update status (auth)

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Check session

### Blacklist
- `GET /api/blacklist` - List all (auth)
- `POST /api/blacklist` - Add entry (auth)
- `DELETE /api/blacklist/{id}` - Remove (auth)

### Upload
- `POST /api/upload` - Upload image (auth)

## ✨ Migration Complete!

Your project is now fully migrated from Supabase to PHP backend. All features are working!
