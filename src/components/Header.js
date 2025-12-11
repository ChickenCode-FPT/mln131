import './Header.css';

const NAV_ITEMS = [
  { id: 'lesson', label: 'Trang chính' },
  { id: 'flashcard', label: 'Flashcard' },
  { id: 'game', label: 'Trò chơi' },
];

export default function Header({ active, onChange }) {
  return (
    <header className="topbar">
      <div className="logo" onClick={() => onChange('lesson')} style={{ cursor: 'pointer' }}>
        <span>Nhóm 2</span>
      </div>
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`nav-link ${active === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onChange(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
