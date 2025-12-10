import { useMemo, useState, useEffect } from 'react';
import flashcards from '../data/flashcards';
import * as HiIcons from 'react-icons/hi2';
import * as FaIcons from 'react-icons/fa6';

const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
const letters = ['A', 'B', 'C', 'D'];

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

    const elements = document.querySelectorAll('.flashcard-section');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

export default function FlashcardPage() {
  useScrollReveal();

  // Học nhanh (lật thẻ)
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = useMemo(() => flashcards[index], [index]);

  // Chế độ test trắc nghiệm
  const [showTest, setShowTest] = useState(false);
  const [testOrder, setTestOrder] = useState([]);
  const [testIdx, setTestIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState('');

  const currentTestCard = useMemo(
    () => (testOrder.length ? flashcards[testOrder[testIdx]] : null),
    [testOrder, testIdx]
  );

  const next = () => {
    setIndex((i) => (i + 1) % flashcards.length);
    setFlipped(false);
  };
  const prev = () => {
    setIndex((i) => (i - 1 + flashcards.length) % flashcards.length);
    setFlipped(false);
  };

  const startTest = () => {
    const order = shuffle(flashcards.map((_, i) => i));
    setTestOrder(order);
    setTestIdx(0);
    setScore(0);
    setAnswered(0);
    setFinished(false);
    setSelected('');
    setFeedback('');
    setShowTest(true);
  };

  const closeTest = () => {
    setShowTest(false);
    setTestOrder([]);
    setTestIdx(0);
    setScore(0);
    setAnswered(0);
    setFinished(false);
    setSelected('');
    setFeedback('');
  };

  const selectOption = (opt) => {
    if (!currentTestCard || selected || finished) return;
    setSelected(opt);
    const correct = opt === currentTestCard.answer;
    setScore((s) => s + (correct ? 1 : 0));
    setAnswered((a) => a + 1);
    setFeedback(
      correct
        ? 'Chính xác! +1 điểm'
        : `Sai. Đáp án: ${currentTestCard.answer}`
    );
    setTimeout(() => {
      if (testIdx + 1 < testOrder.length) {
        setTestIdx((i) => i + 1);
        setSelected('');
        setFeedback('');
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  const progress = testOrder.length ? `${answered}/${testOrder.length}` : '0/0';
  const progressPercent = testOrder.length ? (answered / testOrder.length) * 100 : 0;

  return (
    <div className="flashcard-page">
      <div className="flashcard-main-container">
        {/* Flashcard Section - Main Focus */}
        <section className="flashcard-section">
          <div className="section-header">
            <div className="section-header-icon">
              <HiIcons.HiBookOpen />
            </div>
            <h1 className="section-title">Flashcard Ôn Tập</h1>
          </div>
          <p className="section-desc">
            Học và kiểm tra kiến thức về Dân chủ và Dân chủ XHCN thông qua flashcard. Nhấn vào thẻ để lật và xem đáp án.
          </p>

          <div className="flashcard-wrapper">
            <div
              className={`flashcard-card ${flipped ? 'flipped' : ''}`}
              onClick={() => setFlipped((f) => !f)}
            >
              <div className="flashcard-front">
                <div className="flashcard-number">{index + 1} / {flashcards.length}</div>
                <div className="flashcard-question">{card.front}</div>
                <div className="flashcard-hint">
                  <HiIcons.HiArrowPath className="flip-icon" />
                  Nhấn để lật
                </div>
              </div>
              <div className="flashcard-back">
                <div className="flashcard-answer-label">Đáp án</div>
                <div className="flashcard-answer">{card.back}</div>
                <div className="flashcard-hint">
                  <HiIcons.HiArrowPath className="flip-icon" />
                  Nhấn để lật lại
                </div>
              </div>
            </div>
          </div>

          <div className="flashcard-controls">
            <button className="flashcard-btn" onClick={prev}>
              <HiIcons.HiChevronLeft />
              Trước
            </button>
            <div className="flashcard-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((index + 1) / flashcards.length) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">{index + 1} / {flashcards.length}</span>
            </div>
            <button className="flashcard-btn" onClick={next}>
              Sau
              <HiIcons.HiChevronRight />
            </button>
          </div>
        </section>

        {/* Test Button - Simple */}
        {!showTest && (
          <div className="test-button-section">
            <button className="test-start-btn-large" onClick={startTest}>
              <HiIcons.HiClipboardDocumentCheck />
              <span>Bắt đầu Test Trắc Nghiệm</span>
            </button>
          </div>
        )}

        {/* Test Modal/Overlay */}
        {showTest && (
          <div className="test-overlay" onClick={closeTest}>
            <div className="test-modal" onClick={(e) => e.stopPropagation()}>
              <div className="test-modal-header">
                <h3 className="test-modal-title">Test Trắc Nghiệm</h3>
                <button className="test-close-btn" onClick={closeTest}>
                  <HiIcons.HiXMark />
                </button>
              </div>

              {!testOrder.length && !finished && (
                <div className="test-start">
                  <button className="test-start-btn" onClick={startTest}>
                    <HiIcons.HiPlay />
                    Bắt đầu test
                  </button>
                </div>
              )}

              {testOrder.length > 0 && !finished && (
                <div className="test-progress-info">
                  <div className="test-progress-bar">
                    <div 
                      className="test-progress-fill" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="test-stats">
                    <div className="test-stat">
                      <HiIcons.HiCheckCircle />
                      <span>Tiến độ: {progress}</span>
                    </div>
                    <div className="test-stat">
                      <HiIcons.HiStar />
                      <span>Điểm: {score}</span>
                    </div>
                  </div>
                </div>
              )}

              {currentTestCard && !finished && (
                <div className="test-card">
                  <div className="test-question-header">
                    <span className="test-question-number">Câu {testIdx + 1}</span>
                    <span className="test-question-total">/ {testOrder.length}</span>
                  </div>
                  <div className="test-question">{currentTestCard.front}</div>
                  <div className="test-options">
                    {currentTestCard.options.map((opt, idx) => {
                      const isSelected = selected === opt;
                      const isCorrect = opt === currentTestCard.answer;
                      const showResult = selected !== '';
                      
                      return (
                        <button
                          key={opt}
                          className={`test-option ${
                            showResult
                              ? isCorrect
                                ? 'correct'
                                : isSelected
                                ? 'wrong'
                                : ''
                              : ''
                          } ${isSelected ? 'selected' : ''}`}
                          onClick={() => selectOption(opt)}
                          disabled={!!selected}
                        >
                          <span className="option-letter">{letters[idx]}</span>
                          <span className="option-text">{opt}</span>
                          {showResult && isCorrect && (
                            <HiIcons.HiCheckCircle className="option-icon correct-icon" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <HiIcons.HiXCircle className="option-icon wrong-icon" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selected && (
                    <div className={`test-feedback ${selected === currentTestCard.answer ? 'feedback-correct' : 'feedback-wrong'}`}>
                      <div className="feedback-icon">
                        {selected === currentTestCard.answer ? (
                          <HiIcons.HiCheckCircle />
                        ) : (
                          <HiIcons.HiXCircle />
                        )}
                      </div>
                      <div className="feedback-text">
                        {feedback}
                      </div>
                    </div>
                  )}
                  {selected && (
                    <div className="test-explanation">
                      <div className="explanation-label">Giải thích:</div>
                      <div className="explanation-text">{currentTestCard.back}</div>
                    </div>
                  )}
                </div>
              )}

              {finished && (
                <div className="test-result">
                  <div className="result-icon">
                    <HiIcons.HiTrophy />
                  </div>
                  <h3 className="result-title">Hoàn thành!</h3>
                  <div className="result-score">
                    <span className="score-number">{score}</span>
                    <span className="score-total">/ {testOrder.length}</span>
                  </div>
                  <div className="result-percent">
                    {Math.round((score / testOrder.length) * 100)}%
                  </div>
                  <button className="test-restart-btn" onClick={startTest}>
                    <HiIcons.HiArrowPath />
                    Làm lại
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
