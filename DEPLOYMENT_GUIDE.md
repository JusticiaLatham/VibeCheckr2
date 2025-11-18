# VibeCheckr Deployment Guide

This guide will help you deploy VibeCheckr from a frontend demo to a fully functional application.

## Prerequisites

1. **GitHub Account** - Your code is already on GitHub
2. **Vercel Account** - For frontend deployment (free tier available)
3. **MongoDB Atlas Account** - For database (free tier available)
4. **Node.js** - Installed locally for development

## Step 1: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free M0 tier)
4. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Save the username and password
5. Whitelist IP addresses:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, add specific IPs
6. Get your connection string:
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vibecheckr?retryWrites=true&w=majority`

### Option B: Local MongoDB (For Development Only)

```bash
# Install MongoDB locally (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

## Step 2: Deploy Backend API

You have several options for deploying the backend:

### Option A: Vercel Serverless Functions (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Create `api/` directory structure**:
   ```bash
   mkdir -p api
   ```

3. **Create `api/index.js`** (serverless wrapper):
   ```javascript
   const app = require('../server/index');
   module.exports = app;
   ```

4. **Update `vercel.json`** to include backend:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.js",
         "use": "@vercel/node"
       },
       {
         "src": "client/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "api/index.js"
       },
       {
         "src": "/(.*)",
         "dest": "client/build/$1"
       }
     ],
     "env": {
       "MONGODB_URI": "@mongodb-uri",
       "JWT_SECRET": "@jwt-secret",
       "CLIENT_URL": "@client-url"
     }
   }
   ```

5. **Deploy to Vercel**:
   ```bash
   vercel login
   vercel
   ```

6. **Set environment variables in Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A strong random string (generate with `openssl rand -base64 32`)
     - `CLIENT_URL`: Your frontend URL
     - `NODE_ENV`: `production`

### Option B: Railway (Alternative)

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your VibeCheckr repository
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `PORT` (Railway sets this automatically)
6. Railway will auto-deploy on every push

### Option C: Render (Alternative)

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `node server/index.js`
   - **Environment**: `Node`
6. Add environment variables (same as above)

## Step 3: Update Frontend Environment Variables

1. **Create `client/.env.production`**:
   ```env
   REACT_APP_API_URL=https://your-backend-api.vercel.app
   ```

2. **Update Vercel frontend deployment**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `REACT_APP_API_URL` with your backend URL

## Step 4: Deploy Frontend to Vercel

1. **If not already deployed**:
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   - Add environment variable: `REACT_APP_API_URL`

2. **Vercel will auto-deploy** on every push to main branch

## Step 5: Test the Deployment

1. **Test Registration**:
   - Go to your deployed frontend URL
   - Click "Register" or "Start Free Trial"
   - Fill out the registration form
   - Submit and verify user is created

2. **Test Login**:
   - Log out
   - Log back in with the credentials you just created
   - Verify you can access the dashboard

3. **Check Backend Logs**:
   - Vercel: Go to Deployments → Click on deployment → View Function Logs
   - Railway: Go to Deployments → View Logs
   - Render: Go to Logs tab

## Step 6: Set Up Stripe (For Payments)

1. **Create Stripe Account**:
   - Go to [Stripe](https://stripe.com)
   - Sign up and get your API keys

2. **Add Stripe Keys**:
   - Backend: Add `STRIPE_SECRET_KEY` to environment variables
   - Frontend: Add `REACT_APP_STRIPE_PUBLISHABLE_KEY` to environment variables

3. **Implement Stripe Integration** (Future):
   - Create payment intent on backend
   - Handle webhooks for subscription updates
   - Update Company model with Stripe customer ID

## Troubleshooting

### Backend Not Connecting to Database
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Verify database user credentials

### CORS Errors
- Ensure `CLIENT_URL` in backend matches your frontend URL
- Check CORS configuration in `server/index.js`

### Authentication Not Working
- Verify `JWT_SECRET` is set in backend
- Check that frontend `REACT_APP_API_URL` points to correct backend
- Check browser console for API errors

### Build Failures
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs for specific errors

## Next Steps

1. **Set up email notifications** (SMTP configuration)
2. **Implement Stripe payment processing**
3. **Set up monitoring** (Sentry, LogRocket, etc.)
4. **Configure custom domain** in Vercel
5. **Set up CI/CD** (already done with Vercel auto-deploy)
6. **Add error tracking** and analytics

## Support

For issues or questions:
- Check the logs in your hosting platform
- Review the error messages in browser console
- Verify all environment variables are set correctly

