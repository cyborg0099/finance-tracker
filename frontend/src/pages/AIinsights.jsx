import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  User, 
  Bot, 
  ArrowLeft,
  Loader2,
  Sparkles,
  FileText,
  PieChart,
  Wallet,
  Settings,
  Plus,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { useNavigate } from 'react-router-dom';

export default function AIChatPage({ darkMode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([
    "How can I reduce my food expenses?",
    "Show me my spending trends",
    "Create a budget for next month",
    "What's my savings rate?"
  ]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch chat history on mount
  useEffect(() => {
    fetch('http://localhost:8000/history')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(() => setMessages([]));
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError(null);
    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMessage)
      });
      if (!res.ok) throw new Error('Failed to get response');
      const botMsg = await res.json();
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError('Chatbot server unavailable.');
    }
    setLoading(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  // Rate response
  const handleRate = (messageId, rating) => {
    // Placeholder for rating logic
  };

  return (
    <div className={`ai-chat-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          {/* Chat Column */}
          <div className="col-md-8 d-flex flex-column">
            {/* Chat Header */}
            <div className={`chat-header p-3 border-bottom ${darkMode ? 'bg-dark' : 'bg-white'} shadow-sm`}>
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-sm me-3"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h5 className="mb-0">AI Finance Assistant</h5>
                  <small className="text-muted">
                    {loading ? 'Typing...' : 'Online - Ready to help'}
                  </small>
                </div>
                <div className="ms-auto d-flex gap-2">
                  <button className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}>
                    <RefreshCw size={16} />
                  </button>
                  <button className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}>
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className={`chat-messages flex-grow-1 p-3 ${darkMode ? 'bg-darker' : 'bg-light'}`}>
              {messages.length === 0 && !loading ? (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <div className={`icon-wrapper mb-4 ${darkMode ? 'text-primary' : 'text-success'}`}>
                    <Sparkles size={48} className="p-2" />
                  </div>
                  <h4 className="mb-3">How can I help with your finances today?</h4>
                  <p className="text-muted mb-4">
                    Ask me about budgeting, spending trends, savings strategies, or any financial questions.
                  </p>
                  
                  <div className="suggestions-grid w-100">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className={`suggestion-card ${darkMode ? 'bg-dark' : 'bg-white'} shadow-sm`}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="d-flex align-items-center">
                          <div className={`icon-shape me-3 ${darkMode ? 'bg-dark-light' : 'bg-light'}`}>
                            {index % 4 === 0 && <PieChart size={18} className="text-primary" />}
                            {index % 4 === 1 && <FileText size={18} className="text-info" />}
                            {index % 4 === 2 && <Wallet size={18} className="text-success" />}
                            {index % 4 === 3 && <Sparkles size={18} className="text-warning" />}
                          </div>
                          <span>{suggestion}</span>
                        </div>
                        <Plus size={16} className="text-muted" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, idx) => (
                    <div key={idx} className={`message ${message.sender} ${darkMode ? 'dark' : 'light'} mb-3`}>
                      <div className="message-header d-flex align-items-center mb-2">
                        <div className={`avatar ${message.sender} me-2`}>
                          {message.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <strong className="me-2">
                          {message.sender === 'user' ? 'You' : 'AI Assistant'}
                        </strong>
                        <small className="text-muted">
                          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </small>
                      </div>
                      <div className="message-content">
                        <Markdown
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline ? (
                                <SyntaxHighlighter
                                  language={match?.[1] || 'javascript'}
                                  style={darkMode ? darkCodeTheme : lightCodeTheme}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {message.text}
                        </Markdown>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="message ai mb-3">
                      <div className="message-header d-flex align-items-center mb-2">
                        <div className="avatar ai me-2">
                          <Bot size={18} />
                        </div>
                        <strong className="me-2">AI Assistant</strong>
                      </div>
                      <div className="typing-indicator">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
              {error && <div className="alert alert-danger mt-2">{error}</div>}
            </div>

            {/* Chat Input */}
            <div className={`chat-input p-3 border-top ${darkMode ? 'bg-dark' : 'bg-white'} shadow-sm`}>
              <form onSubmit={handleSend} className="d-flex gap-2">
                <div className="flex-grow-1 position-relative">
                  <input
                    type="text"
                    className={`form-control ${darkMode ? 'bg-dark text-light' : ''}`}
                    placeholder="Ask about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                  />
                  {input && (
                    <button
                      type="button"
                      className="btn btn-sm position-absolute end-0 top-50 translate-middle-y me-2"
                      onClick={() => setInput('')}
                    >
                      ×
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className={`btn ${darkMode ? 'btn-light-gradient' : 'btn-primary'} px-3`}
                  disabled={!input.trim() || loading}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className={`col-md-4 d-none d-md-flex flex-column ${darkMode ? 'bg-dark' : 'bg-light'} border-start`}>
            <div className="p-4">
              <h5 className="d-flex align-items-center mb-3">
                <Sparkles size={18} className="me-2 text-primary" />
                AI Capabilities
              </h5>
              <div className="capabilities-grid">
                <div className={`capability ${darkMode ? 'bg-darker' : 'bg-white'} shadow-sm`}>
                  <PieChart size={20} className="text-primary mb-2" />
                  <h6>Budget Analysis</h6>
                  <small className="text-muted">Optimize your spending categories</small>
                </div>
                <div className={`capability ${darkMode ? 'bg-darker' : 'bg-white'} shadow-sm`}>
                  <FileText size={20} className="text-info mb-2" />
                  <h6>Report Generation</h6>
                  <small className="text-muted">Create custom financial reports</small>
                </div>
                <div className={`capability ${darkMode ? 'bg-darker' : 'bg-white'} shadow-sm`}>
                  <Wallet size={20} className="text-success mb-2" />
                  <h6>Savings Plans</h6>
                  <small className="text-muted">Personalized savings strategies</small>
                </div>
                <div className={`capability ${darkMode ? 'bg-darker' : 'bg-white'} shadow-sm`}>
                  <Sparkles size={20} className="text-warning mb-2" />
                  <h6>Predictive Insights</h6>
                  <small className="text-muted">Future spending projections</small>
                </div>
              </div>
            </div>

            <div className="p-4 border-top mt-auto">
              <h5 className="d-flex align-items-center mb-3">
                <Settings size={18} className="me-2 text-muted" />
                Conversation Settings
              </h5>
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="dataSharing"
                  checked={true}
                  onChange={() => {}}
                />
                <label className="form-check-label" htmlFor="dataSharing">
                  Allow learning from this chat
                </label>
              </div>
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="detailedResponses"
                  checked={true}
                  onChange={() => {}}
                />
                <label className="form-check-label" htmlFor="detailedResponses">
                  Detailed responses
                </label>
              </div>
              <button className="btn btn-sm btn-outline-secondary w-100 mt-2">
                Start new conversation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Code theme for syntax highlighting
const lightCodeTheme = {
  plain: {
    color: '#393A34',
    backgroundColor: '#f6f8fa',
  },
  styles: [
    // ... (prism theme styles)
  ]
};

const darkCodeTheme = {
  plain: {
    color: '#F8F8F2',
    backgroundColor: '#282A36',
  },
  styles: [
    // ... (prism theme styles)
  ]
};