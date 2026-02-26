# Project Architecture

## Overview

This is a streaming AI chatbot application built with React (frontend) and Node.js/Motia framework (backend). The application uses the Groq API for AI responses.

## Project Structure

```
streaming-ai-chatbot/
├── backend/                     # Node.js/Motia backend service
│   ├── Dockerfile              # Local development Dockerfile
│   ├── Dockerfile.railway      # Railway deployment Dockerfile
│   ├── railway.json            # Railway service configuration
│   ├── railway.toml            # Railway TOML configuration
│   ├── package.json            # Backend dependencies
│   ├── motia-workbench.json    # Motia framework configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── types.d.ts              # TypeScript type definitions
│   ├── public/                 # Static files served by backend
│   │   └── index.html          # Motia workbench interface
│   └── steps/                  # Motia framework steps (API endpoints)
│       ├── chat-api.step.ts    # Main chat API endpoint
│       └── health-check.step.ts # Health check endpoint
├── frontend/                    # React frontend application
│   ├── Dockerfile              # Local development Dockerfile
│   ├── Dockerfile.railway      # Railway deployment Dockerfile
│   ├── railway.json            # Railway service configuration
│   ├── railway.toml            # Railway TOML configuration
│   ├── package.json            # Frontend dependencies
│   ├── nginx.conf              # Nginx configuration (for Railway)
│   ├── public/                 # Static assets
│   │   └── index.html          # React entry point
│   └── src/                    # React source code
│       ├── App.js              # Main chat application component
│       ├── App.css             # Application styling
│       ├── index.js            # React entry point
│       └── index.css           # Global styles
├── docker-compose.yml          # Docker Compose for local development
├── Dockerfile                  # Root Dockerfile for combined service
├── package.json                # Root package.json (workspace)
├── DEPLOYMENT_GUIDE.md         # Detailed deployment instructions for Railway
├── ARCHITECTURE.md             # This file - project architecture documentation
├── README.md                   # General project information
└── screenshot.png              # Application screenshot
```

## Architecture Components

### Backend Service (Node.js/Motia)

**Location:** `/backend/`

**Key Technologies:**
- Node.js 20
- Motia framework (streaming workflow framework)
- TypeScript
- Groq API (LLM integration)

**API Endpoints:**
1. `/chat` (POST): Main chat endpoint for AI responses
2. `/health` (GET): Health check endpoint

**Features:**
- Streaming AI responses
- Conversation context management
- Health check for service monitoring
- Groq API integration

**Docker Configuration:**
- Uses multi-stage build to optimize production image
- Exposes port 3000 (dynamically via Railway environment variable)
- Health check configured
- Production mode by default

### Frontend Service (React)

**Location:** `/frontend/`

**Key Technologies:**
- React 18
- CSS3 (custom styling)
- Nginx (production server)

**Features:**
- Modern chat interface with typing indicators
- Auto-scrolling conversation history
- Responsive design
- Suggestion cards for quick interactions
- Dynamic port configuration for Railway

**Docker Configuration:**
- Multi-stage build with Node.js for build process
- Nginx for production serving
- Environment variable for API endpoint configuration
- Dynamic port support for Railway
- Health check configured

## Communication Between Services

**Frontend → Backend:**
- API calls to configured backend endpoint (via `REACT_APP_API_BASE` environment variable)
- POST request to `/chat` endpoint
- Response format: JSON with conversationId, title, and explanation

**Backend → Frontend:**
- JSON response with AI-generated content
- Supports streaming responses for better user experience

## Data Flow

1. User sends message via frontend interface
2. Frontend calls backend `/chat` API
3. Backend processes the message and calls Groq API
4. Groq API returns AI response
5. Backend formats response and sends back to frontend
6. Frontend displays response to user

## Railway Deployment Architecture

**Separate Service Deployment:**

1. **Backend Service:**
   - Runs Node.js/Motia server
   - Environment variables: `GROQ_API_KEY`, `PORT`, `NODE_ENV`
   - Health check at `/health`
   - URL: `https://your-backend.railway.app`

2. **Frontend Service:**
   - Runs Nginx server serving React app
   - Environment variables: `REACT_APP_API_BASE`, `PORT`, `NODE_ENV`
   - Health check at `/`
   - URL: `https://your-frontend.railway.app`

**Configuration Files for Railway:**

Each service has its own:
- `Dockerfile.railway`: Production-ready Docker image
- `railway.json`: Railway service configuration
- `railway.toml`: Railway TOML configuration with health check settings

## Local Development Setup

### Docker Compose (Single Container)
```bash
docker-compose up
```
- Backend: http://localhost:3000
- Frontend: http://localhost:3001

### Separate Services (Local Development)
1. Backend:
   ```bash
   cd backend && npm install && npm run dev
   ```

2. Frontend:
   ```bash
   cd frontend && npm install && npm start
   ```

## CI/CD with Railway

1. Connect GitHub repository to Railway
2. Set up two separate projects (or services in one project)
3. Configure environment variables
4. Push changes to main branch - Railway automatically deploys

## Security Considerations

- API keys are stored as environment variables
- Frontend API endpoint is configured via environment variable
- Railway provides secure service-to-service communication
- All API calls are over HTTPS

## Future Improvements

- Add user authentication
- Implement message history persistence
- Support for multiple AI models
- Analytics and usage tracking
- Real-time notifications
- File upload and processing
