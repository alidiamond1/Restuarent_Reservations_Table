# 🚀 Deployment Steps - IMMEDIATE ACTIONS REQUIRED

## 1. Backend - Redeploy (CORS Fix Applied)

The backend code has been updated with the correct CORS configuration. You need to redeploy:

```bash
cd backend
vercel --prod
```

## 2. Frontend - Set Environment Variable in Vercel

⚠️ **CRITICAL**: You need to add the environment variable in Vercel Dashboard:

### Steps:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **frontend** project: `restuarent-reservations-table`
3. Go to **Settings** → **Environment Variables**
4. Add the following:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://restuarent-reservations-table-backe.vercel.app/api`
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** tab
7. Find your latest deployment
8. Click the **⋯** (three dots) menu → **Redeploy**

## 3. Backend - Update FRONTEND_URL Environment Variable

In your **backend** Vercel project settings:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **backend** project
3. Go to **Settings** → **Environment Variables**
4. Update or add:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://restuarent-reservations-table.vercel.app`
   - **Environment**: Select all
5. Click **Save**
6. **Redeploy** the backend

## 4. Install Tailwind CSS Dependencies

In your local frontend folder, run:

```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
```

Then commit and push the changes to trigger a new deployment.

## 5. Verify Everything Works

After redeploying both:

### Test Backend:
Visit: `https://restuarent-reservations-table-backe.vercel.app/`
- Should show: "Restaurant Reservations API is running!"

### Test Frontend:
1. Visit: `https://restuarent-reservations-table.vercel.app`
2. Try to register a new user
3. Check browser console for errors

## Current Issues Fixed:
✅ Removed trailing slash from CORS allowed origins
✅ Added proper Tailwind CSS configuration (no more CDN warning)
✅ Created custom restaurant icon and favicon
✅ Added proper meta tags for SEO
✅ Updated backend CORS to allow your frontend domain

## Quick Fix - If Still Getting 404:

If you still get 404 after setting environment variables, the frontend is probably using the fallback URL. 

**Temporary Solution**: Update the fallback in `frontend/src/utils/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://restuarent-reservations-table-backe.vercel.app/api'
```

But **ALWAYS** set the environment variable in Vercel - don't rely on the fallback!

---

## Summary:
1. ✅ Backend CORS fixed - **REDEPLOY BACKEND**
2. ⚠️ Frontend needs `VITE_API_URL` environment variable - **SET IN VERCEL**
3. ⚠️ Backend needs `FRONTEND_URL` environment variable - **SET IN VERCEL**
4. ⚠️ Install Tailwind dependencies - **RUN NPM INSTALL**
5. ⚠️ Redeploy both frontend and backend after setting variables

