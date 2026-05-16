import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Send, User, Sparkles, Package, TrendingUp, IndianRupee } from 'lucide-react';
import Navbar from '../../components/Navbar';

const SUGGESTED_QUESTIONS = [
  'What was my total earnings this month?',
  'Which category made me the most money?',
  'Suggest a fair selling price for a handmade leather bag.',
  'What materials can I use instead of raw silk to reduce costs?',
  'How can I improve my production efficiency?',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I'm your Smart Artisan AI assistant. I have access to your production data and I'm here to help you with pricing, materials, business insights, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: userText });
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I ran into an error. Please try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.layout}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <Sparkles size={18} color="#8b5cf6" />
            <span style={styles.sidebarTitle}>Suggested Questions</span>
          </div>
          <div style={styles.suggestions}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button key={i} style={styles.suggestionBtn} onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>

          <div style={styles.sidebarDivider} />

          <div style={styles.sidebarHeader}>
            <Bot size={18} color="#8b5cf6" />
            <span style={styles.sidebarTitle}>I can help with</span>
          </div>
          <ul style={styles.capabilityList}>
            <li style={styles.capabilityItem}><Package size={14} style={styles.capIcon} /> Production insights</li>
            <li style={styles.capabilityItem}><IndianRupee size={14} style={styles.capIcon} /> Pricing advice</li>
            <li style={styles.capabilityItem}><TrendingUp size={14} style={styles.capIcon} /> Business analytics</li>
            <li style={styles.capabilityItem}><Sparkles size={14} style={styles.capIcon} /> Material suggestions</li>
          </ul>
        </aside>

        {/* Chat Window */}
        <div style={styles.chatContainer}>
          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ ...styles.messageRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={styles.avatar}>
                    <Bot size={18} color="#8b5cf6" />
                  </div>
                )}
                <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: line === '' ? '0.5rem 0' : '0.2rem 0' }}>{line}</p>
                  ))}
                </div>
                {msg.role === 'user' && (
                  <div style={{ ...styles.avatar, backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <User size={18} color="#10b981" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
                <div style={styles.avatar}>
                  <Bot size={18} color="#8b5cf6" />
                </div>
                <div style={styles.aiBubble}>
                  <div style={styles.typingDots}>
                    <span style={{ ...styles.dot, animationDelay: '0s' }} />
                    <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                    <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={styles.inputBar}>
            <textarea
              style={styles.textarea}
              rows={1}
              placeholder="Ask me anything about your productions, pricing, materials..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              style={{ ...styles.sendBtn, opacity: (!input.trim() || loading) ? 0.4 : 1 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <Send size={20} />
            </button>
          </div>
          <p style={styles.hint}>Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>

      {/* Dot animation keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  layout: {
    display: 'flex',
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '2rem',
    gap: '2rem',
    height: 'calc(100vh - 65px)',
    boxSizing: 'border-box',
  },
  sidebar: {
    width: '280px',
    flexShrink: 0,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    overflowY: 'auto',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  sidebarTitle: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  suggestionBtn: {
    background: 'rgba(139, 92, 246, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '10px',
    padding: '0.65rem 0.85rem',
    color: '#cbd5e1',
    fontSize: '0.82rem',
    cursor: 'pointer',
    textAlign: 'left',
    lineHeight: '1.4',
    transition: 'background 0.2s',
  },
  sidebarDivider: {
    borderTop: '1px solid rgba(255,255,255,0.07)',
    margin: '0.5rem 0',
  },
  capabilityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  capabilityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#94a3b8',
  },
  capIcon: {
    flexShrink: 0,
    color: '#8b5cf6',
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aiBubble: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '4px 16px 16px 16px',
    padding: '0.85rem 1.1rem',
    maxWidth: '75%',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#e2e8f0',
  },
  userBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '16px 4px 16px 16px',
    padding: '0.85rem 1.1rem',
    maxWidth: '75%',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#f8fafc',
  },
  typingDots: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    height: '20px',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#8b5cf6',
    display: 'inline-block',
    animation: 'bounce 1.2s infinite',
  },
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  textarea: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '0.95rem',
    padding: '0.75rem 1rem',
    resize: 'none',
    outline: 'none',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    lineHeight: '1.5',
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: '#8b5cf6',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },
  hint: {
    textAlign: 'center',
    color: '#475569',
    fontSize: '0.75rem',
    padding: '0.4rem 0 0.6rem',
    margin: 0,
  },
};
