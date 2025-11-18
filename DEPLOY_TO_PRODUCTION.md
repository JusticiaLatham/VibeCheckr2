# Deploy VibeCheckr to Production - Step by Step

## Overview
You need to deploy:
1. **Backend** (Node.js/Express) → Railway or Render
2. **Frontend** (React) → Vercel
3. **Database** → MongoDB Atlas (already set up!)

---

## Step 1: Deploy Backend to Railway (Easiest Option)

### 1.1 Sign up for Railway
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with your GitHub account

### 1.2 Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `VibeCheckr2` repository
4. Railway will auto-detect it's a Node.js project

### 1.3 Configure the Project
1. Railway will show your project settings
2. Click on the project to open settings
3. Go to "Settings" tab
4. Set these:
   - **Root Directory**: Leave blank (or set to `server` if needed)
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && node index.js`

### 1.4 Add Environment Variables
1. In Railway, go to "Variables" tab
2. Click "New Variable"
3. Add these one by one:

```
MONGODB_URI=mongodb+srv://justicialatham:Absurdlion2019!@vibecheckr1.uvazclg.mongodb.net/vibecheckr?retryWrites=true&w=majority
```

```
JWT_SECRET=your-super-secret-key-here-make-this-random
```

```
CLIENT_URL=https://your-frontend-url.vercel.app
```

```
NODE_ENV=production
```

**Note**: Generate a secure JWT_SECRET:
- Go to: https://www.grc.com/passwords.htm
- Copy a 64-character random password
- Use that as your JWT_SECRET

### 1.5 Get Your Backend URL
1. After deployment, Railway will give you a URL like: `https://your-app.up.railway.app`
2. Copy this URL - you'll need it for the frontend

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Sign up for Vercel
1. Go to https://vercel.com
2. Sign up with your GitHub account

### 2.2 Import Your Project
1. Click "Add New Project"
2. Import your `VibeCheckr2` repository
3. Vercel will auto-detect it's a React app

### 2.3 Configure Build Settings
1. In the project settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 2.4 Add Environment Variables
1. Go to "Settings" → "Environment Variables"
2. Add this variable:

```
REACT_APP_API_URL=https://your-backend-url.up.railway.app
```

**Important**: Replace `your-backend-url.up.railway.app` with your actual Railway backend URL from Step 1.5

### 2.5 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Vercel will give you a URL like: `https://vibecheckr2.vercel.app`

---

## Step 3: Update Backend CORS Settings

### 3.1 Update CLIENT_URL in Railway
1. Go back to Railway
2. Update the `CLIENT_URL` variable to your Vercel URL:
   ```
   CLIENT_URL=https://your-vercel-url.vercel.app
   ```
3. Railway will automatically redeploy

---

## Step 4: Test Your Live Site

1. Go to your Vercel URL (e.g., `https://vibecheckr2.vercel.app`)
2. Try registering with the demo account:
   - Email: `demo@vibecheckr.com`
   - Password: `demo123`
3. Verify everything works!

---

## Step 5: Set Up Custom Domain (Optional)

### 5.1 In Vercel
1. Go to your project → "Settings" → "Domains"
2. Add your custom domain (e.g., `vibecheckr.com`)
3. Follow Vercel's instructions to update your DNS

### 5.2 Update Environment Variables
1. Update `CLIENT_URL` in Railway to your custom domain
2. Update `REACT_APP_API_URL` in Vercel if needed

---

## Troubleshooting

### Backend not connecting to database
- Check `MONGODB_URI` in Railway is correct
- Verify MongoDB Atlas IP whitelist includes Railway's IPs (or use 0.0.0.0/0)

### Frontend can't reach backend
- Check `REACT_APP_API_URL` in Vercel matches your Railway URL
- Make sure Railway backend is running (check Railway dashboard)

### CORS errors
- Verify `CLIENT_URL` in Railway matches your Vercel URL exactly
- Check backend logs in Railway for CORS errors

### 500 errors
- Check Railway logs: Click on your project → "Deployments" → Click latest deployment → "View Logs"
- Check Vercel logs: Project → "Deployments" → Click latest → "View Function Logs"

---

## Quick Reference

**Backend (Railway):**
- URL: `https://your-app.up.railway.app`
- Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`

**Frontend (Vercel):**
- URL: `https://your-app.vercel.app`
- Environment Variable: `REACT_APP_API_URL`

**Database:**
- MongoDB Atlas (already set up)
- Connection string in `MONGODB_URI`

---

## Next Steps After Deployment

1. ✅ Test registration and login
2. ✅ Test demo account functionality
3. ✅ Set up error monitoring (Sentry, LogRocket)
4. ✅ Set up analytics (Google Analytics, Mixpanel)
5. ✅ Configure custom domain
6. ✅ Set up SSL certificates (automatic with Vercel/Railway)

---

## Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

