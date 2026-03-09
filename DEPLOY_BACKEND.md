# 🚀 Deploy Backend to Any Host

## Your PHP Backend is Ready

The backend can be deployed to any hosting provider that supports:
- PHP 8.0+
- MySQL/MariaDB
- Apache/Nginx

## 📦 What You Have

- `backend/` - PHP backend files
- `Dockerfile` - For Docker-based hosts
- `backend/database.sql` - Database schema

## 🌐 Hosting Options

### Option 1: Traditional PHP Hosting (cPanel, Hostinger, etc.)

**Steps:**
1. Upload `backend/` folder via FTP
2. Create MySQL database in cPanel
3. Import `backend/database.sql`
4. Update `backend/config/database.php` with your credentials
5. Point domain to `backend/` folder

### Option 2: VPS (DigitalOcean, Linode, AWS EC2)

**Steps:**
1. Install LAMP stack (Linux, Apache, MySQL, PHP)
2. Upload backend files to `/var/www/html/`
3. Import database
4. Configure Apache virtual host
5. Set environment variables

### Option 3: Docker-based Hosts (Render, Fly.io, etc.)

**Steps:**
1. Push code to GitHub
2. Connect repository to hosting platform
3. Platform detects `Dockerfile` and builds
4. Add MySQL database
5. Set environment variables

### Option 4: Vercel/Netlify (Serverless)

**Note:** These don't support PHP directly. You'd need to:
- Convert to serverless functions
- Use Vercel PHP runtime
- Or keep backend separate on PHP host

## 🔧 Configuration Needed

### Environment Variables

Set these on your hosting platform:

```
MYSQL_HOST=your-mysql-host
MYSQL_DATABASE=lookcasquette
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
PUBLIC_URL=https://your-backend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Database

Import `backend/database.sql` to create:
- `products` table
- `orders` table
- `admin_users` table
- `blacklist` table

Default admin:
- Email: `admin@lookcasquette.com`
- Password: `admin123`

## 📝 Frontend Configuration

Update frontend to point to your backend:

**File:** `.env` or `.env.production`
```
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## ✅ Testing

After deployment, test:
```
https://your-backend-domain.com/api/products
```

Should return: `[]`

## 🆘 Need Help?

Choose your hosting provider and I'll give you specific instructions!

Popular options:
- Hostinger
- DigitalOcean
- Render
- Fly.io
- AWS
- Heroku
- Vercel (with PHP runtime)
