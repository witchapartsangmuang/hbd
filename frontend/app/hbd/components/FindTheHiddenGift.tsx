"use client";

import { useEffect, useMemo, useState } from "react";

type SceneItem = {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  isTarget: boolean;
  rotate: number;
};

const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 560;
const ROUND_TIME = 12;
const TOTAL_ROUNDS = 3;

const DECO_EMOJIS = ["🎈", "🎂", "✨", "🧸", "💖", "🌟", "🍬", "🎀", "☁️"];
const TARGET_EMOJI = "🎁";

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function shuffleArray<T>(array: T[]) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function createScene(round: number) {
  const itemCount = 18 + round * 4;
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;

  const items: SceneItem[] = [];

  for (let i = 0; i < itemCount; i++) {
    const emoji =
      DECO_EMOJIS[Math.floor(Math.random() * DECO_EMOJIS.length)];

    items.push({
      id: i + 1,
      x: randomBetween(24, WORLD_WIDTH - 80),
      y: randomBetween(24, WORLD_HEIGHT - 90),
      size: isMobile ? randomBetween(24, 42) : randomBetween(28, 54),
      emoji,
      isTarget: false,
      rotate: randomBetween(-18, 18),
    });
  }

  items.push({
    id: itemCount + 1,
    x: randomBetween(24, WORLD_WIDTH - 80),
    y: randomBetween(24, WORLD_HEIGHT - 90),
    size: isMobile ? randomBetween(30, 42) : randomBetween(34, 50),
    emoji: TARGET_EMOJI,
    isTarget: true,
    rotate: randomBetween(-12, 12),
  });

  return shuffleArray(items);
}

export default function FindTheHiddenGift() {
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [sceneItems, setSceneItems] = useState<SceneItem[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [status, setStatus] = useState<
    "playing" | "round-clear" | "finished" | "failed"
  >("playing");
  const [message, setMessage] = useState("มองหาของขวัญที่ซ่อนอยู่ให้เจอนะ 🎁");
  const [highlightTarget, setHighlightTarget] = useState(false);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus("failed");
          setHighlightTarget(true);
          setMessage("หมดเวลาแล้ว ของขวัญอยู่ตรงนี้เอง 🎁");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, round]);

  useEffect(() => {
    if (status === "playing") {
      setSceneItems(createScene(round));
      setTimeLeft(ROUND_TIME);
      setHighlightTarget(false);
      setMessage(`รอบที่ ${round}: หาของขวัญที่ซ่อนอยู่ให้เจอ 🎁`);
    }
  }, [round, status]);

  useEffect(() => {
    setSceneItems(createScene(1));
  }, []);

  const accuracy = useMemo(() => {
    const totalClicks = foundCount + mistakeCount;
    if (totalClicks === 0) return 100;
    return Math.round((foundCount / totalClicks) * 100);
  }, [foundCount, mistakeCount]);

  const handleClickItem = (item: SceneItem) => {
    if (status !== "playing") return;

    if (item.isTarget) {
      setFoundCount((prev) => prev + 1);
      setMessage("เจอแล้ว! 🎉");
      setHighlightTarget(true);

      if (round >= TOTAL_ROUNDS) {
        setStatus("finished");
      } else {
        setStatus("round-clear");
      }
    } else {
      setMistakeCount((prev) => prev + 1);
      setMessage("อันนี้ยังไม่ใช่นะ ลองหาอีกครั้ง 💗");
    }
  };

  const handleNextRound = () => {
    if (round < TOTAL_ROUNDS) {
      setRound((prev) => prev + 1);
      setStatus("playing");
    }
  };

  const handleRestart = () => {
    setRound(1);
    setTimeLeft(ROUND_TIME);
    setFoundCount(0);
    setMistakeCount(0);
    setStatus("playing");
    setHighlightTarget(false);
    setMessage("มองหาของขวัญที่ซ่อนอยู่ให้เจอนะ 🎁");
    setSceneItems(createScene(1));
  };

  return (
    <section className="mx-auto w-full max-w-6xl rounded-[24px] border border-pink-100 bg-gradient-to-br from-white via-rose-50 to-pink-100 p-3 shadow-xl sm:rounded-[32px] sm:p-6">
      <div className="mb-4 flex flex-col gap-4 rounded-[20px] bg-white/85 p-4 shadow-sm sm:mb-5 sm:rounded-[24px] sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-500 sm:text-sm sm:tracking-[0.2em]">
            Birthday Mini Game
          </p>
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Find the Hidden Gift 🎁
          </h2>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm">
            คลิกหาของขวัญที่ซ่อนอยู่ท่ามกลางของตกแต่งในฉาก
          </p>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
            มีทั้งหมด {TOTAL_ROUNDS} รอบ รอบละ {ROUND_TIME} วินาที
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <div className="rounded-2xl bg-rose-100 px-4 py-3 text-center">
            <p className="text-[11px] text-rose-700 sm:text-xs">Round</p>
            <p className="text-xl font-bold text-rose-600 sm:text-2xl">
              {Math.min(round, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
            </p>
          </div>

          <div className="rounded-2xl bg-pink-100 px-4 py-3 text-center">
            <p className="text-[11px] text-pink-700 sm:text-xs">Found</p>
            <p className="text-xl font-bold text-pink-600 sm:text-2xl">
              {foundCount}
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
            onClick={handleRestart}
            className="col-span-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition active:scale-95 sm:col-span-1 hover:sm:scale-[1.02]"
          >
            เล่นใหม่
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-[18px] bg-white/80 p-4 shadow-sm sm:rounded-[20px]">
        <p className="text-sm font-medium text-rose-600">{message}</p>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffe4ef_0%,#fff3f8_45%,#fffdfd_100%)] shadow-2xl"
        style={{ aspectRatio: `${WORLD_WIDTH} / ${WORLD_HEIGHT}` }}
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

        {sceneItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClickItem(item)}
            disabled={status !== "playing"}
            className={`absolute flex items-center justify-center select-none touch-manipulation transition duration-200 active:scale-90 ${
              item.isTarget && highlightTarget
                ? "animate-bounce drop-shadow-[0_0_18px_rgba(244,63,94,0.45)]"
                : "hover:scale-110"
            }`}
            style={{
              left: `${(item.x / WORLD_WIDTH) * 100}%`,
              top: `${(item.y / WORLD_HEIGHT) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
              fontSize: `clamp(18px, ${item.size / 10}px + 1vw, ${item.size}px)`,
              lineHeight: 1,
              minWidth: item.isTarget ? "40px" : "34px",
              minHeight: item.isTarget ? "40px" : "34px",
            }}
            aria-label={item.isTarget ? "hidden gift" : "scene item"}
          >
            {item.emoji}
          </button>
        ))}

        {(status === "round-clear" ||
          status === "finished" ||
          status === "failed") && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/45 p-3 sm:p-4">
            <div className="w-full max-w-sm rounded-[24px] bg-white p-5 text-center shadow-2xl sm:max-w-md sm:rounded-[28px] sm:p-8">
              <div className="mb-3 text-5xl sm:text-6xl">
                {status === "failed" ? "⏰" : "🎉"}
              </div>

              {status === "round-clear" && (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    เจอของขวัญแล้ว
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 sm:text-base">
                    เก่งมาก ไปต่อรอบถัดไปกันเลย
                  </p>

                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="mt-6 rounded-2xl bg-rose-500 px-6 py-3 font-semibold text-white transition active:scale-95 hover:sm:scale-[1.02]"
                  >
                    ไปต่อรอบ {round + 1}
                  </button>
                </>
              )}

              {status === "finished" && (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    ผ่านครบทุกด่านแล้ว
                  </h3>

                  <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="rounded-2xl bg-rose-50 p-3">
                      <p className="text-[10px] text-rose-700 sm:text-xs">
                        Found
                      </p>
                      <p className="text-lg font-bold text-rose-600 sm:text-xl">
                        {foundCount}
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
                        Mistakes
                      </p>
                      <p className="text-lg font-bold text-pink-600 sm:text-xl">
                        {mistakeCount}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    สุดยอด 🎁 พร้อมไปดูเซอร์ไพรส์วันเกิดต่อได้เลย
                  </div>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition active:scale-95 hover:sm:scale-[1.02]"
                  >
                    เล่นอีกครั้ง
                  </button>
                </>
              )}

              {status === "failed" && (
                <>
                  <h3 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                    หมดเวลาแล้ว
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 sm:text-base">
                    ไม่เป็นไร ลองใหม่อีกรอบนะ
                  </p>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition active:scale-95 hover:sm:scale-[1.02]"
                  >
                    เริ่มใหม่
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}