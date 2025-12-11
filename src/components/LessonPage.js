import { useMemo, useState, useEffect, useRef } from 'react';
import lessons from '../data/lessonContent';
import * as HiIcons from 'react-icons/hi2';
import * as FaIcons from 'react-icons/fa6';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import './Footer.css';

// Icon mapping helper
const getIcon = (iconName, iconLib = 'hi') => {
  const iconMap = {
    hi: HiIcons,
    fa: FaIcons,
    md: MdIcons,
    bs: BsIcons,
  };
  
  const IconLibrary = iconMap[iconLib] || HiIcons;
  const IconComponent = IconLibrary[iconName];
  
  // Fallback to a default icon if not found
  return IconComponent || HiIcons.HiQuestionMarkCircle;
};

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

    const elements = document.querySelectorAll('.content-block, .hero-section, .timeline-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

export default function LessonPage({ onChange }) {
  const [selectedId, setSelectedId] = useState(lessons[0]?.id);
  const current = useMemo(
    () => lessons.find((l) => l.id === selectedId) || lessons[0],
    [selectedId]
  );

  useScrollReveal();

  if (!current) return null;

  const renderContent = (content) => {
    switch (content.type) {
      case 'definition':
        return (
          <div className="definition-box">
            <h2 className="content-title">{content.title}</h2>
            {content.intro && <p className="content-intro">{content.intro}</p>}
            <div className="definition-grid">
              {content.items.map((item, idx) => {
                const Icon = getIcon(item.icon, item.iconLib);
                return (
                  <div key={idx} className="definition-card">
                    <div className="definition-icon">
                      <Icon />
                    </div>
                    <h3 className="definition-label">{item.label}</h3>
                    <p className="definition-text">{item.text}</p>
                  </div>
                );
              })}
            </div>
            {content.conclusion && <p className="content-conclusion">{content.conclusion}</p>}
          </div>
        );

      case 'timeline':
        return (
          <div className="timeline-box">
            <h2 className="content-title">{content.title}</h2>
            {content.intro && <p className="content-intro">{content.intro}</p>}
            <div className="timeline">
              {content.items.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-marker" style={{ borderColor: item.color, backgroundColor: item.color }}>
                    <div className="timeline-year">{item.year}</div>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-period">{item.period}</div>
                    <h3 className="timeline-name">{item.name}</h3>
                    <p className="timeline-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="comparison-box">
            <h2 className="content-title">{content.title}</h2>
            <div className="comparison-table">
              <div className="comparison-header">
                <div className="comparison-cell">Khía cạnh</div>
                <div className="comparison-cell">Dân chủ tư sản</div>
                <div className="comparison-cell">Dân chủ XHCN</div>
              </div>
              {content.items.map((item, idx) => (
                <div key={idx} className="comparison-row">
                  <div className="comparison-cell aspect">{item.aspect}</div>
                  <div className="comparison-cell bourgeois">{item.bourgeois}</div>
                  <div className="comparison-cell socialist">{item.socialist}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="features-box">
            <h2 className="content-title">{content.title}</h2>
            {content.intro && <p className="content-intro">{content.intro}</p>}
            <div className="features-grid">
              {content.items.map((item, idx) => {
                const Icon = getIcon(item.icon, item.iconLib);
                return (
                  <div key={idx} className="feature-card">
                    <div className="feature-header">
                      <div className="feature-icon">
                        <Icon />
                      </div>
                      <h3 className="feature-title">{item.title}</h3>
                    </div>
                    <div className="feature-highlight">{item.highlight}</div>
                    <ul className="feature-points">
                      {item.points.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            {content.conclusion && <p className="content-conclusion">{content.conclusion}</p>}
          </div>
        );

      case 'state':
        return (
          <div className="state-box">
            <h2 className="content-title">{content.title}</h2>
            {content.sections.map((section, idx) => (
              <div key={idx} className="state-section">
                <h3 className="state-subtitle">{section.subtitle}</h3>
                {section.text && <p className="state-text">{section.text}</p>}
                {section.intro && <p className="state-intro">{section.intro}</p>}
                {section.details && (
                  <ul className="state-details">
                    {section.details.map((detail, dIdx) => (
                      <li key={dIdx}>{detail}</li>
                    ))}
                  </ul>
                )}
                {section.items && (
                  <div className="state-items">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="state-item">
                        <div className="state-item-label">{item.label}</div>
                        <div className="state-item-desc">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                )}
                {section.conclusion && <p className="state-conclusion">{section.conclusion}</p>}
              </div>
            ))}
          </div>
        );

      case 'relationship':
        return (
          <div className="relationship-box">
            <h2 className="content-title">{content.title}</h2>
            {content.intro && <p className="content-intro">{content.intro}</p>}
            <div className="relationship-flow">
              {content.flow.map((item, idx) => {
                const Icon = getIcon(item.icon, item.iconLib);
                return (
                  <div key={idx}>
                    <div className="flow-item">
                      <div className="flow-step">{item.step}</div>
                      <div className="flow-icon">
                        <Icon />
                      </div>
                      <h3 className="flow-title">{item.title}</h3>
                      <p className="flow-desc">{item.desc}</p>
                    </div>
                    {idx < content.flow.length - 1 && (
                      <div className="flow-arrow">
                        <HiIcons.HiArrowDown />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {content.conclusion && <p className="content-conclusion">{content.conclusion}</p>}
          </div>
        );

      case 'vietnam':
        return (
          <div className="vietnam-box">
            <h2 className="content-title">{content.title}</h2>
            {content.sections.map((section, idx) => (
              <div key={idx} className="vietnam-section">
                <h3 className="vietnam-subtitle">{section.subtitle}</h3>
                {section.text && <p className="vietnam-text">{section.text}</p>}
                {section.points && (
                  <ul className="vietnam-points">
                    {section.points.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                )}
                {section.quote && (
                  <div className="vietnam-quote">
                    <p>{section.quote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderHeroTitle = () => {
    const t = current.title || '';
    const keyword = 'Dân chủ xã hội chủ nghĩa';
    if (t.includes(keyword)) {
      const [before, after] = t.split(keyword);
      return (
        <>
          <span>{before.trim()} </span>
          <br />
          <span className="highlight">{keyword}</span>
          {after ? <span>{after}</span> : null}
        </>
      );
    }
    return t.split(' ').map((word, i) =>
      word.includes('Mác') || word.includes('Hồ') || word.includes('Đảng') || word.includes('XHCN') || word.includes('xã') || word.includes('hội')
        ? <span key={i} className="highlight">{word} </span>
        : <span key={i}>{word} </span>
    );
  };

  return (
    <div className="lesson-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{renderHeroTitle()}</h1>
            <p className="hero-description">{current.summary}</p>
            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  const el = document.getElementById('lesson-content');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Khám phá
              </button>
              <button
                className="btn-secondary"
                onClick={() => onChange && onChange('game')}
              >
                Trò chơi
              </button>
              <button
                className="btn-secondary"
                onClick={() => onChange && onChange('flashcard')}
              >
                Flashcard
              </button>
            </div>
          </div>
          {current.hero && (
            <div className="hero-image-wrapper">
              <img src={current.hero} alt={current.title} className="hero-image" />
            </div>
          )}
        </div>
      </section>

      {/* Main Content - Structured Blocks */}
      <section className="content-flow" id="lesson-content">
        <div className="content-wrapper">
          {current.content && current.content.map((content, idx) => (
            <div key={idx} className="content-block">
              {renderContent(content)}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="page-footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-head">
              <HiIcons.HiOutlineBookOpen className="footer-icon" />
              <h4 className="footer-title">Dự án học thuật</h4>
            </div>
            <p className="footer-text"><span className="footer-label">Môn:</span> MLN131</p>
            <p className="footer-text"><span className="footer-label">Trường:</span> Đại học FPT</p>
            <p className="footer-text"><span className="footer-label">Học kỳ:</span> 2025</p>
            <div className="footer-accent accent-red" />
          </div>

          <div className="footer-column">
            <div className="footer-head">
              <HiIcons.HiUserGroup className="footer-icon" />
              <h4 className="footer-title">Thông tin nhóm</h4>
            </div>
            <p className="footer-text"><span className="footer-label">Nhóm:</span> 6</p>
            <p className="footer-text"><span className="footer-label">Thành viên:</span></p>
            <ul className="footer-list">
              <li>Đỗ Quốc Hưng - SE170515</li>
              <li>Vũ Quang Nguyên - SE180208</li>
              <li>Lê Tiến Đạt - SE182453</li>
              <li>Hồ Tài Liên Vy Kha - SE182749</li>
              <li>Phạm Thế Danh - SE184514</li>
              <li>Trần Thiện Duy - SE184596</li>
            </ul>
            <div className="footer-accent accent-purple" />
          </div>

          <div className="footer-column">
            <div className="footer-head">
              <HiIcons.HiEnvelope className="footer-icon" />
              <h4 className="footer-title">Giảng viên</h4>
            </div>
            <p className="footer-text"><span className="footer-label">Hướng dẫn:</span> Lê Minh Trí</p>
            <p className="footer-text footer-note">Cảm ơn thầy đã hỗ trợ nhóm trong quá trình thực hiện dự án.</p>
            <div className="footer-accent accent-green" />
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 - Sản phẩm học tập nhóm 6 - FPT University</p>
          <p className="footer-made">Made with <HiIcons.HiHeart className="inline-icon" /> in Vietnam</p>
        </div>
      </footer>
    </div>
  );
}
