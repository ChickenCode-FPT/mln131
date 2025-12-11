import { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
import './Header.css';

const CONTENT_ITEMS = [
  { id: 'danchu', label: 'Dân Chủ' },
  { id: 'sosanh', label: 'So Sánh' },
  { id: 'banchat', label: 'Bản Chất' },
  { id: 'nhanuoc', label: 'Nhà Nước' },
  { id: 'moiquanhe', label: 'Mối Quan Hệ' },
  { id: 'vietnam', label: 'Việt Nam' },
];

const NAV_ITEMS = [
  { id: 'lesson', label: 'Tổng Quan' },
  { id: 'content', label: 'Nội Dung', isDropdown: true, items: CONTENT_ITEMS },
  { id: 'flashcard', label: 'Flashcard' },
  { id: 'game', label: 'Trò chơi' },
];

export default function Header({ active, onChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isContentActive = CONTENT_ITEMS.some(item => item.id === active);

  return (
    <header className="topbar">
      <div className="logo" onClick={() => onChange('lesson')} style={{ cursor: 'pointer' }}>
        <span>Nhóm 2</span>
      </div>
      <nav className="nav">
        {NAV_ITEMS.map((item) => {
          if (item.isDropdown) {
            return (
              <div
                key={item.id}
                className="nav-dropdown"
                ref={dropdownRef}
              >
                <button
                  className={`nav-link dropdown-trigger ${isContentActive ? 'active' : ''}`}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {item.label}
                  <HiChevronDown className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    {item.items.map((subItem) => (
                      <a
                        key={subItem.id}
                        href="#"
                        className={`dropdown-item ${active === subItem.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onChange(subItem.id);
                          setDropdownOpen(false);
                        }}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
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
          );
        })}
      </nav>
    </header>
  );
}
