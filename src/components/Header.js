import './Header.css';

const NAV_ITEMS = [
  { id: 'lesson', label: 'Bài học' },
  { id: 'flashcard', label: 'Flashcard' },
  { id: 'game', label: 'Trò chơi ôn tập' },
  { id: 'chat', label: 'Hỏi AI (Chat GPT)' },
];

export default function Header({ active, onChange }) {
  return (
    <header className="topbar">
      <div className="logo">StudyPlay</div>
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${active === item.id ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

