"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HeartItem = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  emoji: string;
  points: number;
  rotate: number;
  collected: boolean;
};

type FloatTextItem = {
  id: number;
  x: number;
  y: number;
  text: string;
};

type HeartCollectorProps = {
  targetScore?: number;
  gameDuration?: number;
  onSuccess?: () => void;
};

const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 560;

const HEART_TYPES = [
  { emoji: "💖", points: 1, size: 30 },
  { emoji: "💗", points: 1, size: 34 },
  { emoji: "💕", points: 2, size: 36 },
  { emoji: "💘", points: 3, size: 38 },
  { emoji: "💝", points: 4, size: 40 },
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function HeartCollector({
  targetScore = 30,
  gameDuration = 20,
  onSuccess,
}: HeartCollectorProps) {
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatTextItem[]>([]);
  const [score, setScore] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [isGameOver, setIsGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [message, setMessage] = useState("แตะหัวใจที่ลอยขึ้นมาให้ทันนะ 💖");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const heartIdRef = useRef(1);
  const floatIdRef = useRef(1);
  const animationRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const comboResetRef = useRef<NodeJS.Timeout | null>(null);
  const warmupTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const lastFrameRef = useRef(0);
  const unlockedRef = useRef(false);

  const progressPercent = useMemo(() => {
    return Math.min((score / targetScore) * 100, 100);
  }, [score, targetScore]);

  const clearAll = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (spawnRef.current) window.clearInterval(spawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (comboResetRef.current) clearTimeout(comboResetRef.current);

    warmupTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    warmupTimeoutsRef.current = [];
  };

  const addFloatingText = (x: number, y: number, text: string) => {
    const id = floatIdRef.current++;

    setFloatingTexts((prev) => [...prev, { id, x, y, text }]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 800);
  };

  const spawnHeart = () => {
    const type = HEART_TYPES[Math.floor(Math.random() * HEART_TYPES.length)];
    const isMobile =
      typeof window !== "undefined" ? window.innerWidth < 640 : false;

    const heart: HeartItem = {
      id: heartIdRef.current++,
      x: randomBetween(40, WORLD_WIDTH - 40),
      y: WORLD_HEIGHT + randomBetween(20, 80),
      size: isMobile ? Math.max(type.size - 2, 28) : type.size,
      speed: isMobile ? randomBetween(65, 105) : randomBetween(58, 100),
      drift: randomBetween(-24, 24),
      emoji: type.emoji,
      points: type.points,
      rotate: randomBetween(-16, 16),
      collected: false,
    };

    setHearts((prev) => [...prev, heart].slice(-(isMobile ? 18 : 26)));
  };

  const resetComboTimer = () => {
    if (comboResetRef.current) clearTimeout(comboResetRef.current);
    comboResetRef.current = setTimeout(() => {
      setCombo(0);
    }, 1100);
  };

  const startGame = () => {
    clearAll();

    unlockedRef.current = false;
    heartIdRef.current = 1;
    floatIdRef.current = 1;

    setHearts([]);
    setFloatingTexts([]);
    setScore(0);
    setCollectedCount(0);
    setMissedCount(0);
    setTimeLeft(gameDuration);
    setIsGameOver(false);
    setCombo(0);
    setBestCombo(0);
    setIsUnlocked(false);
    setMessage("แตะหัวใจที่ลอยขึ้นมาให้ทันนะ 💖");

    lastFrameRef.current = performance.now();

    for (let i = 0; i < 7; i++) {
      const timeout = setTimeout(() => spawnHeart(), i * 120);
      warmupTimeoutsRef.current.push(timeout);
    }

    spawnRef.current = window.setInterval(() => {
      spawnHeart();
    }, 380);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearAll();
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const loop = (now: number) => {
      const delta = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;

      setHearts((prev) => {
        let missedThisFrame = 0;

        const next = prev
          .map((heart) => ({
            ...heart,
            y: heart.y - heart.speed * delta,
            x: heart.x + heart.drift * delta,
          }))
          .filter((heart) => {
            if (heart.collected) return false;
            if (heart.y < -90) {
              missedThisFrame += 1;
              return false;
            }
            return true;
          });

        if (missedThisFrame > 0) {
          setMissedCount((prevMissed) => prevMissed + missedThisFrame);
          setCombo(0);
        }

        return next;
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    startGame();
    return () => clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!unlockedRef.current && score >= targetScore) {
      unlockedRef.current = true;
      setIsUnlocked(true);
      setMessage("ปลดล็อกเซอร์ไพรส์แล้ว 💌");
      onSuccess?.();
    }
  }, [score, targetScore, onSuccess]);

  useEffect(() => {
    if (!isGameOver) return;

    if (score >= targetScore) {
      setMessage("เก่งมาก 💖 คุณเก็บหัวใจได้ถึงเป้าแล้ว");
    } else if (score >= targetScore * 0.7) {
      setMessage("เกือบถึงแล้ว 💕 เล่นอีกนิดก็ผ่าน");
    } else {
      setMessage("น่ารักมาก ลองเล่นอีกครั้งเพื่อเก็บหัวใจเพิ่มนะ");
    }
  }, [isGameOver, score, targetScore]);

  const handleCollectHeart = (id: number) => {
    if (isGameOver) return;

    const target = hearts.find((heart) => heart.id === id && !heart.collected);
    if (!target) return;

    setHearts((prev) =>
      prev.map((heart) =>
        heart.id === id ? { ...heart, collected: true } : heart
      )
    );

    const nextCombo = combo + 1;
    const comboBonus = nextCombo >= 6 ? 2 : nextCombo >= 3 ? 1 : 0;
    const gained = target.points + comboBonus;

    setScore((prev) => prev + gained);
    setCollectedCount((prev) => prev + 1);
    setCombo(nextCombo);
    setBestCombo((prev) => Math.max(prev, nextCombo));

    addFloatingText(target.x, target.y, `+${gained}`);

    if (nextCombo >= 6) {
      setMessage(`สุดยอด! ${target.emoji} COMBO x${nextCombo} +${gained}`);
    } else {
      setMessage(`${target.emoji} +${gained}`);
    }

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(12);
    }

    resetComboTimer();

    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => heart.id !== id));
    }, 120);
  };

  return (
    <section className="mx-auto w-full max-w-6xl rounded-[24px] border border-pink-100 bg-gradient-to-br from-white via-rose-50 to-pink-100 p-3 shadow-xl sm:rounded-[32px] sm:p-6">
      <div className="mb-4 flex flex-col gap-4 rounded-[20px] bg-white/85 p-4 shadow-sm sm:mb-5 sm:rounded-[24px] sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-500 sm:text-sm sm:tracking-[0.2em]">
            Birthday Mini Game
          </p>
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Heart Collector 💖
          </h2>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm">
            แตะหัวใจที่ลอยขึ้นมาให้ได้มากที่สุดก่อนหมดเวลา
          </p>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
            เป้าหมาย: {targetScore} คะแนน
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <div className="rounded-2xl bg-rose-100 px-4 py-3 text-center">
            <p className="text-[11px] text-rose-700 sm:text-xs">Score</p>
            <p className="text-xl font-bold text-rose-600 sm:text-2xl">{score}</p>
          </div>

          <div className="rounded-2xl bg-pink-100 px-4 py-3 text-center">
            <p className="text-[11px] text-pink-700 sm:text-xs">Collected</p>
            <p className="text-xl font-bold text-pink-600 sm:text-2xl">
              {collectedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-violet-100 px-4 py-3 text-center">
            <p className="text-[11px] text-violet-700 sm:text-xs">Combo</p>
            <p className="text-xl font-bold text-violet-600 sm:text-2xl">
              x{combo}
            </p>
          </div>

          <div className="rounded-2xl bg-sky-100 px-4 py-3 text-center">
            <p className="text-[11px] text-sky-700 sm:text-xs">Time Left</p>
            <p className="text-xl font-bold text-sky-600 sm:text-2xl">
              {timeLeft}s
            </p>
          </div>

          <button
            type="button"
            onClick={startGame}
            className="col-span-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition active:scale-95 sm:col-span-1 hover:sm:scale-[1.02]"
          >
            เล่นใหม่
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-[18px] bg-white/80 p-4 shadow-sm sm:rounded-[20px]">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <span className="font-medium text-slate-600">Progress to Surprise</span>
          <span className="font-semibold text-rose-600">
            {score}/{targetScore}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-rose-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="mt-3 min-h-6 text-sm font-medium text-rose-600">
          {message}
        </p>

        {isUnlocked && !isGameOver && (
          <div className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            ปลดล็อกแล้ว 🎉
          </div>
        )}
      </div>

      <div
        className="relative w-full overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffe4ef_0%,#fff3f8_45%,#fffdfd_100%)] shadow-2xl"
        style={{ aspectRatio: `${WORLD_WIDTH} / ${WORLD_HEIGHT}` }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-4 top-4 text-2xl opacity-70 sm:left-8 sm:top-8 sm:text-3xl">
            ☁️
          </div>
          <div className="absolute right-4 top-6 text-3xl opacity-70 sm:right-10 sm:top-12 sm:text-4xl">
            ☁️
          </div>
          <div className="absolute left-[16%] top-14 text-xl opacity-60 sm:left-[18%] sm:top-24 sm:text-2xl">
            ✨
          </div>
          <div className="absolute right-[20%] top-16 text-xl opacity-60 sm:right-[22%] sm:top-28 sm:text-2xl">
            ✨
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-rose-200/70 to-transparent sm:h-24" />
        </div>

        {hearts.map((heart) => (
          <button
            key={heart.id}
            type="button"
            onClick={() => handleCollectHeart(heart.id)}
            disabled={isGameOver || heart.collected}
            className={`absolute flex items-center justify-center select-none touch-manipulation transition-transform active:scale-90 ${
              heart.collected ? "animate-ping opacity-0" : "hover:scale-110"
            }`}
            style={{
              left: `${(heart.x / WORLD_WIDTH) * 100}%`,
              top: `${(heart.y / WORLD_HEIGHT) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${heart.rotate}deg)`,
              fontSize: `clamp(22px, ${heart.size / 10}px + 1vw, ${heart.size}px)`,
              lineHeight: 1,
              minWidth: "40px",
              minHeight: "40px",
            }}
            aria-label="collect heart"
          >
            {heart.emoji}
          </button>
        ))}

        {floatingTexts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-none absolute animate-[floatScore_0.8s_ease-out_forwards] text-xs font-bold text-rose-600 sm:text-sm"
            style={{
              left: `${(item.x / WORLD_WIDTH) * 100}%`,
              top: `${(item.y / WORLD_HEIGHT) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {item.text}
          </div>
        ))}

        {!isGameOver && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium text-rose-500 shadow sm:bottom-4 sm:px-5 sm:py-2 sm:text-sm">
            Tap the floating hearts 💖
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/45 p-3 sm:p-4">
            <div className="w-full max-w-sm rounded-[24px] bg-white p-5 text-center shadow-2xl sm:max-w-md sm:rounded-[28px] sm:p-8">
              <div className="mb-3 text-5xl sm:text-6xl">💝</div>
              <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                เกมจบแล้ว
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-rose-50 p-3 sm:p-4">
                  <p className="text-[10px] text-rose-700 sm:text-xs">Score</p>
                  <p className="text-xl font-bold text-rose-600 sm:text-2xl">
                    {score}
                  </p>
                </div>
                <div className="rounded-2xl bg-pink-50 p-3 sm:p-4">
                  <p className="text-[10px] text-pink-700 sm:text-xs">
                    Collected
                  </p>
                  <p className="text-xl font-bold text-pink-600 sm:text-2xl">
                    {collectedCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-violet-50 p-3 sm:p-4">
                  <p className="text-[10px] text-violet-700 sm:text-xs">
                    Best Combo
                  </p>
                  <p className="text-xl font-bold text-violet-600 sm:text-2xl">
                    x{bestCombo}
                  </p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-3 sm:p-4">
                  <p className="text-[10px] text-sky-700 sm:text-xs">Missed</p>
                  <p className="text-xl font-bold text-sky-600 sm:text-2xl">
                    {missedCount}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {message}
              </div>

              <button
                type="button"
                onClick={startGame}
                className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition active:scale-95 hover:sm:scale-[1.02]"
              >
                เล่นอีกครั้ง
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes floatScore {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(10px) scale(0.8);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-28px) scale(1);
          }
        }
      `}</style>
    </section>
  );
}