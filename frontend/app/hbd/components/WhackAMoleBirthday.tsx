"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type HoleItem = {
  id: number;
  emoji: string;
  isVisible: boolean;
  isHit: boolean;
  startedAt: number | null;
  hideAt: number | null;
};

const GAME_DURATION = 20;
const HOLE_COUNT = 9;

const CHARACTERS = ["🎁", "🧸", "🎈", "💖", "🎂", "✨"];
const BONUS_CHARACTERS = ["💝", "🌟"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createInitialHoles(): HoleItem[] {
  return Array.from({ length: HOLE_COUNT }, (_, index) => ({
    id: index + 1,
    emoji: "🎁",
    isVisible: false,
    isHit: false,
    startedAt: null,
    hideAt: null,
  }));
}

export default function WhackAMoleBirthday() {
  const [holes, setHoles] = useState<HoleItem[]>(createInitialHoles());
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("เตรียมตัวตีให้ทันนะ 🎯");

  const gameLoopRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpawnRef = useRef<number>(0);

  const accuracy = useMemo(() => {
    const total = hits + misses;
    if (total === 0) return 100;
    return Math.round((hits / total) * 100);
  }, [hits, misses]);

  const clearAll = () => {
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetVisibleExpired = (now: number) => {
    setHoles((prev) => {
      let expiredCount = 0;

      const next = prev.map((hole) => {
        if (
          hole.isVisible &&
          !hole.isHit &&
          hole.hideAt !== null &&
          now >= hole.hideAt
        ) {
          expiredCount += 1;
          return {
            ...hole,
            isVisible: false,
            isHit: false,
            startedAt: null,
            hideAt: null,
          };
        }

        if (
          hole.isVisible &&
          hole.isHit &&
          hole.hideAt !== null &&
          now >= hole.hideAt
        ) {
          return {
            ...hole,
            isVisible: false,
            isHit: false,
            startedAt: null,
            hideAt: null,
          };
        }

        return hole;
      });

      if (expiredCount > 0) {
        setMisses((prevMisses) => prevMisses + expiredCount);
        setStreak(0);
        setMessage("พลาดไปนิดนึง ลองอีก! 💨");
      }

      return next;
    });
  };

  const spawnCharacter = (now: number) => {
    setHoles((prev) => {
      const hiddenIndexes = prev
        .map((hole, index) => (!hole.isVisible ? index : -1))
        .filter((index) => index !== -1);

      if (hiddenIndexes.length === 0) return prev;

      const pickIndex =
        hiddenIndexes[randomInt(0, hiddenIndexes.length - 1)];

      const useBonus = Math.random() < 0.15;
      const emoji = useBonus
        ? BONUS_CHARACTERS[randomInt(0, BONUS_CHARACTERS.length - 1)]
        : CHARACTERS[randomInt(0, CHARACTERS.length - 1)];

      const isMobile =
        typeof window !== "undefined" ? window.innerWidth < 640 : false;

      const duration = useBonus
        ? randomInt(isMobile ? 700 : 650, isMobile ? 980 : 900)
        : randomInt(isMobile ? 920 : 850, isMobile ? 1450 : 1300);

      return prev.map((hole, index) =>
        index === pickIndex
          ? {
              ...hole,
              emoji,
              isVisible: true,
              isHit: false,
              startedAt: now,
              hideAt: now + duration,
            }
          : hole
      );
    });
  };

  const startGame = () => {
    clearAll();

    setHoles(createInitialHoles());
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    setBestStreak(0);
    setStreak(0);
    setMessage("เริ่มเกมแล้ว! คลิกให้ทัน 🎉");

    lastSpawnRef.current = performance.now();

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
      resetVisibleExpired(now);

      const isMobile =
        typeof window !== "undefined" ? window.innerWidth < 640 : false;

      if (now - lastSpawnRef.current >= randomInt(isMobile ? 460 : 380, isMobile ? 760 : 700)) {
        spawnCharacter(now);
        lastSpawnRef.current = now;
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    startGame();
    return () => clearAll();
  }, []);

  useEffect(() => {
    if (!isGameOver) return;

    if (score >= 25) {
      setMessage("สุดยอดมาก 💖 พร้อมไปดูเซอร์ไพรส์ต่อได้เลย");
    } else if (score >= 16) {
      setMessage("เก่งมาก! อีกนิดเดียวจะทำสถิติได้ดีกว่านี้ 🎁");
    } else {
      setMessage("น่ารักมาก ลองเล่นอีกครั้งเพื่อทำคะแนนเพิ่มนะ");
    }
  }, [isGameOver, score]);

  const handleHit = (holeId: number) => {
    if (isGameOver) return;

    let gained = 0;
    let hitEmoji = "🎁";

    setHoles((prev) =>
      prev.map((hole) => {
        if (hole.id === holeId && hole.isVisible && !hole.isHit) {
          hitEmoji = hole.emoji;
          gained = BONUS_CHARACTERS.includes(hole.emoji) ? 3 : 1;
          return {
            ...hole,
            isHit: true,
            hideAt: performance.now() + 180,
          };
        }
        return hole;
      })
    );

    if (gained > 0) {
      const nextStreak = streak + 1;
      const streakBonus = nextStreak > 0 && nextStreak % 5 === 0 ? 2 : 0;
      const totalGain = gained + streakBonus;

      setScore((prev) => prev + totalGain);
      setHits((prev) => prev + 1);
      setStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));

      if (streakBonus > 0) {
        setMessage(`${hitEmoji} เยี่ยมเลย! STREAK x${nextStreak} +${totalGain}`);
      } else {
        setMessage(`${hitEmoji} โดนแล้ว! +${totalGain}`);
      }

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(12);
      }
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl rounded-[24px] border border-pink-100 bg-gradient-to-br from-white via-rose-50 to-pink-100 p-3 shadow-xl sm:rounded-[32px] sm:p-6">
      <div className="mb-4 flex flex-col gap-4 rounded-[20px] bg-white/85 p-4 shadow-sm sm:mb-5 sm:rounded-[24px] sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-500 sm:text-sm sm:tracking-[0.2em]">
            Birthday Mini Game
          </p>
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Whack-a-Mole Style 🎯
          </h2>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm">
            คลิกตัวละครที่โผล่ขึ้นมาให้ทันก่อนจะหายไป
          </p>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
            ตัวพิเศษ 💝 / 🌟 ได้คะแนนมากกว่า
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <div className="rounded-2xl bg-rose-100 px-4 py-3 text-center">
            <p className="text-[11px] text-rose-700 sm:text-xs">Score</p>
            <p className="text-xl font-bold text-rose-600 sm:text-2xl">{score}</p>
          </div>

          <div className="rounded-2xl bg-pink-100 px-4 py-3 text-center">
            <p className="text-[11px] text-pink-700 sm:text-xs">Hits</p>
            <p className="text-xl font-bold text-pink-600 sm:text-2xl">{hits}</p>
          </div>

          <div className="rounded-2xl bg-sky-100 px-4 py-3 text-center">
            <p className="text-[11px] text-sky-700 sm:text-xs">Accuracy</p>
            <p className="text-xl font-bold text-sky-600 sm:text-2xl">{accuracy}%</p>
          </div>

          <div className="rounded-2xl bg-violet-100 px-4 py-3 text-center">
            <p className="text-[11px] text-violet-700 sm:text-xs">Time Left</p>
            <p className="text-xl font-bold text-violet-600 sm:text-2xl">
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
          <span className="font-medium text-slate-600">Current Status</span>
          <span className="font-semibold text-rose-600">
            Streak x{streak} · Best x{bestStreak}
          </span>
        </div>
        <p className="min-h-6 text-sm font-medium text-rose-600">{message}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffe4ef_0%,#fff3f8_45%,#fffdfd_100%)] p-3 shadow-2xl sm:gap-4 sm:rounded-[28px] sm:p-5">
        {holes.map((hole) => (
          <button
            key={hole.id}
            type="button"
            onClick={() => handleHit(hole.id)}
            disabled={!hole.isVisible || hole.isHit || isGameOver}
            className="group relative aspect-square overflow-hidden rounded-[20px] border border-rose-100 bg-white/75 shadow-sm select-none touch-manipulation sm:rounded-[28px]"
          >
            <div className="absolute inset-x-0 top-2 text-center text-lg opacity-35 sm:top-3 sm:text-2xl">
              ✨
            </div>

            <div className="absolute inset-x-0 bottom-1.5 flex justify-center sm:bottom-2">
              <div className="h-12 w-[78%] rounded-full bg-gradient-to-b from-amber-200 to-amber-400 shadow-inner sm:h-16" />
            </div>

            <div
              className={`absolute left-1/2 bottom-7 flex -translate-x-1/2 items-center justify-center transition-all duration-200 sm:bottom-10 ${
                hole.isVisible
                  ? hole.isHit
                    ? "translate-y-6 scale-125 opacity-0"
                    : "translate-y-0 opacity-100"
                  : "translate-y-16 opacity-0"
              }`}
            >
              <span className="text-3xl sm:text-5xl">
                {hole.isHit ? "💥" : hole.emoji}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-3 flex justify-center sm:bottom-5">
              <div className="h-8 w-[86%] rounded-full bg-gradient-to-b from-rose-500 to-rose-700 shadow-lg sm:h-10" />
            </div>
          </button>
        ))}
      </div>

      {isGameOver && (
        <div className="mt-5 rounded-[20px] bg-white/85 p-5 text-center shadow-lg sm:mt-6 sm:rounded-[24px] sm:p-6">
          <div className="mb-3 text-5xl sm:text-6xl">🎉</div>
          <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            เกมจบแล้ว
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl bg-rose-50 p-3 sm:p-4">
              <p className="text-[10px] text-rose-700 sm:text-xs">Score</p>
              <p className="text-xl font-bold text-rose-600 sm:text-2xl">{score}</p>
            </div>
            <div className="rounded-2xl bg-pink-50 p-3 sm:p-4">
              <p className="text-[10px] text-pink-700 sm:text-xs">Hits</p>
              <p className="text-xl font-bold text-pink-600 sm:text-2xl">{hits}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3 sm:p-4">
              <p className="text-[10px] text-sky-700 sm:text-xs">Misses</p>
              <p className="text-xl font-bold text-sky-600 sm:text-2xl">{misses}</p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-3 sm:p-4">
              <p className="text-[10px] text-violet-700 sm:text-xs">
                Best Streak
              </p>
              <p className="text-xl font-bold text-violet-600 sm:text-2xl">
                x{bestStreak}
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
      )}
    </section>
  );
}