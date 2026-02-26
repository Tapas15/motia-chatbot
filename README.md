# Streaming AI Chatbot

A minimal example demonstrating **real-time AI streaming** and **conversation state management** using the Motia framework with **Groq** for fast LLM inference.

![streaming-ai-chatbot](docs/images/streaming-ai-chatbot.gif)

## 🚀 Features

- **Real-time AI Streaming**: Token-by-token response generation using Groq's API
- **Fast Inference**: Powered by Groq's ultra-fast LPU inference engine
- **Live State Management**: Conversation state updates in real-time with message history
- **Event-driven Architecture**: Clean API → Event → Streaming Response flow
- **Minimal Complexity**: Maximum impact with just a few core files

## 📁 Project Structure

```
streaming-ai-chatbot/
├── backend/                    # Motia backend service
│   ├── steps/                  # API step definitions
│   │   ├── chat-api.step.ts   # Chat API endpoint
│   │   └── index.step.ts      # Static UI server
│   ├── public/                 # Static files
│   │   └── index.html         # Standalone chat UI
│   ├── package.json           # Backend dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── types.d.ts             # Auto-generated types
│   ├── motia-workbench.json   # Workbench layout
│   ├── .env.example           # Environment template
│   └── README.md              # Backend documentation
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Component styles
│   │   ├── index.js           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend documentation
│
├── package.json               # Root package.json
├── tsconfig.json              # Root TypeScript config
└── README.md                  # This file
```

## 🏗️ Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    Frontend     │         │    Backend      │         │    Groq API     │
│    (React)      │────────►│    (Motia)      │────────►│    (LLM)        │
│                 │  POST   │                 │  POST   │                 │
│  - Chat UI      │  /chat  │  - API Routes   │         │  - AI Models    │
│  - State Mgmt   │         │  - Validation   │         │  - Inference    │
│  - Styling      │         │  - Logging      │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 🚂 Railway Deployment

This project is fully configured for deployment on Railway with Docker.

### Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Groq API Key**: Get from [console.groq.com](https://console.groq.com)
3. **Docker**: For local testing (optional)

### Quick Deploy

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variable: `GROQ_API_KEY` = your-groq-api-key
5. Railway will auto-detect the Dockerfile and deploy!

### Docker Local Testing

```bash
# Create .env file with your API key
echo "GROQ_API_KEY=your-groq-api-key" > .env

# Build and run with Docker Compose
docker-compose up --build

# Access the app
# Frontend: http://localhost
# Backend API: http://localhost:3000
```

### Environment Variables (Railway)

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | Yes |
| `GROQ_MODEL` | Model to use | No |

### Project Files for Deployment

- `railway.json` - Railway deployment config
- `docker-compose.yml` - Local Docker setup
- `backend/Dockerfile` - Backend container
- `frontend/Dockerfile` - Frontend container (nginx)
- `frontend/nginx.conf` - Nginx config with API proxy

## 🛠️ Setup

### Prerequisites

1. **Get a Groq API Key**: Sign up at [console.groq.com](https://console.groq.com) to get your API key.

2. **Available Models**:
   - `openai/gpt-oss-120b` - OpenAI GPT OSS 120B (recommended)
   - `llama-3.3-70b-versatile` - Llama 3.3 70B
   - `llama-3.1-8b-instant` - Llama 3.1 8B (fast)
   - `mixtral-8x7b-32768` - Mixtral 8x7B

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/patchy631/ai-engineering-hub.git
cd streaming-ai-chatbot

# Install backend dependencies
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Groq API key

# Start the backend server
npm run dev
```

**In a new terminal:**
```bash
# Install frontend dependencies
cd frontend
npm install

# Start the React development server
npm start
```

**Open Chat Interface**:
- **React Frontend**: Navigate to `http://localhost:3000` (or next available port)
- **Backend UI**: Navigate to `http://localhost:3000/public` for standalone chat

## 📚 Documentation

- **[Backend Documentation](backend/README.md)** - Detailed backend architecture and code explanation
- **[Frontend Documentation](frontend/README.md)** - Detailed frontend architecture and code explanation

## 🔧 Usage

### Send a Chat Message

**POST** `/chat`

```json
{
  "message": "Hello, how are you?",
  "conversationId": "optional-conversation-id"
}
```

**Response:**
```json
{
  "conversationId": "uuid-v4",
  "title": "Short Title",
  "explanation": "Full AI response text..."
}
```

## 🎯 Key Concepts Demonstrated

### 1. **Groq API Integration**
```typescript
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${groqApiKey}`,
  },
  body: JSON.stringify({
    model: 'openai/gpt-oss-120b',
    messages: [...],
    temperature: 1,
    max_completion_tokens: 8192,
  }),
});
```

### 2. **React State Management**
```javascript
const [messages, setMessages] = useState([]);        // Chat history
const [conversationId, setConversationId] = useState(null); // Context
const [isLoading, setIsLoading] = useState(false);   // Loading state
```

### 3. **Proxy Configuration**
The frontend uses a proxy to communicate with the backend during development:
```json
// frontend/package.json
{
  "proxy": "http://localhost:3000"
}
```

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key (required) | - |
| `GROQ_MODEL` | Model to use for responses | `openai/gpt-oss-120b` |

## 📝 Notes

- Make sure to set your `GROQ_API_KEY` in the `.env` file
- The example uses `openai/gpt-oss-120b` model by default for optimal performance
- All conversation data is stored in Motia's built-in state management
- Groq provides extremely fast inference, perfect for real-time chat applications

## 🐛 Troubleshooting

### "GROQ_API_KEY not configured" error
- Make sure you created a `.env` file from `.env.example`
- Verify your API key is correctly set in the `.env` file

### "Groq API error" 
- Check if your API key is valid at [console.groq.com](https://console.groq.com)
- Verify you have available rate limits on your Groq account

### Slow responses
- Try a smaller model like `llama-3.1-8b-instant`
- Check your network connection to Groq's API

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- Check the proxy setting in `frontend/package.json`

## 📄 License

MIT License - feel free to use this code for your own projects!
