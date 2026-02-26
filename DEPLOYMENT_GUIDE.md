# Railway Deployment Guide - Separate Backend and Frontend

This guide explains how to deploy the backend and frontend as separate services on Railway.

## Prerequisites

1. A Railway account
2. The Railway CLI installed (optional but recommended)
3. Your GROQ_API_KEY ready

## Deploying the Backend

1. **Create a new Railway project**
   - Go to [Railway](https://railway.app) and create a new project
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account and select the repository
   - Set the "Root Directory" to `backend`
   - Click "Deploy"

2. **Configure environment variables**
   - In the Railway project, go to "Variables" tab
   - Add `GROQ_API_KEY` with your API key
   - Add `NODE_ENV` with value `production`
   - Add `PORT` with value `3000` (or leave it to Railway's default)

3. **Wait for deployment**
   - Railway will automatically build and deploy your backend
   - Once deployed, note the public URL (e.g., `https://your-backend.railway.app`)

## Deploying the Frontend

1. **Create a second Railway project** (or use the same project as a separate service)
   - Go to [Railway](https://railway.app) and create a new project
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account and select the same repository
   - Set the "Root Directory" to `frontend`
   - Click "Deploy"

2. **Configure environment variables**
   - In the Railway project, go to "Variables" tab
   - Add `REACT_APP_API_BASE` with the backend's public URL (from step 3 above)
   - Add `NODE_ENV` with value `production`
   - Add `PORT` with value `3000` (or leave it to Railway's default)

3. **Wait for deployment**
   - Railway will automatically build and deploy your frontend
   - Once deployed, you can access your application through the frontend's public URL

## Configuration Summary

### Backend (.railway files in /backend)
- **Dockerfile.railway**: Production-ready Docker image with Node.js
- **railway.json**: Railway-specific configuration
- **Environment variables needed**: GROQ_API_KEY

### Frontend (.railway files in /frontend)
- **Dockerfile.railway**: Production-ready Docker image with Nginx
- **railway.json**: Railway-specific configuration  
- **nginx.conf**: Updated to handle dynamic port and API proxy
- **Environment variables needed**: REACT_APP_API_BASE (should point to backend URL)

## Testing the Application

1. Open the frontend URL in your browser
2. Try sending a message
3. The frontend should connect to the backend and return AI responses

## Troubleshooting

### Frontend can't connect to backend
- Verify `REACT_APP_API_BASE` environment variable is set correctly
- Check that the backend is running and accessible
- Check browser console for CORS errors (backend should handle CORS)

### Backend not responding
- Verify `GROQ_API_KEY` is set correctly
- Check Railway logs for errors
- Ensure the backend service is running

## CI/CD with GitHub

For automated deployments:
1. Set up GitHub integration in Railway
2. Configure your production environment
3. Push changes to your main branch
4. Railway will automatically rebuild and deploy

## Resources

- [Railway Documentation](https://docs.railway.app/)
- [Deploying React Apps on Railway](https://docs.railway.app/deploy/react)
- [Deploying Node.js Apps on Railway](https://docs.railway.app/deploy/nodejs)
