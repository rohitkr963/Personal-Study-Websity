# Render Backend Deployment Instructions

## Environment Variables to Set on Render

1. Go to your Render service dashboard
2. Click on "Environment" tab
3. Add these environment variables:

```
MONGO_URI=mongodb+srv://rohit737heye_db_user:Siwan%40123@cluster0.5du0wtw.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://personal-study-websity.vercel.app
GEMINI_API_KEY=AIzaSyCKtgpMCga-YOYe3QXsbX7wgg_kE1C7wEw
```

## Vercel Frontend Environment Variables

1. Go to your Vercel project settings
2. Click on "Environment Variables"
3. Add:

```
VITE_API_URL=https://personal-study-websity-2.onrender.com
```

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (dev)
- `http://localhost:5174` (dev)
- `https://personal-study-websity.vercel.app` (production)
- Any origin defined in `CORS_ORIGIN` env variable

Make sure `CORS_ORIGIN` is set on Render!
