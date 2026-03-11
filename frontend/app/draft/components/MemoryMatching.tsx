"use client";

import { useEffect, useMemo, useState } from "react";

type CardItem = {
  id: number;
  pairId: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const EMOJIS = ["🎂", "🎈", "🎁", "💖", "✨", "🧸"];

function shuffleArray<T>(array: T[]): T[] {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function createCards(): CardItem[] {
  const duplicated = [...EMOJIS, ...EMOJIS];

  return shuffleArray(
    duplicated.map((emoji, index) => ({
      id: index + 1,
      pairId: EMOJIS.indexOf(emoji),
      emoji,
      isFlipped: false,
      isMatched: false,
    }))
  );
}

export default function MemoryMatching() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const matchedCount = useMemo(
    () => cards.filter((card) => card.isMatched).length,
    [cards]
  );

  const allMatched = cards.length > 0 && matchedCount === cards.length;

  const startNewGame = () => {
    setCards(createCards());
    setSelectedIds([]);
    setMoves(0);
    setSeconds(0);
    setIsChecking(false);
    setIsFinished(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (cards.length === 0 || isFinished) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cards.length, isFinished]);

  useEffect(() => {
    if (allMatched && cards.length > 0) {
      setIsFinished(true);
    }
  }, [allMatched, cards]);

  const handleCardClick = (id: number) => {
    if (isChecking || isFinished) return;

    const clickedCard = cards.find((card) => card.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;
    if (selectedIds.length >= 2) return;

    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    const nextSelectedIds = [...selectedIds, id];

    setCards(updatedCards);
    setSelectedIds(nextSelectedIds);

    if (nextSelectedIds.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = nextSelectedIds;
      const firstCard = updatedCards.find((card) => card.id === firstId);
      const secondCard = updatedCards.find((card) => card.id === secondId);

      if (!firstCard || !secondCard) {
        setSelectedIds([]);
        setIsChecking(false);
        return;
      }

      if (firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setSelectedIds([]);
          setIsChecking(false);
        }, 450);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setSelectedIds([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  return (
    <section className="mx-auto w-full max-w-5xl rounded-[32px] border border-pink-100 bg-gradient-to-br from-white via-rose-50 to-pink-100 p-6 shadow-xl">
      <div className="mb-6 flex flex-col gap-4 rounded-[24px] bg-white/80 p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
            Birthday Mini Game
          </p>
          <h2 className="text-3xl font-bold text-slate-800">
            Memory Matching 💌
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            เปิดการ์ด 2 ใบและจับคู่สัญลักษณ์วันเกิดให้ครบทั้งหมด
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl bg-rose-100 px-4 py-3 text-center">
            <p className="text-xs text-rose-700">Moves</p>
            <p className="text-2xl font-bold text-rose-600">{moves}</p>
          </div>

          <div className="rounded-2xl bg-pink-100 px-4 py-3 text-center">
            <p className="text-xs text-pink-700">Matched</p>
            <p className="text-2xl font-bold text-pink-600">
              {matchedCount / 2}/{cards.length / 2 || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-sky-100 px-4 py-3 text-center">
            <p className="text-xs text-sky-700">Time</p>
            <p className="text-2xl font-bold text-sky-600">
              {formatTime(seconds)}
            </p>
          </div>

          <button
            type="button"
            onClick={startNewGame}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-95"
          >
            เล่นใหม่
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6">
        {cards.map((card) => {
          const showFront = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id)}
              disabled={isChecking || card.isMatched}
              className="group perspective h-28 w-full sm:h-32"
            >
              <div
                className={`relative h-full w-full rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] ${
                  showFront ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-400 to-pink-500 text-3xl text-white shadow-lg [backface-visibility:hidden]">
                  🎀
                </div>

                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-3xl border text-4xl shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    card.isMatched
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-white/80 bg-white"
                  }`}
                >
                  {card.emoji}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isFinished && (
        <div className="mt-6 rounded-[24px] bg-white/85 p-6 text-center shadow-lg">
          <div className="mb-3 text-6xl">🎉</div>
          <h3 className="text-3xl font-bold text-rose-600">จับคู่ครบแล้ว</h3>
          <p className="mt-2 text-slate-600">
            คุณใช้ไป <span className="font-semibold">{moves}</span> moves ในเวลา{" "}
            <span className="font-semibold">{formatTime(seconds)}</span>
          </p>

          <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-rose-700">
            เก่งมาก 💖 พร้อมไปดูเซอร์ไพรส์วันเกิดต่อได้เลย
          </div>

          <button
            type="button"
            onClick={startNewGame}
            className="mt-5 rounded-2xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:scale-[1.02] active:scale-95"
          >
            เล่นอีกครั้ง
          </button>
        </div>
      )}
    </section>
  );
}