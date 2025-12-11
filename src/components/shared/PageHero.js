import './PageHero.css';

export default function PageHero({
    title,
    subtitle,
    description,
    stats,
    backgroundClass = 'hero-gradient-default'
}) {
    return (
        <section className={`page-hero ${backgroundClass}`}>
            <div className="page-hero-content">
                <div className="page-hero-text">
                    {subtitle && <span className="page-hero-subtitle">{subtitle}</span>}
                    <h1 className="page-hero-title">{title}</h1>
                    {description && <p className="page-hero-description">{description}</p>}
                </div>

                {stats && stats.length > 0 && (
                    <div className="page-hero-stats">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-card">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
