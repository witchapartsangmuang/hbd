"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BalloonItem = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  popped: boolean;
};

const BALLOON_EMOJIS = ["🎈", "🎈", "🎈", "🎈", "🎈", "💖", "🎉"];
const GAME_TIME = 20;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createBalloon(id: number): BalloonItem {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return {
    id,
    left: randomBetween(6, 88),
    size: isMobile ? randomBetween(40, 64) : randomBetween(52, 86),
    duration: isMobile
      ? randomBetween(5.2, 8.2)
      : randomBetween(5.5, 9.5),
    delay: randomBetween(0, 1.2),
    emoji: BALLOON_EMOJIS[Math.floor(Math.random() * BALLOON_EMOJIS.length)],
    popped: false,
  };
}

export default function PopTheBalloon() {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [isGameOver, setIsGameOver] = useState(false);

  const idRef = useRef(1);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const poppedCount = useMemo(
    () => balloons.filter((b) => b.popped).length,
    [balloons]
  );

  const clearAllTimers = () => {
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const startGame = () => {
    clearAllTimers();
    setScore(0);
    setTimeLeft(GAME_TIME);
    setIsGameOver(false);
    idRef.current = 1;

    const initial: BalloonItem[] = Array.from({ length: 8 }, () =>
      createBalloon(idRef.current++)
    );
    setBalloons(initial);

    spawnIntervalRef.current = setInterval(() => {
      setBalloons((prev) => {
        const active = prev.filter((b) => !b.popped).slice(-18);
        return [...active, createBalloon(idRef.current++)];
      });
    }, 900);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearAllTimers();
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startGame();
    return () => clearAllTimers();
  }, []);

  const popBalloon = (id: number) => {
    if (isGameOver) return;

    let gained = 0;

    setBalloons((prev) =>
      prev.map((balloon) => {
        if (balloon.id === id && !balloon.popped) {
          gained = balloon.emoji === "💖" ? 3 : balloon.emoji === "🎉" ? 2 : 1;
          return { ...balloon, popped: true };
        }
        return balloon;
      })
    );

    if (gained > 0) {
      setScore((prev) => prev + gained);
    }

    setTimeout(() => {
      setBalloons((prev) => prev.filter((b) => b.id !== id));
    }, 220);
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-gradient-to-b from-pink-100 via-rose-50 to-sky-100">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-6">
        <header className="mb-3 rounded-[24px] border border-white/60 bg-white/75 p-4 shadow-lg backdrop-blur sm:mb-4 sm:rounded-3xl sm:p-5">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-500 sm:text-sm">
                Birthday Mini Game
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                Pop the Balloon 🎈
              </h1>
              <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                คลิกลูกโป่งให้แตกให้ได้มากที่สุดก่อนหมดเวลา
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
              <div className="rounded-2xl bg-rose-100 px-4 py-3 text-center">
                <p className="text-[11px] text-rose-700 sm:text-xs">Score</p>
                <p className="text-xl font-bold text-rose-600 sm:text-2xl">
                  {score}
                </p>
              </div>

              <div className="rounded-2xl bg-sky-100 px-4 py-3 text-center">
                <p className="text-[11px] text-sky-700 sm:text-xs">Time Left</p>
                <p className="text-xl font-bold text-sky-600 sm:text-2xl">
                  {timeLeft}s
                </p>
              </div>

              <div className="rounded-2xl bg-violet-100 px-4 py-3 text-center">
                <p className="text-[11px] text-violet-700 sm:text-xs">Popped</p>
                <p className="text-xl font-bold text-violet-600 sm:text-2xl">
                  {poppedCount}
                </p>
              </div>

              <button
                onClick={startGame}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition active:scale-95 sm:px-5 hover:sm:scale-[1.02]"
              >
                เล่นใหม่
              </button>
            </div>
          </div>
        </header>

        <section className="relative flex-1 overflow-hidden rounded-[28px] border border-white/60 bg-white/40 shadow-2xl backdrop-blur min-h-[62dvh] sm:min-h-[68dvh]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-4 top-6 text-2xl opacity-70 sm:left-6 sm:top-8 sm:text-3xl">
              ☁️
            </div>
            <div className="absolute right-5 top-12 text-3xl opacity-70 sm:right-10 sm:top-16 sm:text-4xl">
              ☁️
            </div>
            <div className="absolute left-[14%] top-16 text-xl opacity-60 sm:left-[18%] sm:top-20 sm:text-2xl">
              ✨
            </div>
            <div className="absolute right-[18%] top-24 text-xl opacity-60 sm:right-[22%] sm:top-28 sm:text-2xl">
              ✨
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pink-200/70 to-transparent sm:h-28" />

          {balloons.map((balloon) => (
            <button
              key={balloon.id}
              onClick={() => popBalloon(balloon.id)}
              disabled={balloon.popped || isGameOver}
              className={`absolute select-none touch-manipulation transition-transform active:scale-90 ${
                balloon.popped ? "animate-pop-out" : "animate-balloon-rise"
              }`}
              style={{
                left: `${balloon.left}%`,
                bottom: "-110px",
                fontSize: `${balloon.size}px`,
                animationDuration: balloon.popped
                  ? "220ms"
                  : `${balloon.duration}s`,
                animationDelay: balloon.popped ? "0s" : `${balloon.delay}s`,
              }}
              aria-label="balloon"
            >
              {balloon.popped ? "💥" : balloon.emoji}
            </button>
          ))}

          {isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/45 p-4">
              <div className="w-full max-w-sm rounded-[26px] bg-white p-6 text-center shadow-2xl sm:max-w-md sm:rounded-[28px] sm:p-8">
                <div className="mb-3 text-5xl sm:text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  เกมจบแล้ว
                </h2>
                <p className="mt-3 text-sm text-slate-600 sm:text-base">
                  คุณทำได้ทั้งหมด
                </p>
                <p className="mt-2 text-4xl font-extrabold text-rose-500 sm:text-5xl">
                  {score}
                </p>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">คะแนน</p>

                <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 sm:mt-6">
                  เยี่ยมมาก 🎂 พร้อมไปดูเซอร์ไพรส์ต่อได้เลย
                </div>

                <button
                  onClick={startGame}
                  className="mt-5 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition active:scale-95 sm:mt-6 hover:sm:scale-[1.02]"
                >
                  เล่นอีกครั้ง
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        @keyframes balloon-rise {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translateY(-22vh) translateX(-8px) rotate(-4deg);
          }
          50% {
            transform: translateY(-45vh) translateX(10px) rotate(4deg);
          }
          75% {
            transform: translateY(-68vh) translateX(-6px) rotate(-3deg);
          }
          100% {
            transform: translateY(-110vh) translateX(8px) rotate(3deg);
            opacity: 0.95;
          }
        }

        @keyframes pop-out {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }

        .animate-balloon-rise {
          animation-name: balloon-rise;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }

        .animate-pop-out {
          animation-name: pop-out;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </main>
  );
}