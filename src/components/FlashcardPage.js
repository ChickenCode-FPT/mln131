import { useMemo, useState } from 'react';
import flashcards from '../data/flashcards';

const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
const letters = ['A', 'B', 'C', 'D'];

export default function FlashcardPage() {
  // Học nhanh (lật thẻ)
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = useMemo(() => flashcards[index], [index]);

  // Chế độ test trắc nghiệm
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
    }, 900);
  };

  const progress = testOrder.length ? `${answered}/${testOrder.length}` : '0/0';

  return (
    <div className="section fc-layout">
      <div>
        <div className="section-title">Flashcard ôn tập</div>
        <div className="flashcard">
          <div
            className={`flashcard-inner ${flipped ? 'flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
          >
            <div className="flashcard-face front">{card.front}</div>
            <div className="flashcard-face back">{card.back}</div>
          </div>
        </div>
        <div className="actions center">
          <button onClick={prev}>Trước</button>
          <div className="muted">
            {index + 1} / {flashcards.length}
          </div>
          <button onClick={next}>Sau</button>
        </div>
        <div className="hint">Nhấn vào thẻ để lật mặt sau.</div>
      </div>

      <div className="test-panel card">
        <div className="section-title">Test trắc nghiệm (ABCD)</div>
        <div className="muted">
          Bấm “Bắt đầu test” để xáo trộn câu hỏi. Chọn đáp án đúng, hệ thống tự chấm điểm.
        </div>

        <div className="actions" style={{ marginTop: 10 }}>
          <button onClick={startTest}>Bắt đầu test</button>
          <div className="chip alt">Tiến độ: {progress}</div>
          <div className="chip">Điểm: {score}</div>
        </div>

        {currentTestCard && !finished && (
          <div className="test-card">
            <div className="question-text">{currentTestCard.front}</div>
            <div className="options">
              {currentTestCard.options.map((opt, idx) => (
                <button
                  key={opt}
                  className={`option ${
                    selected
                      ? opt === currentTestCard.answer
                        ? 'correct'
                        : opt === selected
                        ? 'wrong'
                        : ''
                      : ''
                  }`}
                  onClick={() => selectOption(opt)}
                  disabled={!!selected}
                >
                  <strong>{letters[idx]}.</strong> {opt}
                </button>
              ))}
            </div>
            <div className="feedback" style={{ marginTop: 8 }}>
              {feedback}
            </div>
            {selected ? (
              <div className="answer-box">{currentTestCard.back}</div>
            ) : null}
          </div>
        )}

        {finished && (
          <div className="result-box">
            <div className="block-title">Hoàn thành</div>
            <div className="muted">
              Điểm: {score}/{testOrder.length} · Bấm “Bắt đầu test” để làm lại.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

