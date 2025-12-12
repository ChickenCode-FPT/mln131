import { useEffect } from 'react';
import * as HiIcons from 'react-icons/hi2';
import lessons from '../data/lessonContent';
import PageFooter from './shared/PageFooter';
import './Footer.css';
 import '../styles/educational.css';
import '../styles/overview.css';

// Scroll reveal hook
const useScrollReveal = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.overview-hero, .overview-card, .action-card');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

// Navigation cards data
const OVERVIEW_SECTIONS = [
  {
    id: 'danchu',
    title: 'Dân Chủ là gì?',
    description: 'Khái niệm dân chủ và lịch sử phát triển qua các thời kỳ',
    icon: 'HiUsers',
    color: '#3b82f6',
    highlights: ['Quyền lực nhân dân', 'Dân chủ nguyên thủy → XHCN', '4 giai đoạn lịch sử']
  },
  {
    id: 'sosanh',
    title: 'So Sánh Hai Nền Dân Chủ',
    description: 'Phân biệt Dân chủ tư sản và Dân chủ xã hội chủ nghĩa',
    icon: 'HiScale',
    color: '#8b5cf6',
    highlights: ['6 khía cạnh so sánh', 'Bản chất giai cấp', 'Mục đích khác biệt']
  },
  {
    id: 'banchat',
    title: 'Bản Chất Dân Chủ XHCN',
    description: 'Ba bản chất cốt lõi: Chính trị, Kinh tế, Văn hóa-Xã hội',
    icon: 'HiSparkles',
    color: '#10b981',
    highlights: ['Đảng CS lãnh đạo', 'Sở hữu xã hội', 'Hệ tư tưởng Mác-Lênin']
  },
  {
    id: 'nhanuoc',
    title: 'Nhà Nước XHCN',
    description: 'Sự ra đời, bản chất và chức năng của Nhà nước XHCN',
    icon: 'HiBuildingOffice2',
    color: '#ef4444',
    highlights: ['Ra đời từ CM 1917', '3 bản chất cơ bản', 'Chức năng trấn áp + xây dựng']
  },
  {
    id: 'moiquanhe',
    title: 'Mối Quan Hệ Biện Chứng',
    description: 'Quan hệ giữa Dân chủ XHCN và Nhà nước XHCN',
    icon: 'HiArrowsRightLeft',
    color: '#f59e0b',
    highlights: ['4 bước quy trình', 'Kiểm soát quyền lực', 'Thể chế hóa ý chí']
  },
  {
    id: 'vietnam',
    title: 'Áp Dụng tại Việt Nam',
    description: 'Dân chủ XHCN và Nhà nước pháp quyền tại Việt Nam',
    icon: 'HiFlag',
    color: '#dc2626',
    highlights: ['Từ 1945 đến nay', 'Đổi mới 1986', 'Tư tưởng Hồ Chí Minh']
  },
];

export default function LessonPage({ onChange }) {
  useScrollReveal();

  const lesson = lessons[0];
  if (!lesson) return null;

  return (
    <div className="overview-page">
      {/* Hero Section */}
      <section className="overview-hero">
        <div className="overview-hero-content">
          <span className="overview-badge">Chương 4 • MLN131</span>
          <h1 className="overview-title">
            Dân Chủ và Nhà Nước<br />
            <span className="title-highlight">Xã Hội Chủ Nghĩa</span>
          </h1>
          <p className="overview-subtitle">
            {lesson.summary}
          </p>
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-text">Chủ đề</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">45</span>
              <span className="stat-text">Phút học</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">7</span>
              <span className="stat-text">Nội dung</span>
            </div>
          </div>
        </div>
        {lesson.hero && (
          <div className="overview-hero-image">
            <img src={lesson.hero} alt="Chủ nghĩa Mác-Lênin" />
          </div>
        )}
      </section>

      {/* Navigation Cards */}
      <section className="overview-content">
        <div className="content-wrapper-edu">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <h2 className="content-title">Khám phá nội dung</h2>
            <p className="overview-section-subtitle">
              Chọn một chủ đề để tìm hiểu chi tiết
            </p>
          </div>

          <div className="overview-grid">
            {OVERVIEW_SECTIONS.map((section, idx) => {
              const Icon = HiIcons[section.icon] || HiIcons.HiQuestionMarkCircle;
              return (
                <div
                  key={section.id}
                  className="overview-card"
                  onClick={() => onChange(section.id)}
                  style={{ '--card-color': section.color }}
                >
                  <div className="card-header">
                    <div className="card-icon" style={{ background: section.color }}>
                      <Icon />
                    </div>
                    <span className="card-number">{idx + 1}</span>
                  </div>
                  <h3 className="card-title">{section.title}</h3>
                  <p className="card-description">{section.description}</p>
                  <ul className="card-highlights">
                    {section.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                  <div className="card-action">
                    <span>Xem chi tiết</span>
                    <HiIcons.HiArrowRight />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="overview-actions">
        <div className="content-wrapper-edu">
          <div className="actions-grid">
            <div className="action-card" onClick={() => onChange('flashcard')}>
              <HiIcons.HiRectangleStack className="action-icon" />
              <div>
                <h4>Flashcard</h4>
                <p>Ôn tập với thẻ ghi nhớ</p>
              </div>
            </div>
            <div className="action-card" onClick={() => onChange('game')}>
              <HiIcons.HiPuzzlePiece className="action-icon" />
              <div>
                <h4>Trò chơi</h4>
                <p>Học qua câu hỏi tương tác</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PageFooter />
    </div>
  );
}
