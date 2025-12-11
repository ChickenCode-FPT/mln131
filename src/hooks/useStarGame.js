import { useEffect, useRef, useState } from 'react';
import {
  GAME_AREA,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  PLAYER_MAX_HP,
  ENEMY_RADIUS,
  ENEMY_BASE_SPEED,
  BULLET_RADIUS,
  BULLET_SPEED,
  BULLET_SPEED_MIN,
  BULLET_SPEED_MAX,
  BASE_FIRE_DELAY,
  WAVE_ENEMY_BASE,
  WAVE_ENEMY_INC,
} from '../constants/game';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rand = (min, max) => Math.random() * (max - min) + min;

export default function useArenaGame({ onWaveClearQuestion } = {}) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [health, setHealth] = useState(PLAYER_MAX_HP);
  const [player, setPlayer] = useState({
    x: GAME_AREA.width / 2,
    y: GAME_AREA.height / 2,
  });
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [paused, setPaused] = useState(false);

  const pressedKeys = useRef(new Set());
  const loopRef = useRef(null);
  const playerRef = useRef({ x: GAME_AREA.width / 2, y: GAME_AREA.height / 2 });
  const enemiesRef = useRef([]);
  const bulletsRef = useRef([]);
  const fireTimer = useRef(null);
  const fireDelay = useRef(BASE_FIRE_DELAY);
  const bulletPerShot = useRef(1);
  const bulletSpeedRef = useRef(BULLET_SPEED);
  const bulletCountRef = useRef(1);
  const lastDamageTimeRef = useRef(0);
  const DAMAGE_COOLDOWN = 500; // ms: miễn sát thương trong khoảng thời gian này sau khi trúng hit

  // Input
  useEffect(() => {
    const down = (e) => pressedKeys.current.add(e.key.toLowerCase());
    const up = (e) => pressedKeys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const spawnWave = (waveNumber) => {
    const count = WAVE_ENEMY_BASE + (waveNumber - 1) * WAVE_ENEMY_INC;
    const spawned = [];
    for (let i = 0; i < count; i += 1) {
      const side = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;
      if (side === 0) {
        x = -ENEMY_RADIUS;
        y = rand(0, GAME_AREA.height);
      } else if (side === 1) {
        x = GAME_AREA.width + ENEMY_RADIUS;
        y = rand(0, GAME_AREA.height);
      } else if (side === 2) {
        x = rand(0, GAME_AREA.width);
        y = -ENEMY_RADIUS;
      } else {
        x = rand(0, GAME_AREA.width);
        y = GAME_AREA.height + ENEMY_RADIUS;
      }
      spawned.push({ id: crypto.randomUUID(), x, y, hp: 2 });
    }
    setEnemies(spawned);
    enemiesRef.current = spawned;
  };

  const shoot = () => {
    if (paused || !playing || enemiesRef.current.length === 0) return;
    const target = enemiesRef.current[0];
    if (!target) return;
    const dx = target.x - playerRef.current.x;
    const dy = target.y - playerRef.current.y;
    const len = Math.hypot(dx, dy) || 1;
    const baseAngle = Math.atan2(dy, dx);
    const spread = Math.max(0, bulletPerShot.current - 1) * 0.14; // radians total spread
    const step = bulletPerShot.current > 1 ? spread / (bulletPerShot.current - 1) : 0;
    const newBullets = [];
    for (let i = 0; i < bulletPerShot.current; i += 1) {
      const angle = baseAngle - spread / 2 + step * i;
      const vx = Math.cos(angle) * bulletSpeedRef.current;
      const vy = Math.sin(angle) * bulletSpeedRef.current;
      newBullets.push({
        id: crypto.randomUUID(),
        x: playerRef.current.x,
        y: playerRef.current.y,
        vx,
        vy,
      });
    }
    setBullets((b) => {
      const merged = [...b, ...newBullets];
      bulletsRef.current = merged;
      return merged;
    });
  };

  const startFireLoop = () => {
    clearInterval(fireTimer.current);
    fireTimer.current = setInterval(shoot, fireDelay.current);
  };

  // Game loop
  useEffect(() => {
    if (!playing || paused) {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      return;
    }

    const tick = () => {
      setPlayer((p) => {
        let { x, y } = p;
        const k = pressedKeys.current;
        const v = PLAYER_SPEED;
        if (k.has('arrowup') || k.has('w')) y -= v;
        if (k.has('arrowdown') || k.has('s')) y += v;
        if (k.has('arrowleft') || k.has('a')) x -= v;
        if (k.has('arrowright') || k.has('d')) x += v;
        x = clamp(x, PLAYER_RADIUS, GAME_AREA.width - PLAYER_RADIUS);
        y = clamp(y, PLAYER_RADIUS, GAME_AREA.height - PLAYER_RADIUS);
        const next = { x, y };
        playerRef.current = next;
        return next;
      });

      // move enemies toward player
      setEnemies((prev) => {
        const moved = prev.map((e) => {
          const dx = playerRef.current.x - e.x;
          const dy = playerRef.current.y - e.y;
          const len = Math.hypot(dx, dy) || 1;
          const speed = ENEMY_BASE_SPEED;
          return {
            ...e,
            x: e.x + (dx / len) * speed,
            y: e.y + (dy / len) * speed,
          };
        });
        enemiesRef.current = moved;
        return moved;
      });

      // move bullets
      setBullets((prev) => {
        const moved = prev
          .map((b) => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
          .filter(
            (b) =>
              b.x > -20 &&
              b.x < GAME_AREA.width + 20 &&
              b.y > -20 &&
              b.y < GAME_AREA.height + 20
          );
        bulletsRef.current = moved;
        return moved;
      });

      // collisions bullets vs enemies
      setEnemies((prevEnemies) => {
        const survivors = [];
        let localScore = 0;
        const enemiesCopy = prevEnemies.map((e) => ({ ...e }));
        const bulletUsed = new Set();

        for (let i = 0; i < bulletsRef.current.length; i += 1) {
          const b = bulletsRef.current[i];
          for (let j = 0; j < enemiesCopy.length; j += 1) {
            const e = enemiesCopy[j];
            const dx = b.x - e.x;
            const dy = b.y - e.y;
            const dist = Math.hypot(dx, dy);
            if (dist < BULLET_RADIUS + ENEMY_RADIUS) {
              e.hp -= 1;
              bulletUsed.add(b.id);
              break;
            }
          }
        }

        enemiesCopy.forEach((e) => {
          if (e.hp <= 0) {
            localScore += 5;
          } else {
            survivors.push(e);
          }
        });

        setScore((s) => s + localScore);
        setBullets((prevB) => prevB.filter((b) => !bulletUsed.has(b.id)));
        enemiesRef.current = survivors;
        return survivors;
      });

      // enemy hits player (giới hạn 1 tim và thêm thời gian miễn sát thương ngắn)
      setEnemies((prev) => {
        let damage = 0;
        const keep = [];
        for (const e of prev) {
          const dx = e.x - playerRef.current.x;
          const dy = e.y - playerRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < PLAYER_RADIUS + ENEMY_RADIUS) {
            damage += 1;
          } else {
            keep.push(e);
          }
        }
        if (damage) {
          const now = performance.now();
          if (now - lastDamageTimeRef.current > DAMAGE_COOLDOWN) {
            const damageTaken = 1; // tối đa 1 tim
            setHealth((h) => Math.max(0, h - damageTaken));
            lastDamageTimeRef.current = now;
          }
        }
        enemiesRef.current = keep;
        return keep;
      });

      // wave cleared
      if (enemiesRef.current.length === 0 && playing && !paused) {
        setPaused(true);
        if (onWaveClearQuestion) onWaveClearQuestion();
      }

      loopRef.current = requestAnimationFrame(tick);
    };

    loopRef.current = requestAnimationFrame(tick);
    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [playing, paused, onWaveClearQuestion]);

  useEffect(() => {
    if (playing && !paused) {
      startFireLoop();
    } else {
      clearInterval(fireTimer.current);
    }
    return () => clearInterval(fireTimer.current);
  }, [playing, paused]);

  useEffect(() => {
    if (health === 0) setPlaying(false);
  }, [health]);

  const startGame = () => {
    setScore(0);
    setWave(1);
    setHealth(PLAYER_MAX_HP);
    setBullets([]);
    setEnemies([]);
    setPaused(false);
    setPlaying(true);
    fireDelay.current = BASE_FIRE_DELAY;
    bulletPerShot.current = 1;
    bulletCountRef.current = 1;
    bulletSpeedRef.current = BULLET_SPEED;
    spawnWave(1);
    startFireLoop();
  };

  const resetGame = () => {
    setPlaying(false);
    setPaused(false);
    setWave(1);
    setScore(0);
    setHealth(PLAYER_MAX_HP);
    setBullets([]);
    setEnemies([]);
    fireDelay.current = BASE_FIRE_DELAY;
    bulletPerShot.current = 1;
    bulletCountRef.current = 1;
    bulletSpeedRef.current = BULLET_SPEED;
  };

  const resumeNextWave = () => {
    const next = wave + 1;
    setWave(next);
    setPaused(false);
    spawnWave(next);
  };

  const addBullet = () => {
    bulletPerShot.current = Math.min(5, bulletPerShot.current + 1);
    bulletCountRef.current = bulletPerShot.current;
  };
  const addBulletSpeed = () => {
    bulletSpeedRef.current = Math.min(
      BULLET_SPEED_MAX,
      bulletSpeedRef.current + 1
    );
  };
  const reduceBullet = () => {
    bulletPerShot.current = Math.max(1, bulletPerShot.current - 1);
    bulletCountRef.current = bulletPerShot.current;
  };
  const reduceBulletSpeed = () => {
    bulletSpeedRef.current = Math.max(
      BULLET_SPEED_MIN,
      bulletSpeedRef.current - 1
    );
  };

  const addScore = (points) => {
    setScore((s) => s + points);
  };

  return {
    playing,
    paused,
    score,
    wave,
    health,
    player,
    enemies,
    bullets,
    startGame,
    resetGame,
    resumeNextWave,
    addBullet,
    addBulletSpeed,
    reduceBullet,
    reduceBulletSpeed,
    addScore,
    bulletCount: bulletCountRef,
    bulletSpeed: bulletSpeedRef,
  };
}

