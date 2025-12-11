import { useState, useEffect, useRef } from 'react';
import {
  GAME_AREA,
  PLAYER_RADIUS,
  ENEMY_RADIUS,
  BULLET_RADIUS,
  PLAYER_MAX_HP,
} from '../constants/game';
import useArenaGame from '../hooks/useStarGame';
import flashcards, { gameQuestions } from '../data/flashcards';
import * as HiIcons from 'react-icons/hi2';
import * as FaIcons from 'react-icons/fa6';
import * as MdIcons from 'react-icons/md';
import { saveGameScore, getLeaderboard } from '../lib/supabase';

const sourceQuestions = (gameQuestions && gameQuestions.length ? gameQuestions : flashcards);
const QUESTIONS = sourceQuestions.map((c) => ({
  q: c.q || c.front, // gameQuestions uses 'q', flashcards uses 'front'
  options: c.options ?? [c.back],
  answer: c.answer ?? c.back,
}));

// Ngân hàng phần thưởng
const REWARD_BANK = {
  bullet: [
    { action: () => ({ type: 'bullet', value: 1 }), text: '+1 Tia đạn', desc: 'Tăng số lượng đạn bắn' },
    { action: () => ({ type: 'bullet', value: 2 }), text: '+2 Tia đạn', desc: 'Tăng nhiều đạn bắn' },
  ],
  score: [
    { action: () => ({ type: 'score', value: 50 }), text: '+50 Điểm', desc: 'Cộng điểm ngay' },
    { action: () => ({ type: 'score', value: 100 }), text: '+100 Điểm', desc: 'Cộng nhiều điểm' },
    { action: () => ({ type: 'score', value: 30 }), text: '+30 Điểm', desc: 'Cộng điểm nhỏ' },
  ],
  double: [
    { 
      action: (currentScore) => ({ 
        type: 'double', 
        value: currentScore, 
        penalty: { type: 'speed', value: -1 } 
      }), 
      text: 'x2 Điểm', 
      desc: 'Nhân đôi điểm (chậm tốc độ đạn)' 
    },
    { 
      action: (currentScore) => ({ 
        type: 'double', 
        value: Math.floor(currentScore * 1.5), 
        penalty: { type: 'bullet', value: -1 } 
      }), 
      text: 'x1.5 Điểm', 
      desc: 'Nhân 1.5 điểm (giảm 1 tia đạn)' 
    },
  ],
  mystery: [
    // Phần thưởng
    { action: () => ({ type: 'bullet', value: 1 }), text: 'Bí ẩn: +1 Tia đạn', desc: 'Phần thưởng', isReward: true },
    { action: () => ({ type: 'bullet', value: 2 }), text: 'Bí ẩn: +2 Tia đạn', desc: 'Phần thưởng', isReward: true },
    { action: () => ({ type: 'speed', value: 1 }), text: 'Bí ẩn: + Tốc độ đạn', desc: 'Phần thưởng', isReward: true },
    { action: () => ({ type: 'score', value: 100 }), text: 'Bí ẩn: +100 Điểm', desc: 'Phần thưởng', isReward: true },
    { action: () => ({ type: 'score', value: 200 }), text: 'Bí ẩn: +200 Điểm', desc: 'Phần thưởng lớn', isReward: true },
    // Phạt
    { action: () => ({ type: 'bullet', value: -1 }), text: 'Bí ẩn: -1 Tia đạn', desc: 'Phạt', isReward: false },
    { action: () => ({ type: 'speed', value: -1 }), text: 'Bí ẩn: - Tốc độ đạn', desc: 'Phạt', isReward: false },
    { action: () => ({ type: 'score', value: -50 }), text: 'Bí ẩn: -50 Điểm', desc: 'Phạt', isReward: false },
  ],
};

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

    const elements = document.querySelectorAll('.game-section, .game-hero');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

function HealthBar({ health }) {
  return (
    <div className="game-health-bar">
      {Array.from({ length: PLAYER_MAX_HP }).map((_, idx) => (
        <HiIcons.HiHeart
          key={idx}
          className={`game-heart ${idx < health ? 'full' : 'empty'}`}
        />
      ))}
    </div>
  );
}

export default function GamePage() {
  useScrollReveal();
  
  const [showGameModal, setShowGameModal] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
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
    startGame: originalStartGame,
    resetGame,
    resumeNextWave,
    addBullet,
    addBulletSpeed,
    reduceBullet,
    reduceBulletSpeed: originalReduceBulletSpeed,
    addScore,
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
  const [showRewardSelection, setShowRewardSelection] = useState(false);
  const [showRewardFeedback, setShowRewardFeedback] = useState(false);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [damageFlash, setDamageFlash] = useState(false);
  const prevHealth = useRef(health);

  // Hiển thị -1 tim khi bị trúng đạn/va chạm
  useEffect(() => {
    if (health < prevHealth.current) {
      setDamageFlash(true);
      setTimeout(() => setDamageFlash(false), 700);
    }
    prevHealth.current = health;
  }, [health]);

  // Random các phần thưởng có sẵn cho mỗi câu hỏi
  const generateAvailableRewards = () => {
    const allRewardTypes = ['bullet', 'score', 'double', 'mystery'];
    const available = [];
    
    // Luôn có ít nhất 2 phần thưởng
    const minRewards = 2;
    const maxRewards = 4;
    const numRewards = Math.floor(Math.random() * (maxRewards - minRewards + 1)) + minRewards;
    
    // Random các loại phần thưởng
    const shuffled = [...allRewardTypes].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numRewards && i < shuffled.length; i++) {
      available.push(shuffled[i]);
    }
    
    return available;
  };

  const answer = (opt) => {
    if (!question) return;
    const correct = opt === question.answer;
    if (correct) {
      // Random các phần thưởng có sẵn
      const rewards = generateAvailableRewards();
      setAvailableRewards(rewards);
      
      // Hiển thị reward selection modal ngay lập tức
      setAnswerCorrect(true);
      setQuestion(null);
      setTimeout(() => {
        setShowRewardSelection(true);
      }, 50);
    } else {
      // Sai: trừ điểm
      addScore(-10);
      setAnswerFeedback('Sai! -10 điểm');
      setAnswerCorrect(false);
      setTimeout(() => {
        setQuestion(null);
        setAnswerFeedback('');
        setAnswerCorrect(null);
        resumeNextWave();
      }, 1500);
    }
  };

  const selectReward = (rewardType) => {
    let rewardText = '';
    const currentScore = score;
    
    // Random từ ngân hàng phần thưởng
    let selectedReward;
    
    switch (rewardType) {
      case 'bullet': {
        const rewards = REWARD_BANK.bullet;
        selectedReward = rewards[Math.floor(Math.random() * rewards.length)];
        const result = selectedReward.action();
        if (result.value > 0) {
          for (let i = 0; i < result.value; i++) {
            addBullet();
          }
        }
        rewardText = `Đã nhận: ${selectedReward.text}`;
        break;
      }
      case 'score': {
        const rewards = REWARD_BANK.score;
        selectedReward = rewards[Math.floor(Math.random() * rewards.length)];
        const result = selectedReward.action();
        addScore(result.value);
        rewardText = `Đã nhận: ${selectedReward.text}`;
        break;
      }
      case 'double': {
        const rewards = REWARD_BANK.double;
        selectedReward = rewards[Math.floor(Math.random() * rewards.length)];
        const result = selectedReward.action(currentScore);
        addScore(result.value);
        rewardText = `Đã nhận: ${selectedReward.text} (+${result.value} điểm)`;
        
        // Áp dụng phạt nếu có
        if (result.penalty) {
          if (result.penalty.type === 'speed') {
            originalReduceBulletSpeed();
            rewardText += ' (chậm tốc độ đạn)';
          } else if (result.penalty.type === 'bullet') {
            reduceBullet();
            rewardText += ' (giảm 1 tia đạn)';
          }
        }
        break;
      }
      case 'mystery': {
        // Random từ ngân hàng bí ẩn (có cả phần thưởng và phạt)
        const rewards = REWARD_BANK.mystery;
        selectedReward = rewards[Math.floor(Math.random() * rewards.length)];
        const result = selectedReward.action();
        
        if (result.type === 'bullet') {
          if (result.value > 0) {
            for (let i = 0; i < result.value; i++) {
              addBullet();
            }
          } else {
            for (let i = 0; i < Math.abs(result.value); i++) {
              reduceBullet();
            }
          }
        } else if (result.type === 'speed') {
          if (result.value > 0) {
            addBulletSpeed();
          } else {
            originalReduceBulletSpeed();
          }
        } else if (result.type === 'score') {
          addScore(result.value);
        }
        
        rewardText = selectedReward.text;
        break;
      }
      default:
        break;
    }
    
    // Đóng reward modal và hiển thị feedback ngay
    setShowRewardSelection(false);
    setAnswerFeedback(rewardText);
    
    // Hiển thị feedback modal với delay ngắn
    setTimeout(() => {
      setShowRewardFeedback(true);
    }, 150);
    
    // Sau khi hiển thị feedback, tiếp tục game
    setTimeout(() => {
      setShowRewardFeedback(false);
      setQuestion(null);
      setAnswerFeedback('');
      setAnswerCorrect(null);
      resumeNextWave();
    }, 1800);
  };

  const letters = ['A', 'B', 'C', 'D'];

  // Load leaderboard when component mounts
  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Save score when game ends (health === 0)
  useEffect(() => {
    if (health === 0 && playing && playerName) {
      saveGameScore(playerName, score, wave, health);
    }
  }, [health, playing, playerName, score, wave]);

  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    const { data, error } = await getLeaderboard(10);
    if (!error && data) {
      // Đảm bảo sắp xếp theo điểm số giảm dần (không quan trọng thời gian)
      const sortedData = [...data].sort((a, b) => {
        // Chỉ sắp xếp theo điểm số
        return b.score - a.score;
      });
      setLeaderboardData(sortedData);
    }
    setLoadingLeaderboard(false);
  };

  const handleStartGame = () => {
    setShowNameForm(true);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      setShowNameForm(false);
      setShowGameModal(true);
      originalStartGame();
    }
  };

  // Restart ngay trong popup game (không cần nhập tên lại)
  const handleRestartGame = () => {
    resetGame();
    setQuestion(null);
    setAnswerFeedback('');
    setAnswerCorrect(null);
    setShowRewardSelection(false);
    setShowRewardFeedback(false);
    setAvailableRewards([]);
    originalStartGame();
  };

  const handleCloseModal = () => {
    setShowGameModal(false);
    resetGame();
    setQuestion(null);
    setAnswerFeedback('');
    setAnswerCorrect(null);
    setPlayerName('');
  };

  const handleShowLeaderboard = async () => {
    setShowLeaderboard(true);
    await loadLeaderboard();
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  return (
    <div className="game-page">
      {/* Hero Section */}
      <section className="game-hero">
        <div className="game-hero-content">
          <div className="section-header">
            <div className="section-header-icon">
              <FaIcons.FaGamepad />
            </div>
            <h1 className="section-title">Arena Quiz</h1>
          </div>
          <p className="section-desc">
            Di chuyển bằng WASD hoặc phím mũi tên. Nhân vật tự động bắn, tiêu diệt kẻ địch. 
            Khi hết wave, trả lời câu hỏi đúng để nhận phần thưởng nâng cấp hỏa lực!
          </p>
        </div>
      </section>

      <div className="game-main-container">
        {/* Game Section */}
        <section className="game-section">
          {/* Game Preview Area */}
          <div className="game-area-wrapper">
            <div
              className="game-area game-area-preview"
              style={{ width: GAME_AREA.width, height: GAME_AREA.height }}
            >
              {/* Preview Overlay with Start Button */}
              <div className="game-preview-overlay">
                <div className="game-preview-content">
                  <HiIcons.HiPlay className="game-preview-icon" />
                  <div className="game-preview-text">Nhấn Bắt đầu để chơi</div>
                  <button 
                    className="game-preview-btn" 
                    onClick={handleStartGame}
                  >
                    <HiIcons.HiPlay />
                    Bắt đầu chơi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="game-controls">
            <button 
              className="game-btn game-btn-primary" 
              onClick={handleShowLeaderboard}
            >
              <HiIcons.HiTrophy />
              Bảng xếp hạng
            </button>
          </div>

          {/* Game Info - Preview */}
          <div className="game-info">
            <div className="game-info-item">
              <HiIcons.HiTrophy className="game-info-icon" />
              <div className="game-info-content">
                <div className="game-info-label">Điểm số cao nhất</div>
                <div className="game-info-value">{score}</div>
              </div>
            </div>
            <div className="game-info-item">
              <FaIcons.FaWaveSquare className="game-info-icon" />
              <div className="game-info-content">
                <div className="game-info-label">Wave cao nhất</div>
                <div className="game-info-value">{wave}</div>
              </div>
            </div>
            <div className="game-info-item">
              <HiIcons.HiInformationCircle className="game-info-icon" />
              <div className="game-info-content">
                <div className="game-info-label">Hướng dẫn</div>
                <div className="game-info-value">WASD để di chuyển</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Game Modal */}
      {showGameModal && (
        <div className="game-modal-overlay" onClick={handleCloseModal}>
          <div className="game-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="game-modal-close" onClick={handleCloseModal}>
              <HiIcons.HiXMark />
            </button>

            {/* HUD */}
            <div className="game-hud">
              <div className="game-hud-item health-item">
                <HealthBar health={health} />
                {damageFlash && <div className="health-damage-indicator">-1 tim</div>}
              </div>
              <div className="game-hud-item">
                <HiIcons.HiTrophy className="game-hud-icon" />
                <span className="game-hud-label">Điểm</span>
                <span className="game-hud-value">{score}</span>
              </div>
              <div className="game-hud-item">
                <FaIcons.FaWaveSquare className="game-hud-icon" />
                <span className="game-hud-label">Wave</span>
                <span className="game-hud-value">{wave}</span>
              </div>
              <div className="game-hud-item">
                <FaIcons.FaBolt className="game-hud-icon" />
                <span className="game-hud-label">Tia đạn</span>
                <span className="game-hud-value">{bulletCount.current}</span>
              </div>
              <div className="game-hud-item">
                <HiIcons.HiBolt className="game-hud-icon" />
                <span className="game-hud-label">Tốc độ</span>
                <span className="game-hud-value">{bulletSpeed.current.toFixed(1)}</span>
              </div>
            </div>

            {/* Game Area */}
            <div className="game-area-wrapper">
              <div
                className={`game-area ${playing ? 'playing' : 'paused'}`}
                style={{ width: GAME_AREA.width, height: GAME_AREA.height }}
              >
                <div
                  className="game-player"
                  style={{
                    transform: `translate(${player.x - PLAYER_RADIUS}px, ${
                      player.y - PLAYER_RADIUS
                    }px)`,
                  }}
                />
                {bullets.map((b) => (
                  <div
                    key={b.id}
                    className="game-bullet"
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
                    className="game-enemy"
                    style={{
                      transform: `translate(${e.x - ENEMY_RADIUS}px, ${
                        e.y - ENEMY_RADIUS
                      }px)`,
                    }}
                  />
                ))}
                {!playing && (
                  <div className="game-overlay">
                    <div className="game-overlay-content">
                      {health === 0 ? (
                        <>
                          <HiIcons.HiXCircle className="game-overlay-icon" />
                          <div className="game-overlay-text">Hết máu!</div>
                        </>
                      ) : (
                        <>
                          <HiIcons.HiPlay className="game-overlay-icon" />
                          <div className="game-overlay-text">Nhấn Bắt đầu để chơi</div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {question && (
                  <div className="game-question-modal">
                    <div className="game-question-card">
                      <div className="game-question-header">
                        <HiIcons.HiClipboardDocumentCheck className="game-question-icon" />
                        <h3 className="game-question-title">Câu hỏi ôn tập</h3>
                      </div>
                      <div className="game-question-text">{question.q}</div>
                      <div className="game-question-options">
                        {question.options.map((opt, idx) => (
                          <button
                            key={opt}
                            className={`game-question-option ${
                              answerFeedback && !answerCorrect && opt === question.answer
                                ? 'correct-answer'
                                : ''
                            }`}
                            onClick={() => answer(opt)}
                            disabled={!!answerFeedback || showRewardSelection}
                          >
                            <span className="game-option-letter">{letters[idx]}</span>
                            <span className="game-option-text">{opt}</span>
                          </button>
                        ))}
                      </div>
                      {answerFeedback && (
                        <div className={`game-question-feedback ${answerCorrect ? 'correct' : 'wrong'}`}>
                          <div className="game-feedback-icon">
                            {answerCorrect ? (
                              <HiIcons.HiCheckCircle />
                            ) : (
                              <HiIcons.HiXCircle />
                            )}
                          </div>
                          <div className="game-feedback-text">{answerFeedback}</div>
                        </div>
                      )}
                      {!answerFeedback && (
                        <div className="game-question-hint">
                          <HiIcons.HiInformationCircle />
                          <span>Trả lời đúng để chọn phần thưởng. Sai sẽ bị trừ điểm.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Game Controls in Modal */}
            <div className="game-controls">
              <button className="game-btn game-btn-secondary" onClick={handleRestartGame}>
                <HiIcons.HiArrowPath />
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Name Form Modal */}
      {showNameForm && (
        <div className="game-modal-overlay" onClick={() => setShowNameForm(false)}>
          <div className="game-name-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="game-name-form-header">
              <HiIcons.HiUser className="game-name-form-icon" />
              <h3 className="game-name-form-title">Nhập tên của bạn</h3>
            </div>
            <form onSubmit={handleNameSubmit} className="game-name-form">
              <input
                type="text"
                className="game-name-input"
                placeholder="Nhập tên của bạn..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                autoFocus
                required
              />
              <div className="game-name-form-actions">
                <button
                  type="button"
                  className="game-btn game-btn-secondary"
                  onClick={() => setShowNameForm(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="game-btn game-btn-primary"
                  disabled={!playerName.trim()}
                >
                  <HiIcons.HiPlay />
                  Bắt đầu chơi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reward Selection Modal */}
      {showRewardSelection && (
        <div className="game-modal-overlay game-reward-overlay">
          <div className="game-reward-modal game-reward-modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="game-reward-modal-header">
              <HiIcons.HiCheckCircle className="reward-title-icon" />
              <h3 className="game-reward-modal-title">Chọn phần thưởng của bạn!</h3>
            </div>
            <div className="game-reward-options">
              {availableRewards.includes('bullet') && (
                <button
                  className="game-reward-option"
                  onClick={() => selectReward('bullet')}
                >
                  <FaIcons.FaBolt className="reward-icon" />
                  <div className="reward-label">Tia đạn</div>
                  <div className="reward-desc">Random: +1 hoặc +2 tia đạn</div>
                </button>
              )}
              {availableRewards.includes('score') && (
                <button
                  className="game-reward-option"
                  onClick={() => selectReward('score')}
                >
                  <HiIcons.HiStar className="reward-icon" />
                  <div className="reward-label">Điểm số</div>
                  <div className="reward-desc">Random: +30, +50 hoặc +100 điểm</div>
                </button>
              )}
              {availableRewards.includes('double') && (
                <button
                  className="game-reward-option"
                  onClick={() => selectReward('double')}
                >
                  <HiIcons.HiSparkles className="reward-icon" />
                  <div className="reward-label">Nhân điểm</div>
                  <div className="reward-desc">x2 hoặc x1.5 điểm (có điều kiện)</div>
                </button>
              )}
              {availableRewards.includes('mystery') && (
                <button
                  className="game-reward-option"
                  onClick={() => selectReward('mystery')}
                >
                  <HiIcons.HiQuestionMarkCircle className="reward-icon" />
                  <div className="reward-label">Bí ẩn</div>
                  <div className="reward-desc">Có thể là phần thưởng hoặc phạt!</div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reward Feedback Modal */}
      {showRewardFeedback && answerFeedback && (
        <div className="game-modal-overlay game-reward-overlay">
          <div className="game-reward-feedback-modal game-reward-modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="game-reward-feedback-content">
              <div className={`reward-feedback-icon ${answerFeedback.includes('Bí ẩn: -') || answerFeedback.includes('phạt') ? 'penalty' : 'reward'}`}>
                {answerFeedback.includes('Bí ẩn: -') || answerFeedback.includes('phạt') ? (
                  <HiIcons.HiExclamationTriangle />
                ) : (
                  <HiIcons.HiCheckCircle />
                )}
              </div>
              <h3 className="reward-feedback-title">
                {answerFeedback.includes('Bí ẩn: -') || answerFeedback.includes('phạt') ? 'Phạt!' : 'Phần thưởng!'}
              </h3>
              <div className="reward-feedback-text">{answerFeedback}</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="game-modal-overlay" onClick={handleCloseLeaderboard}>
          <div className="game-leaderboard-modal" onClick={(e) => e.stopPropagation()}>
            <button className="game-modal-close" onClick={handleCloseLeaderboard}>
              <HiIcons.HiXMark />
            </button>
            <div className="game-leaderboard-header">
              <HiIcons.HiTrophy className="game-leaderboard-icon" />
              <h3 className="game-leaderboard-title">Bảng xếp hạng</h3>
            </div>
            {loadingLeaderboard ? (
              <div className="game-leaderboard-loading">
                <HiIcons.HiArrowPath className="spinning" />
                <span>Đang tải...</span>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="game-leaderboard-empty">
                <HiIcons.HiExclamationCircle />
                <p>Chưa có dữ liệu</p>
              </div>
            ) : (
              <div className="game-leaderboard-list">
                {leaderboardData.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`game-leaderboard-item ${
                      index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''
                    }`}
                  >
                    <div className="leaderboard-rank">
                      {index === 0 ? (
                        <HiIcons.HiTrophy className="rank-icon gold" />
                      ) : index === 1 ? (
                        <HiIcons.HiTrophy className="rank-icon silver" />
                      ) : index === 2 ? (
                        <HiIcons.HiTrophy className="rank-icon bronze" />
                      ) : (
                        <span className="rank-number">{index + 1}</span>
                      )}
                    </div>
                    <div className="leaderboard-name">{entry.player_name}</div>
                    <div className="leaderboard-score">
                      <HiIcons.HiStar />
                      {entry.score}
                    </div>
                    <div className="leaderboard-date">
                      {new Date(entry.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

