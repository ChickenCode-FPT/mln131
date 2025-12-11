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

export default function MoiQuanHePage() {
    useScrollReveal();

    const lesson = lessons[0];
    if (!lesson) return null;

    // Get relationship content
    const relationshipContent = lesson.content.find(c => c.type === 'relationship');

    return (
        <div className="page-container">
            <PageHero
                subtitle="Chương 4 - Phần 5"
                title="Mối Quan Hệ Biện Chứng"
                description="Phân tích mối quan hệ qua lại giữa Dân chủ XHCN và Nhà nước XHCN trong quá trình xây dựng xã hội mới."
                backgroundClass="hero-gradient-moiquanhe"
                stats={[
                    { value: '4', label: 'Bước trong quy trình' },
                    { value: '2', label: 'Thành phần' },
                ]}
            />

            <section className="content-flow" id="lesson-content">
                <div className="content-wrapper">
                    {relationshipContent && (
                        <div className="content-block">
                            <ContentRenderer content={relationshipContent} />
                        </div>
                    )}
                </div>
            </section>

            <PageFooter />
        </div>
    );
}
