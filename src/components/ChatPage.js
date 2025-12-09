import { useState } from 'react';
import { chat } from '../lib/ai/chatbot';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: 'Xin chào! 😊 Tôi là trợ lý AI chuyên về Chương 4 môn CNXHKH - Dân chủ XHCN và Nhà nước XHCN. Bạn có thể hỏi tôi bất kỳ nội dung nào trong chương này!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Lịch sử chat để gửi cho OpenAI (format ChatCompletionMessageParam[])
  const [chatHistory, setChatHistory] = useState([]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = { from: 'user', text: userText };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    // Thêm tin nhắn user vào lịch sử chat
    const newHistory = [...chatHistory, { role: 'user', content: userText }];
    setChatHistory(newHistory);

    try {
      // Gọi hàm chat từ chatbot.js
      const aiText = await chat(newHistory);

      if (!aiText) {
        throw new Error('API không trả về nội dung');
      }

      // Thêm tin nhắn AI vào lịch sử
      setChatHistory((h) => [...h, { role: 'assistant', content: aiText }]);

      setMessages((m) => [
        ...m,
        { from: 'ai', text: aiText },
      ]);
    } catch (error) {
      console.error('Lỗi:', error);
      let errorMsg = `❌ Lỗi: ${error.message}`;

      setMessages((m) => [
        ...m,
        { from: 'ai', text: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="section-title">Hỏi AI về Chương 4 - Dân chủ XHCN & Nhà nước XHCN</div>
      <div className="muted">
        Chat với AI để tìm hiểu về Dân chủ xã hội chủ nghĩa và Nhà nước xã hội chủ nghĩa.
      </div>

      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`bubble ${m.from}`}>
              <span style={{ whiteSpace: 'pre-wrap' }}>{m.text}</span>
            </div>
          ))}
          {loading && <div className="bubble ai">Đang suy nghĩ...</div>}
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
    </div>
  );
}