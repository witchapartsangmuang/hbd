"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { confettiState, birthGiftState } from "../utils/hooks";
import { launchConfetti } from "../utils/functions";
export default function BirthGift({ isOpenGift, setisOpenGift, setisOpenDisplayImgArea }: {
    isOpenGift: boolean, setisOpenGift: Dispatch<SetStateAction<boolean>>, setisOpenDisplayImgArea: Dispatch<SetStateAction<boolean>>
}) {
    const { isPressing, setisPressing, isShaking, setisShaking } = birthGiftState()
    const [showSurpriseText, setShowSurpriseText] = useState(false);
    const { confetti, setConfetti } = confettiState()
    const confettiIdRef = useRef(1);

    useEffect(() => {
        if (!isOpenGift) return;
        const timer = setTimeout(() => setShowSurpriseText(true), 500);
        return () => clearTimeout(timer);
    }, [isOpenGift]);

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
            launchConfetti(confettiIdRef, setConfetti);
        }, 420);
    };

    const handleMouseLeave = () => {
        if (isOpenGift) return;
        setisPressing(false);
    };

    return (
        <>
            <div className="relative">
                {confetti.map((piece) => (
                    <span
                        key={piece.id}
                        className="confetti-piece pointer-events-none absolute z-9999 block rounded-sm"
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
            </div>
            <section className="relative flex flex-col items-center justify-center">
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
                    className="group relative mt-8 h-55 w-55 cursor-pointer transition hover:scale-105"
                    aria-label="Open gift box"
                >
                    <div
                        className={`relative h-55 w-55 origin-center ${isPressing ? "scale-95" : "scale-100"
                            } ${isShaking ? "box-shake" : ""} transition-transform duration-200`}
                    >
                        <div className="absolute left-1/2 top-17 z-55 h-2 w-2 -translate-x-1/2 rounded-full" />

                        <span
                            className={`absolute -left-2 top-7.5 z-20 h-11.5 w-59 rounded-xl bg-linear-to-br from-pink-200 to-pink-400 shadow-xl ${isOpenGift ? "lid-open" : ""
                                }`}
                            style={{ transformOrigin: "50% 80%" }}
                        />
                        <span className="absolute bottom-0 left-0 h-37.5 w-55 rounded-xl bg-linear-to-br from-pink-300 to-pink-500 shadow-xl" />
                        <span className="absolute left-24 top-0 z-30 h-55 w-7 rounded-lg bg-amber-300" />
                        <span className="absolute left-0 top-11.5 z-30 h-6 w-55 rounded-lg bg-amber-300" />

                        <span className="absolute left-17 top-0 z-40 h-13 w-21">
                            <span className="absolute left-0 top-1 h-10 w-10 rotate-45 rounded-[50%_50%_50%_0] border-10 border-amber-300" />
                            <span className="absolute right-0 top-1 h-10 w-10 scale-x-[-1] rotate-45 rounded-[50%_50%_50%_0] border-10 border-amber-300" />
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