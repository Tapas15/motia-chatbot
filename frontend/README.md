# Frontend Documentation - Streaming AI Chatbot

This document provides a comprehensive understanding of the frontend architecture and code structure.

## 📁 Frontend Folder Structure

```
frontend/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── App.js               # Main React component
│   ├── App.css              # Component styles
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and proxy config
└── README.md                # This file
```

## 🏗️ Architecture Overview

The frontend is a **React application** built with:
- **React 18** - UI library
- **Create React App** - Build tooling
- **CSS3** - Styling with CSS variables for theming

### Key Features
- Real-time chat interface
- Conversation context management
- Responsive design
- Dark theme UI
- Typing indicators
- Suggestion cards

---

## 📄 File Explanations

### 1. [`src/App.js`](src/App.js)

The main React component containing all chat functionality.

#### API Integration Overview (Lines 4-23)
```javascript
// API_BASE is empty because we use a proxy (see package.json)
// The proxy forwards requests from localhost:3000 to the backend
// 
// When you call fetch('/chat'), React dev server proxies it to
// http://localhost:3000/chat (our Motia backend)
```

#### State Management (Lines 29-37)
```javascript
const [messages, setMessages] = useState([]);        // Chat history
const [inputValue, setInputValue] = useState('');    // Input field value
const [isLoading, setIsLoading] = useState(false);   // Loading state
const [conversationId, setConversationId] = useState(null); // Conversation ID
const [showWelcome, setShowWelcome] = useState(true); // Welcome screen toggle
```

#### Key Functions:

##### 1. `sendMessage()` (Lines 60-122)
The core function that handles message sending:

```javascript
const sendMessage = async (messageText = null) => {
  // 1. Validate and prepare message
  const message = messageText || inputValue.trim();
  if (!message || isLoading) return;

  // 2. Update UI state
  setInputValue('');
  setShowWelcome(false);
  setIsLoading(true);

  // 3. Add user message to chat
  setMessages(prev => [...prev, { role: 'user', content: message }]);

  // 4. Show typing indicator
  setMessages(prev => [...prev, { role: 'assistant', content: '', isTyping: true }]);

  try {
    // 5. Call backend API
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationId })
    });

    // 6. Process response
    const data = await response.json();
    setConversationId(data.conversationId);

    // 7. Update AI message in chat
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages[newMessages.length - 1] = {
        role: 'assistant',
        title: data.title,
        content: data.explanation,
        isTyping: false
      };
      return newMessages;
    });
  } catch (error) {
    // 8. Handle errors
    // Show error message in chat
  }

  setIsLoading(false);
};
```

##### 2. `handleKeyDown()` (Lines 125-130)
Keyboard event handler for the textarea:
- **Enter** - Sends message
- **Shift+Enter** - Adds new line

```javascript
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};
```

##### 3. `newChat()` (Lines 133-138)
Resets the chat to initial state:
```javascript
const newChat = () => {
  setMessages([]);
  setConversationId(null);
  setShowWelcome(true);
  setInputValue('');
};
```

##### 4. `handleInputChange()` (Lines 49-55)
Handles textarea input with auto-resize:
```javascript
const handleInputChange = (e) => {
  setInputValue(e.target.value);
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
  }
};
```

#### UI Components:

##### 1. Sidebar (Lines 153-161)
```jsx
<aside className="sidebar">
  <button className="new-chat-btn" onClick={newChat}>
    <svg>...</svg>
    New chat
  </button>
  <div className="sidebar-title">Today</div>
</aside>
```

##### 2. Welcome Screen (Lines 172-188)
Shows suggestion cards when chat is empty:
```jsx
<div className="welcome-screen">
  <div className="welcome-logo">🤖</div>
  <h1 className="welcome-title">How can I help you today?</h1>
  <div className="suggestions">
    {suggestions.map((s, i) => (
      <div className="suggestion-card" onClick={() => sendMessage(`${s.title} ${s.desc}`)}>
        <div className="suggestion-title">{s.title}</div>
        <div className="suggestion-desc">{s.desc}</div>
      </div>
    ))}
  </div>
</div>
```

##### 3. Messages Container (Lines 190-224)
Renders all chat messages:
```jsx
<div className="messages-container">
  {messages.map((msg, i) => (
    <div key={i} className="message">
      <div className="message-header">
        <div className={`message-avatar ${msg.role}`}>
          {msg.role === 'user' ? '👤' : '🤖'}
        </div>
        <span className="message-role">
          {msg.role === 'user' ? 'You' : 'Assistant'}
        </span>
      </div>
      <div className="message-content">
        {/* Typing indicator or message content */}
      </div>
    </div>
  ))}
</div>
```

##### 4. Input Area (Lines 227-250)
Message input with send button:
```jsx
<div className="input-area">
  <div className="input-container">
    <textarea
      ref={textareaRef}
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="Message Groq AI..."
      rows={1}
    />
    <button className="send-btn" disabled={!inputValue.trim() || isLoading} onClick={() => sendMessage()}>
      <svg>...</svg>
    </button>
  </div>
</div>
```

---

### 2. [`src/App.css`](src/App.css)

Contains all component-level styles using CSS variables for theming.

#### CSS Variables (Theme)
```css
:root {
  --bg-primary: #212121;      /* Main background */
  --bg-secondary: #171717;    /* Sidebar background */
  --bg-tertiary: #2f2f2f;     /* Input background */
  --text-primary: #ececec;    /* Main text */
  --text-secondary: #b4b4b4;  /* Secondary text */
  --accent: #10a37f;          /* Accent color (green) */
  --border: #424242;          /* Border color */
}
```

#### Key Style Classes:

| Class | Purpose |
|-------|---------|
| `.app` | Main container with flex layout |
| `.sidebar` | Left sidebar with new chat button |
| `.main-content` | Chat area container |
| `.chat-area` | Scrollable message container |
| `.welcome-screen` | Centered welcome with suggestions |
| `.suggestion-card` | Clickable suggestion cards |
| `.message` | Individual message container |
| `.message-avatar` | User/AI avatar circle |
| `.typing-indicator` | Animated dots for loading |
| `.input-container` | Textarea wrapper |
| `.send-btn` | Send button |

---

### 3. [`src/index.js`](src/index.js)

React application entry point:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### 4. [`package.json`](package.json)

#### Key Configuration:

**Proxy Setting** (Line 5):
```json
"proxy": "http://localhost:3000"
```
This is crucial for development - it proxies API requests to the backend server.

**Scripts:**
```json
"scripts": {
  "start": "react-scripts start",   // Development server
  "build": "react-scripts build"    // Production build
}
```

**Dependencies:**
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-scripts` - Create React App tooling

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      React Component                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                      State                               ││
│  │  - messages: Array of chat messages                      ││
│  │  - inputValue: Current input text                        ││
│  │  - isLoading: Loading state                              ││
│  │  - conversationId: Current conversation ID               ││
│  │  - showWelcome: Toggle welcome screen                    ││
│  └─────────────────────────────────────────────────────────┘│
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   sendMessage()                          ││
│  │  1. Update state with user message                       ││
│  │  2. Show typing indicator                                ││
│  │  3. POST to /chat API                                    ││
│  │  4. Update state with AI response                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Backend API (/chat)   │
              │   Returns:              │
              │   - conversationId      │
              │   - title               │
              │   - explanation         │
              └─────────────────────────┘
```

---

## 🚀 Running the Frontend

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will start at `http://localhost:3000` (or next available port)

**Important:** The backend must be running for API calls to work!

---

## 🔗 Backend Integration

The frontend communicates with the backend via:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat` | POST | Send message and get AI response |

### Request Format:
```json
{
  "message": "Your message here",
  "conversationId": "optional-uuid"
}
```

### Response Format:
```json
{
  "conversationId": "uuid-v4",
  "title": "Response Title",
  "explanation": "Full AI response..."
}
```

---

## 🎨 Customization

### Changing Theme Colors
Edit CSS variables in [`src/App.css`](src/App.css):
```css
:root {
  --accent: #your-color;  /* Change accent color */
}
```

### Changing AI Model Display
Edit the model selector in [`src/App.js`](src/App.js) (Lines 165-169):
```jsx
<div className="model-selector">
  <span>🤖</span>
  <span>Your Model Name</span>
</div>
```

### Adding More Suggestions
Edit the suggestions array (Lines 141-146):
```javascript
const suggestions = [
  { title: 'Your suggestion', desc: 'description' },
  // Add more...
];
```

---

## 📱 Responsive Design

The UI adapts to different screen sizes:
- **Desktop**: Full sidebar + main content
- **Mobile**: Sidebar hidden, single column layout

Breakpoint: `768px` (defined in CSS media query)

---

## 🐛 Troubleshooting

### "Could not connect to server"
- Ensure backend is running on port 3000
- Check proxy configuration in package.json

### Messages not appearing
- Check browser console for errors
- Verify API response format matches expected structure

### Styling issues
- Clear browser cache
- Check for CSS conflicts
