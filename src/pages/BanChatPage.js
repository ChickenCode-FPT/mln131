import { useEffect } from 'react';
import lessons from '../data/lessonContent';
import PageHero from '../components/shared/PageHero';
import ContentRenderer from '../components/shared/ContentRenderer';
import PageFooter from '../components/shared/PageFooter';
import '../App.css';

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

export default function BanChatPage() {
    useScrollReveal();

    const lesson = lessons[0];
    if (!lesson) return null;

    // Get features content (Bản chất)
    const featuresContent = lesson.content.find(c => c.type === 'features');

    return (
        <div className="page-container">
            <PageHero
                subtitle="Chương 4 - Phần 3"
                title="Bản Chất Dân Chủ XHCN"
                description="Tìm hiểu ba bản chất cốt lõi của nền dân chủ xã hội chủ nghĩa: Chính trị, Kinh tế và Văn hóa - Xã hội."
                backgroundClass="hero-gradient-banchat"
                stats={[
                    { value: '3', label: 'Bản chất cơ bản' },
                    { value: 'Đảng CS', label: 'Lãnh đạo duy nhất' },
                ]}
            />

            <section className="content-flow" id="lesson-content">
                <div className="content-wrapper">
                    {featuresContent && (
                        <div className="content-block">
                            <ContentRenderer content={featuresContent} />
                        </div>
                    )}
                </div>
            </section>

            <PageFooter />
        </div>
    );
}
