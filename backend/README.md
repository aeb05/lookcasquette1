# PHP Backend Setup

## Requirements
- PHP 8.0+
- MySQL 5.7+ or MariaDB
- Apache with mod_rewrite enabled
- XAMPP/WAMP/MAMP (recommended for local development)

## Installation Steps

### 1. Database Setup
```bash
# Import the database schema
mysql -u root -p < database.sql
```

Or use phpMyAdmin:
- Open phpMyAdmin (http://localhost/phpmyadmin)
- Create database `lookcasquette`
- Import `database.sql` file

### 2. Configure Database Connection
Edit `config/database.php` and update:
```php
private $host = "localhost";
private $db_name = "lookcasquette";
private $username = "root";
private $password = ""; // Your MySQL password
```

### 3. Setup Apache
Place the `backend` folder in your web server root:
- XAMPP: `C:\xampp\htdocs\backend`
- WAMP: `C:\wamp64\www\backend`
- MAMP: `/Applications/MAMP/htdocs/backend`

Enable mod_rewrite in Apache config.

### 4. Test API
Visit: http://localhost/backend/api/products

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/{id}` - Update product (requires auth)
- `DELETE /api/products/{id}` - Delete product (requires auth)

### Orders
- `GET /api/orders` - Get all orders (requires auth)
- `POST /api/orders` - Create order

### Authentication
- `POST /api/auth/login` - Login (email: admin@lookcasquette.com, password: admin123)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Check session

### Upload
- `POST /api/upload` - Upload image (requires auth)

## Default Admin Credentials
- Email: admin@lookcasquette.com
- Password: admin123

**Change this after first login!**

## CORS
CORS is enabled for all origins. For production, update `config/helpers.php`:
```php
header("Access-Control-Allow-Origin: https://yourdomain.com");
```

## File Uploads
Images are stored in `uploads/products/`
Make sure this directory has write permissions (chmod 755).
