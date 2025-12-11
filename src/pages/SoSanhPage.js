import { useEffect } from 'react';
import lessons from '../data/lessonContent';
import PageHero from '../components/shared/PageHero';
import ContentRenderer from '../components/shared/ContentRenderer';
import PageFooter from '../components/shared/PageFooter';
import '../styles/LessonPage.css';

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

        const elements = document.querySelectorAll('.content-block, .page-hero');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);
};

export default function SoSanhPage() {
    useScrollReveal();

    const lesson = lessons[0];
    if (!lesson) return null;

    // Get comparison content
    const comparisonContent = lesson.content.find(c => c.type === 'comparison');

    return (
        <div className="page-container">
            <PageHero
                subtitle="Chương 4 - Phần 2"
                title="So Sánh Hai Nền Dân Chủ"
                description="Phân tích sự khác biệt cơ bản giữa Dân chủ tư sản và Dân chủ xã hội chủ nghĩa về bản chất, mục đích và đối tượng phục vụ."
                backgroundClass="hero-gradient-sosanh"
                stats={[
                    { value: '6', label: 'Khía cạnh so sánh' },
                    { value: '2', label: 'Nền dân chủ' },
                ]}
            />

            <section className="content-flow" id="lesson-content">
                <div className="content-wrapper">
                    {comparisonContent && (
                        <div className="content-block">
                            <ContentRenderer content={comparisonContent} />
                        </div>
                    )}
                </div>
            </section>

            <PageFooter />
        </div>
    );
}
