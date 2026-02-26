# Railway Deployment Guide

This document provides step-by-step instructions for deploying the Streaming AI Chatbot to Railway using Docker.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Groq API Key**: Get your API key from [console.groq.com](https://console.groq.com)
3. **Docker**: Install Docker locally for testing
4. **GitHub Repository**: Push your code to GitHub (Railway can connect directly to GitHub)

## Docker-Based Deployment

### Option 1: Deploy Backend with Docker

The project includes a [backend/Dockerfile](backend/Dockerfile) configured for Railway:

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add the required environment variables:
   - `GROQ_API_KEY` = your-groq-api-key
   - `GROQ_MODEL` = openai/gpt-oss-120b (optional)
5. Railway will automatically detect the `railway.json` with Docker configuration
6. Click "Deploy"

### Option 2: Deploy with Docker Compose (Local Testing)

For local testing, use Docker Compose:

```bash
# Create .env file with your API key
echo "GROQ_API_KEY=your-groq-api-key" > .env
echo "GROQ_MODEL=openai/gpt-oss-120b" >> .env

# Build and run containers
docker-compose up --build

# Access the app
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

### Option 3: Deploy Frontend + Backend Separately

For a more scalable architecture, deploy frontend and backend as separate Railway services:

#### Backend Service
- Use `backend/Dockerfile`
- Set environment variables: `GROQ_API_KEY`, `GROQ_MODEL`
- Exposes port 3000

#### Frontend Service
- Use `frontend/Dockerfile`
- Set environment variable: `BACKEND_URL` = your-backend-url.railway.app
- Exposes port 80

## Environment Variables

Configure these in Railway's project settings or in `.env` file:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GROQ_API_KEY` | Your Groq API key | Yes | - |
| `GROQ_MODEL` | Model to use for responses | No | `openai/gpt-oss-120b` |
| `BACKEND_URL` | Backend API URL (frontend only) | For frontend | `backend:3000` |
| `PORT` | Port to run on | No | `3000` |

## Project Structure for Docker

```
streaming-ai-chatbot/
├── railway.json          # Railway Docker configuration
├── docker-compose.yml   # Local Docker Compose
├── backend/
│   ├── Dockerfile       # Backend container
│   ├── package.json
│   └── steps/
└── frontend/
    ├── Dockerfile       # Frontend container (nginx)
    ├── nginx.conf       # Nginx configuration
    ├── package.json
    └── src/
```

## Local Testing

```bash
# Install dependencies (if needed)
npm run install:all

# Build Docker images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Troubleshooting

### Backend Not Starting
- Check that `GROQ_API_KEY` is set correctly
- Verify port 3000 is available
- Check logs: `docker-compose logs backend`

### Frontend Can't Connect to Backend
- Verify `BACKEND_URL` environment variable
- Check backend is running: `docker-compose ps`
- Check nginx logs: `docker-compose logs frontend`

### Build Failed
- Ensure Docker is running
- Verify all files are committed to Git
- Check Railway build logs

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Railway                            │
│                                                          │
│  ┌─────────────────┐      ┌─────────────────────────┐  │
│  │    Backend      │      │      Frontend           │  │
│  │   (Docker)      │      │      (Docker + nginx)   │  │
│  │                 │      │                         │  │
│  │  Port: 3000     │◄────►│  Port: 80              │  │
│  │  /chat API      │      │  / (React App)         │  │
│  └────────┬────────┘      └─────────────────────────┘  │
│           │                                              │
└───────────│──────────────────────────────────────────────┘
            │
     ┌──────▼──────┐
     │   Groq API   │
     │ (LLM Provider)│
     └─────────────┘
```

## Custom Domain (Optional)

1. Go to Railway project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed by Railway

> **Note**: For custom domain with both services, configure your DNS to point to the frontend service and use nginx to proxy API requests to the backend.
