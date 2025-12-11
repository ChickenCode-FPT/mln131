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

        const elements = document.querySelectorAll('.content-block, .page-hero, .timeline-item');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);
};

export default function DanChuPage() {
    useScrollReveal();

    const lesson = lessons[0];
    if (!lesson) return null;

    // Get definition and timeline content
    const definitionContent = lesson.content.find(c => c.type === 'definition');
    const timelineContent = lesson.content.find(c => c.type === 'timeline');

    return (
        <div className="page-container">
            <PageHero
                subtitle="Chương 4 - Phần 1"
                title="Dân Chủ là gì?"
                description="Tìm hiểu về khái niệm dân chủ, nguồn gốc lịch sử và các hình thái phát triển của dân chủ qua các thời kỳ."
                backgroundClass="hero-gradient-danchu"
                stats={[
                    { value: '3', label: 'Phương diện' },
                    { value: '4', label: 'Giai đoạn lịch sử' },
                    { value: '1917', label: 'Năm DCXHCN ra đời' },
                ]}
            />

            <section className="content-flow" id="lesson-content">
                <div className="content-wrapper">
                    {definitionContent && (
                        <div className="content-block">
                            <ContentRenderer content={definitionContent} />
                        </div>
                    )}
                    {timelineContent && (
                        <div className="content-block">
                            <ContentRenderer content={timelineContent} />
                        </div>
                    )}
                </div>
            </section>

            <PageFooter />
        </div>
    );
}
