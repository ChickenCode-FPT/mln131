import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: 'Xin chào! Bạn có thể hỏi về chủ nghĩa Mác - Lênin, phương pháp luận, kinh tế chính trị hay CNXH khoa học.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fix cứng API key ở đây - THAY ĐỔI KEY CỦA BẠN
  const API_KEY = 'AIzaSyAvY_oJ4MfeetTHvhq1Ls-Vq1ygyd17388';

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { from: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Gọi Google Gemini API giống như SDK
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Bạn là trợ lý AI chuyên về chủ nghĩa Mác - Lênin, phương pháp luận, kinh tế chính trị và chủ nghĩa xã hội khoa học. Hãy trả lời câu hỏi sau một cách chi tiết và dễ hiểu:\n\n${userMsg.text}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('Response:', data);
      
      // Xử lý response
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('API không trả về kết quả');
      }

      const candidate = data.candidates[0];
      const aiText = candidate.content?.parts?.[0]?.text;
      
      if (!aiText) {
        throw new Error('Không tìm thấy nội dung text trong response');
      }

      setMessages((m) => [
        ...m,
        {
          from: 'ai',
          text: aiText,
        },
      ]);
    } catch (error) {
      console.error('Lỗi:', error);
      let errorMsg = 'Đã xảy ra lỗi khi kết nối với AI.';
      
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('401')) {
        errorMsg = '❌ API Key không hợp lệ.';
      } else if (error.message.includes('403')) {
        errorMsg = '❌ API Key chưa được kích hoạt.';
      } else if (error.message.includes('429')) {
        errorMsg = '⏱️ Đã vượt quá giới hạn API.';
      } else if (error.message.includes('not found')) {
        errorMsg = '❌ Model không tồn tại. Thử đổi sang gemini-1.5-flash hoặc gemini-pro.';
      } else if (API_KEY === 'YOUR_GOOGLE_GEMINI_API_KEY_HERE') {
        errorMsg = '⚠️ Bạn chưa thay API Key!';
      } else {
        errorMsg = `❌ Lỗi: ${error.message}`;
      }
      
      setMessages((m) => [
        ...m,
        {
          from: 'ai',
          text: errorMsg,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="section-title">Hỏi AI về bài học (Google Gemini)</div>
      <div className="muted">
        Chat với Gemini AI để tìm hiểu sâu về chủ nghĩa Mác - Lênin, phương pháp luận, 
        kinh tế chính trị và chủ nghĩa xã hội khoa học.
      </div>
      
      {/* Debug Info */}
      {API_KEY === 'YOUR_GOOGLE_GEMINI_API_KEY_HERE' && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <strong>⚠️ Cảnh báo:</strong> Bạn chưa cấu hình API Key!
          <br />
          <small>
            Vui lòng thay đổi <code>API_KEY</code> ở dòng 14 trong code.
          </small>
        </div>
      )}

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
            placeholder="Hỏi về Mác - Lênin, phương pháp luận..."
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