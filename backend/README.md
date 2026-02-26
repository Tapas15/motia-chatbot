# Backend Documentation - Streaming AI Chatbot

This document provides a comprehensive understanding of the backend architecture and code structure.

## 📁 Backend Folder Structure

```
backend/
├── steps/                    # Motia step definitions
│   ├── chat-api.step.ts     # Main chat API endpoint
│   └── index.step.ts        # Serves the static chat UI
├── public/                   # Static files
│   └── index.html           # Standalone chat UI (served at /public)
├── package.json             # Backend dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── types.d.ts               # Auto-generated Motia types
├── motia-workbench.json     # Motia workbench layout configuration
└── .env.example             # Environment variables template
```

## 🏗️ Architecture Overview

The backend is built using the **Motia Framework** - an event-driven framework for building AI applications with built-in state management and streaming capabilities.

### Key Components

1. **API Steps** - HTTP endpoints that handle requests
2. **Event Handlers** - Process events in the background
3. **Streams** - Real-time state management

---

## 📄 File Explanations

### 1. [`steps/chat-api.step.ts`](steps/chat-api.step.ts)

This is the **main chat API endpoint** that handles all chat interactions.

#### Configuration (Lines 5-24)
```typescript
export const config: ApiRouteConfig = {
  type: 'api',           // Defines this as an API endpoint
  name: 'ChatApi',       // Step name for logging/debugging
  description: 'Chat API endpoint using Groq',
  method: 'POST',        // HTTP method
  path: '/chat',         // URL path
  bodySchema: z.object({...}),  // Request validation using Zod
  responseSchema: {...},        // Response schema for documentation
  emits: [],             // Events this step emits (none in this case)
  flows: ['chat'],       // Flow this step belongs to
};
```

#### Handler Function (Lines 26-121)
The handler processes incoming chat requests:

1. **Request Processing** (Lines 30-34)
   - Extracts `message` and optional `conversationId` from request body
   - Generates a new UUID if no conversationId provided

2. **Environment Configuration** (Lines 36-50)
   - Reads `GROQ_API_KEY` and `GROQ_MODEL` from environment
   - Returns error if API key not configured

3. **Groq API Call** (Lines 52-74)
   - Makes POST request to Groq's OpenAI-compatible endpoint
   - Sends system prompt + user message
   - Configuration: temperature=1, max_tokens=8192

4. **Response Processing** (Lines 76-95)
   - Parses JSON response from Groq
   - Extracts `title` and `explanation` fields
   - Falls back to raw content if JSON parsing fails

5. **Error Handling** (Lines 107-120)
   - Catches and logs errors
   - Returns user-friendly error messages

#### API Contract

**Request:**
```json
POST /chat
{
  "message": "Hello, how are you?",
  "conversationId": "optional-uuid"  // Optional
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

---

### 2. [`steps/index.step.ts`](steps/index.step.ts)

Serves the static chat UI HTML page.

#### Configuration (Lines 6-15)
```typescript
export const config: ApiRouteConfig = {
  type: 'api',
  name: 'ChatUI',
  description: 'Serves the chat UI',
  method: 'GET',
  path: '/public',
  // No responseSchema for raw HTML responses
  emits: [],
  flows: ['chat'],
};
```

#### Handler Function (Lines 17-31)
- Reads the HTML file from `public/index.html`
- Returns it with `Content-Type: text/html` header

---

### 3. [`public/index.html`](public/index.html)

A standalone chat UI that can be accessed at `/public` endpoint.

#### Key Features:
- Dark theme matching modern chat interfaces
- Responsive design with sidebar
- Suggestion cards for quick prompts
- Typing indicator animation
- Auto-scrolling messages

#### JavaScript Logic:

1. **State Variables** (Lines 357-358)
   ```javascript
   let conversationId = null;  // Tracks conversation context
   let isStreaming = false;    // Prevents duplicate requests
   ```

2. **Message Sending** (Lines 428-462)
   ```javascript
   async function sendMessage() {
     // 1. Validate input
     // 2. Add user message to UI
     // 3. Show typing indicator
     // 4. Call /chat API
     // 5. Update UI with response
   }
   ```

3. **UI Helpers**
   - `addMessage()` - Adds message to chat container
   - `updateMessageWithTitle()` - Updates AI response with title
   - `newChat()` - Resets conversation

---

### 4. [`types.d.ts`](types.d.ts)

Auto-generated TypeScript types for Motia. Provides type safety for:
- Flow context state streams
- API handlers with request/response types

---

### 5. [`motia-workbench.json`](motia-workbench.json)

Configuration for the Motia visual workbench. Defines the position of each step in the flow diagram.

---

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GROQ_API_KEY` | Your Groq API key | Yes | - |
| `GROQ_MODEL` | Model to use | No | `openai/gpt-oss-120b` |

---

## 🚀 Running the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your Groq API key

# Start development server
npm run dev
```

The server will start at `http://localhost:3000`

---

## 📊 Data Flow

```
┌─────────────┐     POST /chat      ┌─────────────────┐
│   Client    │ ──────────────────► │   ChatApi Step  │
│  (Frontend) │                     │                 │
└─────────────┘                     └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │    Groq API     │
                                    │  (LLM Provider) │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │    Response     │
                                    │ {conversationId,│
                                    │  title,         │
                                    │  explanation}   │
                                    └─────────────────┘
```

---

## 🔒 Security Considerations

1. **API Key Protection**: Never commit `.env` file with real API keys
2. **Input Validation**: All inputs validated using Zod schemas
3. **Error Messages**: Sanitized before returning to client
4. **CORS**: Configure appropriately for production

---

## 🐛 Troubleshooting

### "GROQ_API_KEY not configured"
- Ensure `.env` file exists in backend folder
- Verify `GROQ_API_KEY` is set correctly

### "Groq API error"
- Check API key validity at [console.groq.com](https://console.groq.com)
- Verify rate limits aren't exceeded

### Port Already in Use
- Change port with: `PORT=3001 npm run dev`
