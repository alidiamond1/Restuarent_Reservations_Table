# Restaurant Reservations Frontend - Vercel Deployment

## Quick Deployment Guide

### 1. Prerequisites
- Your backend deployed on Vercel (e.g., `https://restuarent-reservations-table-backe.vercel.app`)
- Vercel account

### 2. Deploy Frontend

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - Click "Environment Variables"
   - Add: 
     ```
     VITE_API_URL = https://restuarent-reservations-table-backe.vercel.app/api
     ```
     ⚠️ **IMPORTANT**: Replace with your actual backend URL (no trailing slash on /api)

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Navigate to frontend folder
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# When prompted, set environment variable:
# VITE_API_URL=https://your-backend.vercel.app/api
```

### 3. Update Backend CORS

After deployment, update your backend's `FRONTEND_URL` environment variable:

1. Go to your backend project in Vercel Dashboard
2. Settings → Environment Variables
3. Update or add:
   ```
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
4. Redeploy backend for changes to take effect

### 4. Test Your Deployment

Visit your frontend URL and test:
- ✅ Homepage loads
- ✅ Registration works
- ✅ Login works
- ✅ Make a reservation
- ✅ Admin dashboard (if admin user)

## Local Development

For local development, create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Then run:
```bash
npm run dev
```

## Troubleshooting

### API Calls Failing
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Ensure backend CORS includes your frontend URL
- Check that backend is deployed and running

### 404 on Page Refresh
- `vercel.json` handles SPA routing automatically
- All routes redirect to `index.html`

### Images Not Loading
- Profile pictures and uploads are stored on backend
- Ensure API URL in environment variable is correct
- For production, consider using cloud storage (AWS S3, Cloudinary)

## Important Notes

- Environment variables in Vite must start with `VITE_`
- After changing environment variables, redeploy the frontend
- CORS must be configured on backend to accept frontend domain
- File uploads in serverless backend are temporary; use cloud storage for production

## Build Locally

To test the production build locally:

```bash
npm run build
npm run preview
```

## Deployment Checklist

- [ ] Backend deployed and working
- [ ] `VITE_API_URL` set to backend URL
- [ ] Backend `FRONTEND_URL` set to frontend URL
- [ ] CORS configured correctly on backend
- [ ] Test all features after deployment
- [ ] Check browser console for errors
