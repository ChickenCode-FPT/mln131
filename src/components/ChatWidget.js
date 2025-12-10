import { useState } from 'react';
import { chat } from '../lib/ai/chatbot';
import * as HiIcons from 'react-icons/hi2';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: 'Xin chào! Tôi là trợ lý AI về Chương 4 (Dân chủ XHCN & Nhà nước XHCN). Hỏi mình bất cứ điều gì nhé!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const send = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userText = input.trim();
    const userMsg = { from: 'user', text: userText };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    const newHistory = [...chatHistory, { role: 'user', content: userText }];
    setChatHistory(newHistory);

    try {
      const aiText = await chat(newHistory);
      const reply = aiText || 'Mình chưa nhận được nội dung, thử lại nhé.';
      setChatHistory((h) => [...h, { role: 'assistant', content: reply }]);
      setMessages((m) => [...m, { from: 'ai', text: reply }]);
    } catch (error) {
      const msg = `❌ Lỗi: ${error.message}`;
      setMessages((m) => [...m, { from: 'ai', text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat-widget ${open ? 'open' : ''}`}>
      <button
        className="chat-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mở chatbot"
      >
        <HiIcons.HiChatBubbleLeftRight />
        <span>Hỏi AI</span>
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div className="chat-panel-title">
              <HiIcons.HiSparkles />
              <span>Chatbot Chương 4</span>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Đóng">
              <HiIcons.HiXMark />
            </button>
          </div>

          <div className="chat-panel-body">
            <div className="chat-messages">
              {messages.map((m, idx) => (
                <div key={idx} className={`bubble ${m.from}`}>
                  <span style={{ whiteSpace: 'pre-wrap' }}>{m.text}</span>
                </div>
              ))}
              {loading && <div className="bubble ai">Đang suy nghĩ...</div>}
            </div>
          </div>

          <form className="chat-input" onSubmit={send}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về dân chủ XHCN, nhà nước XHCN..."
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? '...' : 'Gửi'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

