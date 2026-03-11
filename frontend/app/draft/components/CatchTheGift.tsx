"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type GiftItem = {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  emoji: string;
  points: number;
};

const GAME_DURATION = 20;

// ใช้เป็น world size ภายในเกม
const WORLD_WIDTH = 900;
const WORLD_HEIGHT = 520;
const BASKET_WIDTH = 120;
const BASKET_HEIGHT = 52;

const GIFT_TYPES = [
  { emoji: "🎁", points: 1, size: 42 },
  { emoji: "🎀", points: 2, size: 38 },
  { emoji: "💖", points: 3, size: 36 },
  { emoji: "🍬", points: 1, size: 34 },
  { emoji: "⭐", points: 2, size: 32 },
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function CatchTheGift() {
  const [basketX, setBasketX] = useState(WORLD_WIDTH / 2 - BASKET_WIDTH / 2);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [flash, setFlash] = useState<null | "catch" | "miss">(null);

  const areaRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFrameRef = useRef<number>(0);
  const giftIdRef = useRef(1);
  const moveLeftRef = useRef(false);
  const moveRightRef = useRef(false);
  const basketXRef = useRef(WORLD_WIDTH / 2 - BASKET_WIDTH / 2);

  const accuracy = useMemo(() => {
    const total = caught + missed;
    if (total === 0) return 0;
    return Math.round((caught / total) * 100);
  }, [caught, missed]);

  const clearAll = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (spawnRef.current) window.clearInterval(spawnRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const spawnGift = () => {
    const type = GIFT_TYPES[Math.floor(Math.random() * GIFT_TYPES.length)];

    const newGift: GiftItem = {
      id: giftIdRef.current++,
      x: randomBetween(10, WORLD_WIDTH - 60),
      y: -50,
      speed: randomBetween(160, 280),
      size: type.size,
      emoji: type.emoji,
      points: type.points,
    };

    setGifts((prev) => [...prev, newGift]);
  };

  const startGame = () => {
    clearAll();

    const initialBasketX = WORLD_WIDTH / 2 - BASKET_WIDTH / 2;

    setBasketX(initialBasketX);
    basketXRef.current = initialBasketX;
    setGifts([]);
    setScore(0);
    setCaught(0);
    setMissed(0);
    setTimeLeft(GAME_DURATION);
    setIsGameOver(false);
    setFlash(null);

    giftIdRef.current = 1;
    moveLeftRef.current = false;
    moveRightRef.current = false;
    lastFrameRef.current = performance.now();

    spawnRef.current = window.setInterval(() => {
      spawnGift();
    }, 650);

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

      // keyboard movement
      if (moveLeftRef.current || moveRightRef.current) {
        let next = basketXRef.current;
        const speed = 440;

        if (moveLeftRef.current) next -= speed * delta;
        if (moveRightRef.current) next += speed * delta;

        next = clamp(next, 0, WORLD_WIDTH - BASKET_WIDTH);
        basketXRef.current = next;
        setBasketX(next);
      }

      setGifts((prev) => {
        const next: GiftItem[] = [];
        let catchCount = 0;
        let catchScore = 0;
        let missCount = 0;

        const currentBasketX = basketXRef.current;
        const basketTop = WORLD_HEIGHT - BASKET_HEIGHT - 12;
        const basketLeft = currentBasketX;
        const basketRight = currentBasketX + BASKET_WIDTH;

        for (const gift of prev) {
          const updatedY = gift.y + gift.speed * delta;

          const giftLeft = gift.x;
          const giftRight = gift.x + gift.size;
          const giftBottom = updatedY + gift.size;

          const isInsideBasketY =
            giftBottom >= basketTop && updatedY <= WORLD_HEIGHT;
          const isInsideBasketX =
            giftRight >= basketLeft && giftLeft <= basketRight;

          if (isInsideBasketY && isInsideBasketX) {
            catchCount += 1;
            catchScore += gift.points;
            continue;
          }

          if (updatedY > WORLD_HEIGHT + 20) {
            missCount += 1;
            continue;
          }

          next.push({
            ...gift,
            y: updatedY,
          });
        }

        if (catchCount > 0) {
          setCaught((prevCaught) => prevCaught + catchCount);
          setScore((prevScore) => prevScore + catchScore);
          setFlash("catch");
          setTimeout(() => setFlash(null), 120);
        }

        if (missCount > 0) {
          setMissed((prevMissed) => prevMissed + missCount);
          setFlash("miss");
          setTimeout(() => setFlash(null), 120);
        }

        return next.slice(-24);
      });

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    startGame();
    return () => clearAll();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        moveLeftRef.current = true;
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        moveRightRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        moveLeftRef.current = false;
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        moveRightRef.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const moveBasketFromClientX = (clientX: number) => {
    if (!areaRef.current || isGameOver) return;

    const rect = areaRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;

    // แปลงจาก px จริงของ container -> world coordinate
    const scaledX = (relativeX / rect.width) * WORLD_WIDTH;
    const nextX = clamp(
      scaledX - BASKET_WIDTH / 2,
      0,
      WORLD_WIDTH - BASKET_WIDTH
    );

    basketXRef.current = nextX;
    setBasketX(nextX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    moveBasketFromClientX(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    moveBasketFromClientX(touch.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    moveBasketFromClientX(touch.clientX);
  };

  return (
    <section className="mx-auto w-full max-w-6xl rounded-[24px] border border-pink-100 bg-gradient-to-br from-white via-rose-50 to-pink-100 p-3 shadow-xl sm:rounded-[32px] sm:p-6">
      <div className="mb-4 flex flex-col gap-4 rounded-[20px] bg-white/85 p-4 shadow-sm sm:mb-5 sm:rounded-[24px] sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-500 sm:text-sm sm:tracking-[0.2em]">
            Birthday Mini Game
          </p>
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Catch the Gift 🎁
          </h2>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm">
            ขยับตะกร้าเพื่อรับของขวัญที่ตกลงมาให้ได้มากที่สุด
          </p>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
            มือถือ: ลากนิ้วในพื้นที่เกม / คอม: เมาส์ หรือปุ่ม ← → / A D
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <div className="rounded-2xl bg-rose-100 px-4 py-3 text-center">
            <p className="text-[11px] text-rose-700 sm:text-xs">Score</p>
            <p className="text-xl font-bold text-rose-600 sm:text-2xl">
              {score}
            </p>
          </div>

          <div className="rounded-2xl bg-pink-100 px-4 py-3 text-center">
            <p className="text-[11px] text-pink-700 sm:text-xs">Caught</p>
            <p className="text-xl font-bold text-pink-600 sm:text-2xl">
              {caught}
            </p>
          </div>

          <div className="rounded-2xl bg-sky-100 px-4 py-3 text-center">
            <p className="text-[11px] text-sky-700 sm:text-xs">Accuracy</p>
            <p className="text-xl font-bold text-sky-600 sm:text-2xl">
              {accuracy}%
            </p>
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

      <div>
        <div
          ref={areaRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          className={`relative w-full overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffe4ef_0%,#fff5fa_55%,#fffdfd_100%)] shadow-2xl touch-none ${
            flash === "catch"
              ? "ring-4 ring-emerald-200"
              : flash === "miss"
              ? "ring-4 ring-rose-200"
              : ""
          }`}
          style={{
            aspectRatio: `${WORLD_WIDTH} / ${WORLD_HEIGHT}`,
          }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-4 top-4 text-2xl opacity-70 sm:left-8 sm:top-8 sm:text-3xl">
              ☁️
            </div>
            <div className="absolute right-4 top-5 text-3xl opacity-70 sm:right-10 sm:top-10 sm:text-4xl">
              ☁️
            </div>
            <div className="absolute left-[16%] top-14 text-xl opacity-60 sm:left-[18%] sm:top-20 sm:text-2xl">
              ✨
            </div>
            <div className="absolute right-[20%] top-16 text-xl opacity-60 sm:right-[22%] sm:top-24 sm:text-2xl">
              ✨
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-rose-200/70 to-transparent sm:h-24" />
          </div>

          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="pointer-events-none absolute select-none drop-shadow-sm"
              style={{
                left: `${(gift.x / WORLD_WIDTH) * 100}%`,
                top: `${(gift.y / WORLD_HEIGHT) * 100}%`,
                transform: "translate(-50%, 0)",
                fontSize: `clamp(20px, ${gift.size / 9}px + 1.2vw, ${gift.size}px)`,
                lineHeight: 1,
              }}
            >
              {gift.emoji}
            </div>
          ))}

          <div
            className="absolute bottom-[2%] flex items-center justify-center"
            style={{
              left: `${(basketX / WORLD_WIDTH) * 100}%`,
              width: `${(BASKET_WIDTH / WORLD_WIDTH) * 100}%`,
              height: `${(BASKET_HEIGHT / WORLD_HEIGHT) * 100}%`,
              minWidth: "72px",
              minHeight: "34px",
            }}
          >
            <div className="relative flex h-full w-full items-end justify-center rounded-b-[24px] border-[3px] border-rose-300 bg-gradient-to-b from-amber-100 to-amber-300 shadow-lg sm:rounded-b-[28px] sm:border-4">
              <div className="absolute -top-2 h-3 w-[92%] rounded-full border-[3px] border-rose-300 bg-amber-50 sm:-top-3 sm:h-4 sm:border-4" />
              <span className="pb-0.5 text-lg sm:pb-1 sm:text-2xl">🧺</span>
            </div>
          </div>

          {!isGameOver && (
            <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium text-rose-500 shadow sm:top-4 sm:px-4 sm:py-1.5 sm:text-xs">
              ลากนิ้วเพื่อขยับตะกร้า
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/45 p-3 sm:p-4">
              <div className="w-full max-w-sm rounded-[24px] bg-white p-5 text-center shadow-2xl sm:max-w-md sm:rounded-[28px] sm:p-8">
                <div className="mb-3 text-5xl sm:text-6xl">🎉</div>
                <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  เกมจบแล้ว
                </h3>
                <p className="mt-3 text-sm text-slate-600 sm:text-base">
                  คุณรับของขวัญได้
                </p>
                <p className="mt-2 text-4xl font-extrabold text-rose-500 sm:text-5xl">
                  {caught}
                </p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">ชิ้น</p>

                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-2xl bg-rose-50 p-3">
                    <p className="text-[10px] text-rose-700 sm:text-xs">
                      Score
                    </p>
                    <p className="text-lg font-bold text-rose-600 sm:text-xl">
                      {score}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-sky-50 p-3">
                    <p className="text-[10px] text-sky-700 sm:text-xs">
                      Accuracy
                    </p>
                    <p className="text-lg font-bold text-sky-600 sm:text-xl">
                      {accuracy}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-pink-50 p-3">
                    <p className="text-[10px] text-pink-700 sm:text-xs">
                      Missed
                    </p>
                    <p className="text-lg font-bold text-pink-600 sm:text-xl">
                      {missed}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  เก่งมาก 🎂 พร้อมไปดูเซอร์ไพรส์วันเกิดต่อได้เลย
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
      </div>
    </section>
  );
}