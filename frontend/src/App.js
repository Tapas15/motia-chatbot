import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// ============================================================
// API INTEGRATION EXPLAINED
// ============================================================
// 
// 1. API_BASE is empty because we use a proxy (see package.json)
//    The proxy forwards requests from localhost:3000 to the backend
//    
// 2. When you call fetch('/chat'), React dev server proxies it to
//    http://localhost:3000/chat (our Motia backend)
//
// 3. The backend (steps/chat-api.step.ts) receives the request and:
//    - Extracts the message and conversationId
//    - Calls Groq API with the message
//    - Returns { conversationId, title, explanation }
//
// 4. Groq API Integration (in backend):
//    - Endpoint: https://api.groq.com/openai/v1/chat/completions
//    - Model: openai/gpt-oss-120b
//    - API Key: Stored in .env file as GROQ_API_KEY
// ============================================================

const API_BASE = '';  // Use proxy from package.json (points to localhost:3000)

// Helper function to generate unique IDs for messages
const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function App() {
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [messages, setMessages] = useState([]);      // Chat history
  const [inputValue, setInputValue] = useState('');  // Input field value
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [conversationId, setConversationId] = useState(null); // Conversation ID for context
  const [showWelcome, setShowWelcome] = useState(true);       // Show welcome screen
  const messagesEndRef = useRef(null);  // For auto-scrolling
  const textareaRef = useRef(null);     // For textarea height adjustment

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Adjust textarea height as user types
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  // ============================================================
  // SEND MESSAGE FUNCTION - API INTEGRATION
  // ============================================================
  const sendMessage = async (messageText = null) => {
    const message = messageText || inputValue.trim();
    if (!message || isLoading) return;

    setInputValue('');
    setShowWelcome(false);
    setIsLoading(true);

    // Add user message to chat with unique ID
    const userMessageId = generateMessageId();
    setMessages(prev => [...prev, { id: userMessageId, role: 'user', content: message }]);

    // Add typing indicator while waiting for response with unique ID
    const assistantMessageId = generateMessageId();
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '', isTyping: true }]);

    try {
      // ============================================================
      // API CALL TO BACKEND
      // ============================================================
      // This calls our Motia backend at POST /chat
      // The backend then calls Groq API and returns the response
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationId  // Send conversation ID for context continuity
        })
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      // Parse the JSON response
      // Expected format: { conversationId: string, title: string, explanation: string }
      const data = await response.json();
      
      // Store conversation ID for future messages
      setConversationId(data.conversationId);

      // Replace typing indicator with actual AI response
      setMessages(prev => {
        const newMessages = [...prev];
        const messageIndex = newMessages.findIndex(msg => msg.id === assistantMessageId);
        if (messageIndex !== -1) {
          newMessages[messageIndex] = {
            id: assistantMessageId,
            role: 'assistant',
            title: data.title,
            content: data.explanation,
            isTyping: false
          };
        }
        return newMessages;
      });
    } catch (error) {
      // Handle errors (network issues, server down, etc.)
      setMessages(prev => {
        const newMessages = [...prev];
        const messageIndex = newMessages.findIndex(msg => msg.id === assistantMessageId);
        if (messageIndex !== -1) {
          newMessages[messageIndex] = {
            id: assistantMessageId,
            role: 'assistant',
            title: 'Error',
            content: error.message || 'Could not connect to server. Make sure the backend is running on port 3000.',
            isTyping: false
          };
        }
        return newMessages;
      });
    }

    setIsLoading(false);
  };

  // Handle Enter key (send message) vs Shift+Enter (new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Reset chat to initial state
  const newChat = () => {
    setMessages([]);
    setConversationId(null);
    setShowWelcome(true);
    setInputValue('');
  };

  // Suggestion cards on welcome screen
  const suggestions = [
    { title: 'Explain quantum computing', desc: 'in simple terms' },
    { title: 'Write Python code', desc: 'to reverse a string' },
    { title: 'Best practices', desc: 'for REST API design' },
    { title: 'Write an email', desc: 'professional tone' }
  ];

  // ============================================================
  // UI RENDERING
  // ============================================================
  return (
    <div className="app">
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={newChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New chat
        </button>
        <div className="sidebar-title">Today</div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="model-selector">
            <span>🤖</span>
            <span>AI Assistant</span>
          </div>
        </header>

        <div className="chat-area">
          {showWelcome ? (
            <div className="welcome-screen">
              <div className="welcome-logo">🤖</div>
              <h1 className="welcome-title">How can I help you today?</h1>
              <div className="suggestions">
                {suggestions.map((s, i) => (
                  <div 
                    key={i} 
                    className="suggestion-card"
                    onClick={() => sendMessage(`${s.title} ${s.desc}`)}
                  >
                    <div className="suggestion-title">{s.title}</div>
                    <div className="suggestion-desc">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className="message">
                  <div className="message-header">
                    <div className={`message-avatar ${msg.role}`}>
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <span className="message-role">
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                  </div>
                  <div className="message-content">
                    {msg.isTyping ? (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : msg.title ? (
                      <>
                        <strong style={{ fontSize: '16px', color: '#10a37f' }}>
                          {msg.title}
                        </strong>
                        <br /><br />
                        {msg.content}
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Assistant..."
              rows={1}
            />
            <button
              className="send-btn"
              disabled={!inputValue.trim() || isLoading}
              onClick={() => sendMessage()}
            >
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <p className="footer-note">
            Powered by AI
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
