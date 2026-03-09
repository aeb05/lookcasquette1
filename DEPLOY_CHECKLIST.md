# Railway Deployment Checklist

## ✅ Pre-Deployment

- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] Railway account created
- [ ] Vercel account created (for frontend)

## 🚂 Railway Backend Setup

- [ ] Create new Railway project
- [ ] Deploy from GitHub repo
- [ ] Add MySQL database service
- [ ] Connect MySQL to backend service
- [ ] Import database schema (`backend/database.sql`)
- [ ] Set environment variables:
  - [ ] `MYSQL_HOST` (auto-filled)
  - [ ] `MYSQL_DATABASE` = `lookcasquette`
  - [ ] `MYSQL_USER` (auto-filled)
  - [ ] `MYSQL_PASSWORD` (auto-filled)
  - [ ] `PUBLIC_URL` = `https://your-backend.railway.app`
  - [ ] `ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
- [ ] Wait for deployment to complete
- [ ] Test: Visit `https://your-backend.railway.app/api/products`

## 🌐 Vercel Frontend Setup

- [ ] Run `vercel` in project root
- [ ] Set environment variable:
  - [ ] `VITE_API_BASE_URL` = `https://your-backend.railway.app/api`
- [ ] Deploy with `vercel --prod`
- [ ] Test: Visit your Vercel URL

## 🔄 Post-Deployment

- [ ] Update `ALLOWED_ORIGINS` in Railway with actual Vercel URL
- [ ] Redeploy Railway backend
- [ ] Test full flow:
  - [ ] Browse products
  - [ ] Add to cart
  - [ ] Checkout (create order)
  - [ ] Admin login
  - [ ] View orders
  - [ ] Manage products
- [ ] Change admin password
- [ ] Set up custom domain (optional)

## 🎯 URLs to Save

```
Backend API: https://_____.railway.app/api
Frontend: https://_____.vercel.app
Admin: https://_____.vercel.app/admin/login
```

## 🆘 If Something Fails

1. Check Railway logs: Project → Service → Logs
2. Check browser console for errors
3. Verify environment variables
4. Ensure database is imported
5. Check CORS settings

## 📞 Support

See `RAILWAY_DEPLOY.md` for detailed instructions.
