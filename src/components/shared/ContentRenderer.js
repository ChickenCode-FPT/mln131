import * as HiIcons from 'react-icons/hi2';
import * as FaIcons from 'react-icons/fa6';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import '../../styles/educational.css';

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

    return IconComponent || HiIcons.HiQuestionMarkCircle;
};

// Color variants for cards
const colorVariants = ['blue', 'amber', 'green', 'red', 'purple'];

// Truncate long text for better readability
const truncateText = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

// Highlight keywords in text
const highlightKeywords = (text) => {
    if (!text) return text;
    const keywords = ['dân chủ', 'nhân dân', 'quyền lực', 'nhà nước', 'giai cấp công nhân', 'Đảng Cộng sản', 'Mác - Lênin', 'XHCN', 'xã hội chủ nghĩa'];
    let result = text;
    keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        result = result.replace(regex, '<strong>$1</strong>');
    });
    return result;
};

// Render content based on type
export default function ContentRenderer({ content }) {
    if (!content) return null;

    switch (content.type) {
        case 'definition':
            return (
                <div className="content-section-light">
                    <div className="content-wrapper-edu">
                        <div className="section-header">
                            <h2 className="content-title">{content.title}</h2>
                        </div>

                        {content.intro && (
                            <div className="intro-box">
                                <p className="content-intro">{content.intro}</p>
                            </div>
                        )}

                        <div className="definition-grid-edu">
                            {content.items.map((item, idx) => {
                                const Icon = getIcon(item.icon, item.iconLib);
                                const variant = colorVariants[idx % colorVariants.length];
                                return (
                                    <div key={idx} className={`definition-card-edu variant-${variant}`}>
                                        <div className="definition-icon-edu">
                                            <Icon />
                                        </div>
                                        <h3 className="definition-label-edu">{item.label}</h3>
                                        <p
                                            className="definition-text-edu"
                                            dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(item.text, 250)) }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {content.conclusion && (
                            <div className="conclusion-box-edu">
                                <p dangerouslySetInnerHTML={{ __html: highlightKeywords(content.conclusion) }} />
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'timeline':
            return (
                <div className="content-section-white">
                    <div className="content-wrapper-edu">
                        <div className="section-header">
                            <h2 className="content-title">{content.title}</h2>
                        </div>

                        {content.intro && (
                            <div className="intro-box">
                                <p className="content-intro">{content.intro}</p>
                            </div>
                        )}

                        <div className="timeline-edu">
                            {content.items.map((item, idx) => (
                                <div key={idx} className="timeline-item-edu">
                                    <div className="timeline-date-edu">
                                        <div className="timeline-year-edu">{item.year}</div>
                                        <div className="timeline-period-edu">{item.period}</div>
                                    </div>
                                    <div className="timeline-marker-edu" style={{ backgroundColor: item.color }} />
                                    <div className="timeline-card-edu" style={{ borderColor: item.color }}>
                                        <h3 className="timeline-name-edu">{item.name}</h3>
                                        <p
                                            className="timeline-desc-edu"
                                            dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(item.desc, 180)) }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'comparison':
            return (
                <div className="content-section-light">
                    <div className="content-wrapper-edu">
                        <div className="section-header">
                            <h2 className="content-title">{content.title}</h2>
                        </div>

                        <div className="comparison-table-edu">
                            <div className="comparison-header-edu">
                                <div className="comparison-cell-edu">📌 Khía cạnh</div>
                                <div className="comparison-cell-edu">🏛️ Dân chủ tư sản</div>
                                <div className="comparison-cell-edu">⭐ Dân chủ XHCN</div>
                            </div>
                            {content.items.map((item, idx) => (
                                <div key={idx} className="comparison-row-edu">
                                    <div className="comparison-cell-edu aspect-edu">{item.aspect}</div>
                                    <div className="comparison-cell-edu bourgeois-edu">{item.bourgeois}</div>
                                    <div className="comparison-cell-edu socialist-edu">{item.socialist}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'features':
            const headerColors = ['header-blue', 'header-green', 'header-purple'];
            const iconColors = ['icon-blue', 'icon-green', 'icon-purple'];

            return (
                <div className="content-section-white">
                    <div className="content-wrapper-edu">
                        <div className="section-header">
                            <h2 className="content-title">{content.title}</h2>
                        </div>

                        {content.intro && (
                            <div className="intro-box">
                                <p className="content-intro">{content.intro}</p>
                            </div>
                        )}

                        <div className="features-grid-edu">
                            {content.items.map((item, idx) => {
                                const Icon = getIcon(item.icon, item.iconLib);
                                return (
                                    <div key={idx} className="feature-card-edu">
                                        <div className={`feature-header-edu ${headerColors[idx % 3]}`}>
                                            <div className={`feature-icon-edu ${iconColors[idx % 3]}`}>
                                                <Icon />
                                            </div>
                                            <h3 className="feature-title-edu">{item.title}</h3>
                                        </div>
                                        <div className="feature-highlight-edu">{item.highlight}</div>
                                        <div className="feature-body-edu">
                                            <ul className="feature-points-edu">
                                                {item.points.slice(0, 4).map((point, pIdx) => (
                                                    <li key={pIdx}>{truncateText(point, 120)}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {content.conclusion && (
                            <div className="conclusion-box-edu">
                                <p dangerouslySetInnerHTML={{ __html: highlightKeywords(content.conclusion) }} />
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'state':
            const bulletColors = ['icon-red', 'icon-blue', 'icon-green', 'icon-amber', 'icon-purple'];
            const bulletIcons = ['⚡', '🏛️', '📚', '🎯', '🔧'];

            return (
                <div className="content-section-light">
                    <div className="content-wrapper-edu">
                        <div className="section-header">
                            <h2 className="content-title">{content.title}</h2>
                        </div>

                        {content.sections.map((section, idx) => (
                            <div key={idx} style={{ marginBottom: '3rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#1a2b4a',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <span style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '0.9rem'
                                    }}>{idx + 1}</span>
                                    {section.subtitle}
                                </h3>

                                {section.text && (
                                    <div className="intro-box" style={{ marginBottom: '1.5rem' }}>
                                        <p
                                            className="content-intro"
                                            dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(section.text, 300)) }}
                                        />
                                    </div>
                                )}

                                {section.details && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {section.details.slice(0, 4).map((detail, dIdx) => (
                                            <div key={dIdx} className="bullet-card">
                                                <div className={`bullet-icon ${bulletColors[dIdx % 5]}`}>
                                                    {bulletIcons[dIdx % 5]}
                                                </div>
                                                <div className="bullet-content">
                                                    <p dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(detail, 150)) }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.items && (
                                    <div className="definition-grid-edu">
                                        {section.items.map((item, itemIdx) => (
                                            <div key={itemIdx} className={`definition-card-edu variant-${colorVariants[itemIdx % 5]}`}>
                                                <h3 className="definition-label-edu">{item.label}</h3>
                                                <p
                                                    className="definition-text-edu"
                                                    dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(item.desc, 200)) }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.conclusion && (
                                    <div className="conclusion-box-edu" style={{ marginTop: '1.5rem' }}>
                                        <p dangerouslySetInnerHTML={{ __html: highlightKeywords(section.conclusion) }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'relationship':
            const flowColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

            return (
                <div className="content-section-white">
                    <div className="content-wrapper-edu">
                        <div className="section-header">
                            <h2 className="content-title">{content.title}</h2>
                        </div>

                        {content.intro && (
                            <div className="intro-box">
                                <p className="content-intro">{content.intro}</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
                            {content.flow.map((item, idx) => {
                                const Icon = getIcon(item.icon, item.iconLib);
                                const color = flowColors[idx % 4];
                                return (
                                    <div key={idx}>
                                        <div className="bullet-card" style={{
                                            borderLeft: `4px solid ${color}`,
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '-12px',
                                                left: '1rem',
                                                width: '28px',
                                                height: '28px',
                                                background: color,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: '700',
                                                fontSize: '0.85rem',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                            }}>
                                                {item.step}
                                            </div>
                                            <div className="bullet-icon" style={{ background: `${color}20`, color: color }}>
                                                <Icon />
                                            </div>
                                            <div className="bullet-content">
                                                <h4>{item.title}</h4>
                                                <p dangerouslySetInnerHTML={{ __html: highlightKeywords(truncateText(item.desc, 150)) }} />
                                            </div>
                                        </div>
                                        {idx < content.flow.length - 1 && (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                padding: '0.5rem 0',
                                                color: '#9ca3af'
                                            }}>
                                                <HiIcons.HiArrowDown size={24} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {content.conclusion && (
                            <div className="conclusion-box-edu" style={{ marginTop: '2rem' }}>
                                <p dangerouslySetInnerHTML={{ __html: highlightKeywords(content.conclusion) }} />
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'vietnam':
            return (
                <div className="content-section-light">
                    <div className="content-wrapper-edu">
                        <div className="section-header">
                            <h2 className="content-title">{content.title}</h2>
                        </div>

                        {content.sections.map((section, idx) => (
                            <div key={idx} style={{ marginBottom: '3rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#1a2b4a',
                                    marginBottom: '1.5rem',
                                    paddingLeft: '1rem',
                                    borderLeft: '4px solid #dc2626'
                                }}>
                                    {section.subtitle}
                                </h3>

                                {section.text && (
                                    <div className="intro-box">
                                        <p
                                            className="content-intro"
                                            dangerouslySetInnerHTML={{ __html: highlightKeywords(section.text) }}
                                        />
                                    </div>
                                )}

                                {section.points && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                                        {section.points.map((point, pIdx) => (
                                            <div key={pIdx} className="bullet-card">
                                                <div className={`bullet-icon ${['icon-red', 'icon-amber', 'icon-green', 'icon-blue', 'icon-purple'][pIdx % 5]}`}>
                                                    {['🎯', '⭐', '📖', '🏛️', '⚖️'][pIdx % 5]}
                                                </div>
                                                <div className="bullet-content">
                                                    <p dangerouslySetInnerHTML={{ __html: highlightKeywords(point) }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.quote && (
                                    <div className="quote-box-edu">
                                        <p>{section.quote}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );

        default:
            return null;
    }
}
