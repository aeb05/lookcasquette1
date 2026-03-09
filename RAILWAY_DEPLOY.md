# Deploy to Railway

## 🚂 Step-by-Step Deployment

### 1. Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Git installed

### 2. Push to GitHub

```bash
cd c:\Users\bhj\Desktop\lookcasquette-main

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - PHP backend"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/lookcasquette.git
git branch -M main
git push -u origin main
```

### 3. Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `lookcasquette` repository
5. Railway will detect the Dockerfile automatically

### 4. Add MySQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add MySQL"
3. Railway will create a MySQL instance

### 5. Configure Environment Variables

In Railway project settings, add these variables:

**Backend Service:**
```
MYSQL_HOST=<from MySQL service>
MYSQL_DATABASE=lookcasquette
MYSQL_USER=<from MySQL service>
MYSQL_PASSWORD=<from MySQL service>
PUBLIC_URL=https://your-backend.railway.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

Railway will auto-fill MySQL variables when you connect the database.

### 6. Import Database Schema

**Option A - Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Import database
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < backend/database.sql
```

**Option B - MySQL Client:**
1. Get MySQL connection details from Railway
2. Use MySQL Workbench or phpMyAdmin
3. Import `backend/database.sql`

### 7. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend.railway.app/api
```

### 8. Update CORS

After deploying frontend, update Railway backend env:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## 🔗 Service URLs

After deployment:
- **Backend**: `https://your-backend.railway.app/api`
- **Frontend**: `https://your-frontend.vercel.app`

## ✅ Test Deployment

1. Visit: `https://your-backend.railway.app/api/products`
   - Should return: `[]`

2. Visit: `https://your-frontend.vercel.app`
   - Should load the site

3. Login: `https://your-frontend.vercel.app/admin/login`
   - Email: `admin@lookcasquette.com`
   - Password: `admin123`

## 🔧 Troubleshooting

### Backend won't start
- Check Railway logs
- Verify MySQL connection variables
- Ensure database is imported

### CORS errors
- Update `ALLOWED_ORIGINS` in Railway
- Redeploy backend

### Database connection failed
- Check MySQL service is running
- Verify connection variables match

### Images not uploading
- Check `uploads/products/` folder permissions in Dockerfile
- Verify `PUBLIC_URL` is set correctly

## 📊 Railway Project Structure

```
Railway Project
├── Backend Service (Docker)
│   ├── Environment Variables
│   │   ├── MYSQL_HOST
│   │   ├── MYSQL_DATABASE
│   │   ├── MYSQL_USER
│   │   ├── MYSQL_PASSWORD
│   │   ├── PUBLIC_URL
│   │   └── ALLOWED_ORIGINS
│   └── Domain: your-backend.railway.app
│
└── MySQL Database
    ├── Auto-generated credentials
    └── Connected to Backend Service
```

## 💰 Pricing

Railway offers:
- **Free tier**: $5 credit/month
- **Pro**: $20/month

Your app should fit in free tier for development.

## 🚀 Alternative: Deploy Both on Railway

You can also deploy the frontend on Railway:

1. Create new service in Railway
2. Select "Deploy from GitHub repo"
3. Choose your repo
4. Set build command: `npm run build`
5. Set start command: `npm run preview`
6. Add env: `VITE_API_BASE_URL=https://your-backend.railway.app/api`

## 📝 Post-Deployment

1. **Change admin password** immediately
2. **Set up backups** for MySQL database
3. **Monitor logs** in Railway dashboard
4. **Set up custom domain** (optional)

## ✨ Done!

Your app is now live on Railway! 🎉
