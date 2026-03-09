# 🚂 Deploy to Railway - Simple Guide

## Step 1: Push to GitHub

```bash
cd c:\Users\bhj\Desktop\lookcasquette-main

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/lookcasquette.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend on Railway

1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Click **"Deploy from GitHub repo"**
5. Select your `lookcasquette` repository
6. Railway will detect Dockerfile and deploy automatically

## Step 3: Add MySQL Database

1. In your Railway project, click **"New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway creates MySQL automatically

## Step 4: Connect Database to Backend

1. Click on your **Backend service**
2. Go to **"Variables"** tab
3. Click **"Add Reference"** → Select MySQL database
4. Railway auto-fills these variables:
   - `MYSQL_HOST`
   - `MYSQL_DATABASE` 
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
5. Add manually:
   - `MYSQL_DATABASE` = `lookcasquette` (if not set)
   - `PUBLIC_URL` = (copy from "Domains" tab, like `https://xxx.railway.app`)
   - `ALLOWED_ORIGINS` = `*` (change later to your frontend URL)

## Step 5: Import Database

**Option A - Railway CLI:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Connect to MySQL and import
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < backend/database.sql
```

**Option B - MySQL Client:**
1. Get MySQL connection details from Railway
2. Use MySQL Workbench or any MySQL client
3. Connect and import `backend/database.sql`

## Step 6: Test Backend

1. Go to your backend service in Railway
2. Click **"Domains"** tab
3. Copy the URL (like `https://xxx.railway.app`)
4. Open in browser: `https://xxx.railway.app/api/products`
5. Should see: `[]`

## Step 7: Deploy Frontend on Railway

1. In Railway project, click **"New"**
2. Click **"GitHub Repo"** → Select same repo
3. Railway will ask which service - select **"Create new service"**
4. Go to **"Settings"** tab:
   - **Root Directory**: leave empty
   - **Build Command**: `npm run build`
   - **Start Command**: `npx vite preview --host 0.0.0.0 --port $PORT`
5. Go to **"Variables"** tab, add:
   - `VITE_API_BASE_URL` = `https://your-backend.railway.app/api`

## Step 8: Generate Domain for Frontend

1. Click on Frontend service
2. Go to **"Settings"** tab
3. Click **"Generate Domain"**
4. Copy the URL

## Step 9: Update CORS

1. Go back to Backend service
2. Go to **"Variables"** tab
3. Update `ALLOWED_ORIGINS` = `https://your-frontend.railway.app`
4. Backend will redeploy automatically

## ✅ Done!

Your app is live:
- **Frontend**: `https://your-frontend.railway.app`
- **Backend**: `https://your-backend.railway.app/api`
- **Admin**: `https://your-frontend.railway.app/admin/login`

## 🔑 Login

- Email: `admin@lookcasquette.com`
- Password: `admin123`

## 💰 Cost

Railway free tier: $5 credit/month (enough for testing)

## ❌ Troubleshooting

### Backend won't start
- Check logs in Railway dashboard
- Verify MySQL variables are set
- Make sure database is imported

### Frontend blank page
- Check `VITE_API_BASE_URL` is set correctly
- Check browser console (F12) for errors
- Verify backend is working

### CORS errors
- Update `ALLOWED_ORIGINS` in backend
- Redeploy backend

### Database connection failed
- Check MySQL service is running
- Verify connection variables
- Try importing database again
