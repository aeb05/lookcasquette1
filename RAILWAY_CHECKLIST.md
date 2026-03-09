# ✅ Railway Deployment Checklist

## Before You Start

- [ ] GitHub account created
- [ ] Railway account created (https://railway.app)
- [ ] Git installed on your computer

## Step-by-Step

### 1️⃣ Push to GitHub

```bash
# Run this in your project folder
cd c:\Users\bhj\Desktop\lookcasquette-main

# Or just double-click: deploy-railway.bat
```

Then:
1. Go to https://github.com/new
2. Create repo named: `lookcasquette`
3. Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/lookcasquette.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy Backend

1. Go to https://railway.app
2. Click **"New Project"**
3. Click **"Deploy from GitHub repo"**
4. Select `lookcasquette`
5. Wait for deployment (Railway detects Dockerfile)

### 3️⃣ Add MySQL

1. In Railway project, click **"New"**
2. Select **"Database"** → **"Add MySQL"**
3. Done! (Railway auto-connects it)

### 4️⃣ Set Backend Variables

Click Backend service → Variables tab → Add:
- `MYSQL_DATABASE` = `lookcasquette`
- `PUBLIC_URL` = (copy from Domains tab)
- `ALLOWED_ORIGINS` = `*`

### 5️⃣ Import Database

```bash
npm i -g @railway/cli
railway login
railway link
railway run mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD lookcasquette < backend/database.sql
```

### 6️⃣ Test Backend

Open: `https://your-backend.railway.app/api/products`
Should see: `[]`

### 7️⃣ Deploy Frontend

1. In Railway, click **"New"** → **"GitHub Repo"**
2. Select same repo → **"Create new service"**
3. Settings tab:
   - Build: `npm run build`
   - Start: `npx vite preview --host 0.0.0.0 --port $PORT`
4. Variables tab:
   - `VITE_API_BASE_URL` = `https://your-backend.railway.app/api`
5. Settings → **"Generate Domain"**

### 8️⃣ Update CORS

1. Backend service → Variables
2. Change `ALLOWED_ORIGINS` = `https://your-frontend.railway.app`

## ✅ Done!

Your app is live at: `https://your-frontend.railway.app`

Login:
- Email: `admin@lookcasquette.com`
- Password: `admin123`

## 📁 Files Created

- ✅ `Dockerfile` - Backend container
- ✅ `railway.json` - Railway config
- ✅ `nixpacks.toml` - Frontend config
- ✅ `vite.config.ts` - Updated for Railway
- ✅ `deploy-railway.bat` - Deployment script

## 💡 Tips

- Railway free tier: $5/month credit
- Check logs if something fails
- Use Railway CLI for database import
- Update CORS after frontend is deployed

## 🆘 Need Help?

See `DEPLOY_TO_RAILWAY.md` for detailed guide
