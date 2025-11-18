# Quick Start Guide - Connecting Frontend to Backend

## What We've Done

✅ **Updated Frontend Authentication** - Replaced mock authentication with real API calls
✅ **Created Axios Configuration** - Centralized API configuration with interceptors
✅ **Updated Backend Models** - Added support for subscription plans (trial, monthly, annual)
✅ **Updated Registration Flow** - Backend now saves subscription plan information

## What You Need to Do Next

### 1. Set Up Environment Variables

**Backend (`server/.env` or Vercel environment variables):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vibecheckr
JWT_SECRET=your-super-secret-key-here
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5001
```

**Frontend (`client/.env.production` or Vercel environment variables):**
```env
REACT_APP_API_URL=https://your-backend-api.vercel.app
```

### 2. Set Up MongoDB Atlas (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 free tier)
4. Create database user
5. Whitelist IP (0.0.0.0/0 for development)
6. Get connection string
7. Add to environment variables as `MONGODB_URI`

### 3. Deploy Backend

**Option A: Vercel Serverless Functions**
- See `DEPLOYMENT_GUIDE.md` for detailed instructions
- Requires creating `api/` directory with serverless wrapper

**Option B: Railway (Easiest)**
1. Go to https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Select your repo
5. Add environment variables
6. Deploy!

**Option C: Render**
1. Go to https://render.com
2. New Web Service
3. Connect GitHub repo
4. Build: `cd server && npm install`
5. Start: `node server/index.js`
6. Add environment variables

### 4. Update Frontend API URL

Once backend is deployed:
1. Copy backend URL
2. Add to Vercel frontend environment variables: `REACT_APP_API_URL`
3. Redeploy frontend

### 5. Test It!

1. Go to your deployed frontend
2. Click "Register" or "Start Free Trial"
3. Fill out form and submit
4. Check MongoDB Atlas to see if user/company was created
5. Try logging in with the credentials

## Local Development Setup

1. **Start MongoDB** (if using local):
   ```bash
   brew services start mongodb-community
   ```

2. **Backend**:
   ```bash
   cd server
   npm install
   # Create .env file with MONGODB_URI, JWT_SECRET, etc.
   npm run dev
   ```

3. **Frontend**:
   ```bash
   cd client
   npm install
   # Create .env file with REACT_APP_API_URL=http://localhost:5001
   npm start
   ```

## Files Changed

- ✅ `client/src/config/axios.js` - New axios configuration
- ✅ `client/src/contexts/AuthContext.js` - Real API calls instead of mocks
- ✅ `server/models/Company.js` - Added subscription plan support
- ✅ `server/routes/auth.js` - Handles plan selection during registration

## Next Steps After Basic Setup

1. **Stripe Integration** - Process actual payments
2. **Email Notifications** - Send welcome emails, password resets
3. **Error Monitoring** - Add Sentry or similar
4. **Analytics** - Track user behavior
5. **Custom Domain** - Point your domain to Vercel

## Need Help?

- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Review error logs in your hosting platform
- Check browser console for frontend errors
- Verify all environment variables are set correctly

