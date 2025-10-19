# Restaurant Reservations Backend - Vercel Deployment

## Deployment Steps

### 1. Prerequisites
- Vercel CLI installed (`npm i -g vercel`)
- MongoDB Atlas database URL
- All environment variables ready

### 2. Environment Variables
Set these in Vercel Dashboard or via CLI:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### 3. Deploy from Backend Folder

```bash
cd backend
vercel --prod
```

### 4. Or Deploy via Vercel Dashboard
1. Go to vercel.com
2. Import your repository
3. Set **Root Directory** to `backend`
4. Add environment variables
5. Deploy

### 5. Test Your Deployment
After deployment, visit:
- `https://your-backend.vercel.app/` - Should show API status
- `https://your-backend.vercel.app/api` - Should show available endpoints

## Important Notes

- File uploads (`/uploads`) in serverless functions are temporary. Consider using cloud storage (AWS S3, Cloudinary) for production.
- MongoDB connections are cached for better performance in serverless environment.
- Logs are available in Vercel Dashboard > Your Project > Logs

## Troubleshooting

### FUNCTION_INVOCATION_FAILED Error
- Check Vercel logs for detailed error messages
- Verify all environment variables are set
- Ensure MongoDB URI is correct and accessible
- Check that all dependencies are in `package.json`

### 404 NOT_FOUND Error
- Verify `vercel.json` routing is correct
- Ensure you're deploying from the `backend` folder
- Check that Root Directory is set to `backend` in Vercel Dashboard

### CORS Errors
- Update `FRONTEND_URL` environment variable with your actual frontend URL
- Frontend must use the Vercel backend URL in API calls

