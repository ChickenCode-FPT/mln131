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

export default function VietNamPage() {
    useScrollReveal();

    const lesson = lessons[0];
    if (!lesson) return null;

    // Get vietnam content
    const vietnamContent = lesson.content.find(c => c.type === 'vietnam');

    return (
        <div className="page-container">
            <PageHero
                subtitle="Chương 4 - Phần 6"
                title="Dân Chủ XHCN tại Việt Nam"
                description="Tìm hiểu về sự phát triển và bản chất của nền dân chủ xã hội chủ nghĩa tại Việt Nam từ sau Cách mạng Tháng Tám 1945."
                backgroundClass="hero-gradient-vietnam"
                stats={[
                    { value: '1945', label: 'Cách mạng Tháng 8' },
                    { value: '1986', label: 'Đổi mới' },
                    { value: '2025', label: 'Hiện tại' },
                ]}
            />

            <section className="content-flow" id="lesson-content">
                <div className="content-wrapper">
                    {vietnamContent && (
                        <div className="content-block">
                            <ContentRenderer content={vietnamContent} />
                        </div>
                    )}
                </div>
            </section>

            <PageFooter />
        </div>
    );
}
