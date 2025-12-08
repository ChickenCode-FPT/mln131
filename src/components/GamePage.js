import { useState } from 'react';
import {
  GAME_AREA,
  PLAYER_RADIUS,
  ENEMY_RADIUS,
  BULLET_RADIUS,
  PLAYER_MAX_HP,
} from '../constants/game';
import useArenaGame from '../hooks/useStarGame';
import flashcards from '../data/flashcards';

const QUESTIONS = flashcards.map((c) => ({
  q: c.front,
  options: c.options ?? [c.back],
  answer: c.answer ?? c.back,
}));

function HealthBar({ health }) {
  return (
    <div className="health">
      {Array.from({ length: PLAYER_MAX_HP }).map((_, idx) => (
        <span key={idx} className={`heart ${idx < health ? 'full' : ''}`} />
      ))}
    </div>
  );
}

export default function GamePage() {
  const [question, setQuestion] = useState(null);
  const [used, setUsed] = useState(new Set());

  const {
    playing,
    paused,
    score,
    wave,
    health,
    player,
    enemies,
    bullets,
  bulletCount,
  bulletSpeed,
    startGame,
    resetGame,
    resumeNextWave,
  addBullet,
  addBulletSpeed,
  reduceBullet,
  reduceBulletSpeed,
  } = useArenaGame({
    onWaveClearQuestion: () => {
      const remaining = QUESTIONS.filter((q) => !used.has(q.q));
      const pick =
        remaining.length === 0
          ? QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
          : remaining[Math.floor(Math.random() * remaining.length)];
      setQuestion(pick);
      setUsed((prev) => {
        const n = new Set(prev);
        n.add(pick.q);
        return n;
      });
    },
  });

  const [answerFeedback, setAnswerFeedback] = useState('');
  const [answerCorrect, setAnswerCorrect] = useState(null);

  const answer = (opt) => {
    if (!question) return;
    const correct = opt === question.answer;
    if (correct) {
      if (Math.random() < 0.5) {
        addBullet();
        setAnswerFeedback('Đúng! +1 tia đạn');
      } else {
        addBulletSpeed();
        setAnswerFeedback('Đúng! + tốc độ đạn');
      }
    } else {
      if (Math.random() < 0.5) {
        reduceBullet();
        setAnswerFeedback('Sai! -1 tia đạn');
      } else {
        reduceBulletSpeed();
        setAnswerFeedback('Sai! - tốc độ đạn');
      }
    }
    setAnswerCorrect(correct);
    setTimeout(() => {
      setQuestion(null);
      setAnswerFeedback('');
      setAnswerCorrect(null);
      resumeNextWave();
    }, 900);
  };

  return (
    <div className="section">
      <div className="section-title">Arena Quiz: sống sót & nâng cấp hỏa lực</div>
      <div className="muted">
        Di chuyển WASD / phím mũi tên. Nhân vật tự bắn, tiêu diệt kẻ địch. Khi hết wave, bạn phải
        trả lời câu hỏi: đúng sẽ nhận thêm 1 tia đạn (đa tia); sai bỏ lỡ nâng cấp.
      </div>

      <div className="actions">
        <button onClick={startGame} disabled={playing}>
          {playing ? 'Đang chơi...' : 'Bắt đầu'}
        </button>
        <button className="ghost" onClick={resetGame}>
          Chơi lại
        </button>
      </div>

      <div className="hud">
        <HealthBar health={health} />
        <div className="chip alt">Wave: {wave}</div>
        <div className="chip">Điểm: {score}</div>
        <div className="chip">Tia đạn: {bulletCount.current}</div>
        <div className="chip">Tốc độ đạn: {bulletSpeed.current.toFixed(1)}</div>
      </div>

      <div
        className={`game-area ${playing ? 'playing' : 'paused'}`}
        style={{ width: GAME_AREA.width, height: GAME_AREA.height }}
      >
        <div
          className="player"
          style={{
            transform: `translate(${player.x - PLAYER_RADIUS}px, ${
              player.y - PLAYER_RADIUS
            }px)`,
          }}
        />

        {bullets.map((b) => (
          <div
            key={b.id}
            className="bullet"
            style={{
              transform: `translate(${b.x - BULLET_RADIUS}px, ${
                b.y - BULLET_RADIUS
              }px)`,
            }}
          />
        ))}

        {enemies.map((e) => (
          <div
            key={e.id}
            className="enemy"
            style={{
              transform: `translate(${e.x - ENEMY_RADIUS}px, ${
                e.y - ENEMY_RADIUS
              }px)`,
            }}
          />
        ))}

        {!playing && (
          <div className="overlay">
            <div>{health === 0 ? 'Hết máu!' : 'Nhấn Bắt đầu'}</div>
          </div>
        )}

        {question && (
          <div className="question-modal">
            <div className="question-card">
              <div className="block-title">Câu hỏi ôn tập</div>
              <div className="question-text">{question.q}</div>
              <div className="options">
                {question.options.map((opt) => (
                  <button key={opt} className="option" onClick={() => answer(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
              <div className={`feedback ${answerCorrect === false ? 'wrong' : 'correct'}`}>
                {answerFeedback}
              </div>
              <div className="hint muted">
                Đúng: +1 tia đạn hoặc + tốc độ đạn. Sai: -1 tia hoặc - tốc độ đạn.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="status-grid">
        <div className="stat">Điểm: <strong>{score}</strong></div>
        <div className="stat">Wave: <strong>{wave}</strong></div>
        <div className="stat">Máu: <strong>{health}/{PLAYER_MAX_HP}</strong></div>
        <div className="stat muted">Trả lời đúng: +1 tia đạn (tối đa 5)</div>
      </div>
    </div>
  );
}

