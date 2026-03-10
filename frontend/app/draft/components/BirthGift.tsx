"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { giftState } from "../utils/hooks";

export type ConfettiPiece = {
    id: number;
    left: number;
    top: number;
    x: number;
    y: number;
    rotate: number;
    color: string;
    width: number;
    height: number;
    duration: number;
};

type BirthGiftProps = {
    isOpenGift: boolean;
    setisOpenGift: Dispatch<SetStateAction<boolean>>;
    // isPressing: boolean;
    // setisPressing: Dispatch<SetStateAction<boolean>>;
    setisOpenDisplayImgArea: Dispatch<SetStateAction<boolean>>;
};

const confettiColors = [
    "#f472b6",
    "#fb7185",
    "#fbbf24",
    "#34d399",
    "#60a5fa",
    "#a78bfa",
    "#f9a8d4",
];

export default function BirthGift({
    isOpenGift,
    setisOpenGift,
    // isPressing,
    // setisPressing,
    setisOpenDisplayImgArea
}: BirthGiftProps) {
    const { isPressing, setisPressing } = giftState()
    const [showSurpriseText, setShowSurpriseText] = useState(false);
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [isShaking, setisShaking] = useState(false);

    const confettiIdRef = useRef(1);
    const confettiOriginRef = useRef<HTMLDivElement | null>(null);

    const sparkles = useMemo(
        () => [
            { emoji: "✨", className: "top-[8%] left-[10%] animate-float" },
            { emoji: "🎈", className: "top-[18%] right-[12%] animate-float-delayed" },
            { emoji: "🎉", className: "top-[52%] left-[6%] animate-float-slow" },
            { emoji: "🎂", className: "bottom-[18%] right-[7%] animate-float" },
        ],
        []
    );

    useEffect(() => {
        if (!isOpenGift) return;
        const timer = setTimeout(() => setShowSurpriseText(true), 500);
        return () => clearTimeout(timer);
    }, [isOpenGift]);

    const launchConfetti = () => {
        if (!confettiOriginRef.current) return;

        const rect = confettiOriginRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const pieces: ConfettiPiece[] = Array.from({ length: 120 }).map(() => {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
            const distance = 120 + Math.random() * 260;

            return {
                id: confettiIdRef.current++,
                left: centerX,
                top: centerY,
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance + (120 + Math.random() * 180),
                rotate: Math.random() * 720 - 360,
                color:
                    confettiColors[Math.floor(Math.random() * confettiColors.length)],
                width: 6 + Math.random() * 8,
                height: 8 + Math.random() * 12,
                duration: 900 + Math.random() * 900,
            };
        });

        setConfetti((prev) => [...prev, ...pieces]);

        const maxDuration = Math.max(...pieces.map((p) => p.duration));
        window.setTimeout(() => {
            setConfetti((prev) =>
                prev.filter((item) => !pieces.some((piece) => piece.id === item.id))
            );
        }, maxDuration + 120);
    };

    const handleMouseDown = () => {
        if (isOpenGift) return;
        setisOpenDisplayImgArea(true)
        setisPressing(true);
    };

    const handleMouseUp = () => {
        if (isOpenGift || !isPressing) return;

        setisPressing(false);
        setisShaking(true);

        window.setTimeout(() => {
            setisShaking(false);
            setisOpenGift(true);
            launchConfetti();
        }, 420);
    };

    const handleMouseLeave = () => {
        if (isOpenGift) return;
        setisPressing(false);
    };

    return (
        <>
            {sparkles.map((item, index) => (
                <div
                    key={index}
                    className={`pointer-events-none absolute z-10 text-xl opacity-70 ${item.className}`}
                >
                    {item.emoji}
                </div>
            ))}

            {confetti.map((piece) => (
                <span
                    key={piece.id}
                    className="confetti-piece pointer-events-none fixed z-[9999] block rounded-sm"
                    style={
                        {
                            left: `${piece.left}px`,
                            top: `${piece.top}px`,
                            width: `${piece.width}px`,
                            height: `${piece.height}px`,
                            backgroundColor: piece.color,
                            animationDuration: `${piece.duration}ms`,
                            ["--tx" as string]: `${piece.x}px`,
                            ["--ty" as string]: `${piece.y}px`,
                            ["--rot" as string]: `${piece.rotate}deg`,
                        } as React.CSSProperties
                    }
                />
            ))}

            <section className="relative flex flex-col items-center justify-center px-5 py-10 text-center">
                <h1 className="text-4xl font-bold text-pink-600 sm:text-6xl">
                    Happy Birthday 🎂
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-rose-900/80 sm:text-lg">
                    เว็บอวยพรเล็ก ๆ ที่ตั้งใจทำมาเพื่อวันพิเศษของคุณ
                </p>

                <button
                    type="button"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    className="group relative mt-8 h-[220px] w-[220px] cursor-pointer transition hover:scale-105"
                    aria-label="Open gift box"
                >
                    <div
                        className={`relative h-[220px] w-[220px] origin-center ${isPressing ? "scale-95" : "scale-100"
                            } ${isShaking ? "box-shake" : ""} transition-transform duration-200`}
                    >
                        <div
                            ref={confettiOriginRef}
                            className="absolute left-1/2 top-[68px] z-[55] h-2 w-2 -translate-x-1/2 rounded-full"
                        />

                        <span
                            className={`absolute left-[-8px] top-[30px] z-20 h-[46px] w-[236px] rounded-xl bg-gradient-to-br from-pink-200 to-pink-400 shadow-xl ${isOpenGift ? "lid-open" : ""
                                }`}
                            style={{ transformOrigin: "50% 80%" }}
                        />
                        <span className="absolute bottom-0 left-0 h-[150px] w-[220px] rounded-xl bg-gradient-to-br from-pink-300 to-pink-500 shadow-xl" />
                        <span className="absolute left-[96px] top-0 z-30 h-[220px] w-7 rounded-lg bg-amber-300" />
                        <span className="absolute left-0 top-[46px] z-30 h-6 w-[220px] rounded-lg bg-amber-300" />

                        <span className="absolute left-[68px] top-0 z-40 h-[52px] w-[84px]">
                            <span className="absolute left-0 top-1 h-10 w-10 rotate-45 rounded-[50%_50%_50%_0] border-[10px] border-amber-300" />
                            <span className="absolute right-0 top-1 h-10 w-10 scale-x-[-1] rotate-45 rounded-[50%_50%_50%_0] border-[10px] border-amber-300" />
                        </span>
                    </div>
                </button>

                <div
                    className={`mt-6 text-lg font-medium text-rose-500 transition-all duration-700 ${showSurpriseText
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-0"
                        }`}
                >
                    สุขสันต์วันเกิด ขอให้วันนี้เต็มไปด้วยความสุข 🎉
                </div>
            </section>
        </>
    );
}