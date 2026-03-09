# 🎨 Deploy Frontend

## Your React Frontend is Ready

The frontend can be deployed to any static hosting provider.

## 🌐 Best Hosting Options for React

### 1. Vercel (Recommended)
- Free tier
- Auto-deploys from GitHub
- Built-in CDN
- Custom domains

**Deploy:**
```bash
npm i -g vercel
vercel
```

### 2. Netlify
- Free tier
- Drag & drop deployment
- Auto-deploys from GitHub

**Deploy:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### 3. GitHub Pages
- Free
- Works with GitHub repos

**Deploy:**
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### 4. Cloudflare Pages
- Free
- Fast CDN
- Auto-deploys from GitHub

## 📝 Configuration

### Before Deploying

Update `.env.production`:
```
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Build Command
```bash
npm run build
```

### Output Directory
```
dist/
```

## 🚀 Quick Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Set Environment Variable:**
```bash
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend-domain.com/api
```

5. **Redeploy:**
```bash
vercel --prod
```

## 🚀 Quick Deploy to Netlify

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Deploy:**
```bash
netlify deploy --prod
```

4. **Set Environment Variable:**
- Go to Netlify dashboard
- Site settings → Environment variables
- Add: `VITE_API_BASE_URL` = `https://your-backend-domain.com/api`

## ✅ After Deployment

1. **Update CORS on Backend:**
   - Set `ALLOWED_ORIGINS` to your frontend URL
   - Example: `https://your-app.vercel.app`

2. **Test:**
   - Visit your frontend URL
   - Try browsing products
   - Test admin login

## 📋 Checklist

- [ ] Backend deployed and working
- [ ] Frontend built successfully
- [ ] Environment variable set (VITE_API_BASE_URL)
- [ ] Frontend deployed
- [ ] CORS updated on backend
- [ ] Test: Products load
- [ ] Test: Admin login works
- [ ] Test: Orders can be created

## 🆘 Troubleshooting

**Blank page:**
- Check browser console (F12)
- Verify VITE_API_BASE_URL is set
- Check backend is accessible

**CORS errors:**
- Update ALLOWED_ORIGINS on backend
- Redeploy backend

**API not found:**
- Verify backend URL is correct
- Test: `https://your-backend.com/api/products`
