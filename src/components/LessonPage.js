import { useMemo, useState } from 'react';
import lessons from '../data/lessonContent';

export default function LessonPage() {
  const [selectedId, setSelectedId] = useState(lessons[0]?.id);
  const current = useMemo(
    () => lessons.find((l) => l.id === selectedId) || lessons[0],
    [selectedId]
  );

  return (
    <div className="section lesson-layout">
      <div>
        <div className="section-title">Danh sách bài học</div>
        <div className="lesson-list">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              className={`lesson-tile ${
                lesson.id === current.id ? 'active' : ''
              }`}
              onClick={() => setSelectedId(lesson.id)}
            >
              <div className="tile-top">
                <div className="tile-title">{lesson.title}</div>
                <div className="pill">{lesson.level}</div>
              </div>
              <div className="muted small">{lesson.summary}</div>
              <div className="meta">
                <span className="chip">{lesson.duration}</span>
                <span className="chip alt">{lesson.concepts.length} khái niệm</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {current && (
        <article className="lesson-detail card">
          <div className="detail-header">
            <div>
              <div className="card-title">{current.title}</div>
              <div className="muted">{current.summary}</div>
            </div>
            <div className="meta">
              <span className="chip">{current.level}</span>
              <span className="chip alt">{current.duration}</span>
            </div>
          </div>

          <div className="detail-block">
            <div className="block-title">Mục tiêu</div>
            <ul className="bullet-list">
              {current.objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="detail-block">
            <div className="block-title">Khái niệm chính</div>
            <div className="chips">
              {current.concepts.map((c) => (
                <span key={c} className="chip solid">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-block">
            <div className="block-title">Ví dụ code</div>
            <pre className="code">{current.codeSample}</pre>
          </div>

          <div className="detail-block">
            <div className="block-title">Ghi chú nhanh</div>
            <div className="tip-box">{current.tips}</div>
          </div>

          {current.resources?.length ? (
            <div className="detail-block">
              <div className="block-title">Tài liệu tham khảo</div>
              <div className="resource-list">
                {current.resources.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noreferrer">
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </article>
      )}
    </div>
  );
}

