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

export default function NhaNuocPage() {
    useScrollReveal();

    const lesson = lessons[0];
    if (!lesson) return null;

    // Get state content (Nhà nước)
    const stateContent = lesson.content.find(c => c.type === 'state');

    return (
        <div className="page-container">
            <PageHero
                subtitle="Chương 4 - Phần 4"
                title="Nhà Nước Xã Hội Chủ Nghĩa"
                description="Tìm hiểu về sự ra đời, bản chất và chức năng của Nhà nước xã hội chủ nghĩa - công cụ thực hiện quyền lực nhân dân."
                backgroundClass="hero-gradient-nhanuoc"
                stats={[
                    { value: '1917', label: 'Năm ra đời' },
                    { value: '3', label: 'Bản chất cơ bản' },
                    { value: '3', label: 'Nhóm chức năng' },
                ]}
            />

            <section className="content-flow" id="lesson-content">
                <div className="content-wrapper">
                    {stateContent && (
                        <div className="content-block">
                            <ContentRenderer content={stateContent} />
                        </div>
                    )}
                </div>
            </section>

            <PageFooter />
        </div>
    );
}
