"use client";

import { useRef, useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function CandleBlow({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { candleCount = 3, message = "" } = content.candleBlow?.[sectionId] ?? {};
    const [progress, setProgress] = useState(0);
    const [blownOut, setBlownOut] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startBlowing = () => {
        if (blownOut) return;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setProgress((p) => {
                const next = Math.min(100, p + 6);
                if (next >= 100) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setBlownOut(true);
                }
                return next;
            });
        }, 60);
    };

    const stopBlowing = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const litCandles = Math.max(0, candleCount - Math.floor((progress / 100) * candleCount));

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-amber-50 via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Birthday Moment
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Blow Out the Candles 🕯️
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-600">{message}</p>
            </div>

            <div className="max-w-full overflow-x-auto px-2">
                <div className="relative flex h-32 items-end gap-2 rounded-t-[50%] rounded-b-2xl bg-amber-200/70 px-4 pb-4 pt-8 shadow-inner sm:h-48 sm:gap-4 sm:px-8 sm:pt-10">
                    {Array.from({ length: candleCount }, (_, i) => {
                        const isLit = i < litCandles;
                        return (
                            <div key={i} className="flex flex-col items-center">
                                <span
                                    className={`mb-0.5 h-3 w-2 rounded-full bg-orange-400 transition-opacity ${
                                        isLit ? "animate-pulse opacity-100" : "opacity-0"
                                    }`}
                                    style={{
                                        boxShadow: isLit
                                            ? "0 0 12px 4px rgba(251,146,60,.7)"
                                            : "none",
                                    }}
                                />
                                <div className="h-11 w-2.5 rounded-sm bg-linear-to-b from-(--theme-primary-light) to-(--theme-primary) sm:h-20 sm:w-4" />
                            </div>
                        );
                    })}
                </div>
            </div>

            {!blownOut ? (
                <button
                    type="button"
                    onMouseDown={startBlowing}
                    onMouseUp={stopBlowing}
                    onMouseLeave={stopBlowing}
                    onTouchStart={startBlowing}
                    onTouchEnd={stopBlowing}
                    className="select-none rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-8 py-3 font-semibold text-white shadow-lg transition active:scale-95"
                >
                    Press &amp; hold to blow 💨
                </button>
            ) : (
                <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl sm:p-6">
                    <div className="mb-2 text-4xl">✨</div>
                    <p className="text-lg font-bold text-slate-800">Wish made!</p>
                    <button
                        type="button"
                        onClick={nextStep}
                        className="mt-4 rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition active:scale-95"
                    >
                        Next ▶
                    </button>
                </div>
            )}
        </section>
    );
}
