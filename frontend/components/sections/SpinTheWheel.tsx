"use client";

import { useMemo, useRef, useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

const SLICE_COLORS = [
    "#fb7185",
    "#f472b6",
    "#fbbf24",
    "#34d399",
    "#60a5fa",
    "#a78bfa",
    "#fb923c",
    "#f87171",
];

export default function SpinTheWheel({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { prizes = [] } = content.spinTheWheel?.[sectionId] ?? {};
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const spinCountRef = useRef(0);

    const sliceAngle = 360 / prizes.length;
    const gradient = useMemo(() => {
        const stops = prizes.map((_, i) => {
            const from = i * sliceAngle;
            const to = from + sliceAngle;
            const color = SLICE_COLORS[i % SLICE_COLORS.length];
            return `${color} ${from}deg ${to}deg`;
        });
        return `conic-gradient(${stops.join(", ")})`;
    }, [prizes, sliceAngle]);

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setResult(null);
        spinCountRef.current += 1;

        const winningIndex = Math.floor(Math.random() * prizes.length);
        const targetSliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
        const extraSpins = 5 + spinCountRef.current;
        const finalRotation = extraSpins * 360 + (360 - targetSliceCenter);

        setRotation(finalRotation);

        window.setTimeout(() => {
            setSpinning(false);
            setResult(prizes[winningIndex]);
        }, 4200);
    };

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-amber-50 via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Birthday Mini Game
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Spin the Wheel 🎡
                </h2>
            </div>

            <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72 md:h-80 md:w-80">
                <div className="absolute -top-2 left-1/2 z-20 h-5 w-5 -translate-x-1/2 rotate-45 bg-slate-800 shadow-lg sm:h-6 sm:w-6" />
                <div
                    className="relative h-full w-full rounded-full border-8 border-white shadow-2xl transition-transform"
                    style={{
                        background: gradient,
                        transform: `rotate(${rotation}deg)`,
                        transitionDuration: "4200ms",
                        transitionTimingFunction: "cubic-bezier(.17,.67,.16,1)",
                    }}
                >
                    {prizes.map((prize, i) => {
                        const angle = i * sliceAngle + sliceAngle / 2;
                        return (
                            <span
                                key={i}
                                className="absolute left-1/2 top-1/2 w-24 origin-left text-center text-[11px] font-semibold text-white drop-shadow sm:text-xs"
                                style={{
                                    transform: `rotate(${angle}deg) translateX(18px)`,
                                }}
                            >
                                {prize}
                            </span>
                        );
                    })}
                </div>
                <div className="absolute z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-lg">
                    🎯
                </div>
            </div>

            <button
                type="button"
                onClick={spin}
                disabled={spinning}
                className="rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2.5 font-semibold text-white shadow-lg transition active:scale-95 disabled:opacity-60 sm:px-8 sm:py-3"
            >
                {spinning ? "Spinning..." : "Spin the Wheel"}
            </button>

            {result && (
                <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl sm:p-6">
                    <p className="text-sm text-(--theme-primary)">You landed on</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">{result}</p>
                    <button
                        type="button"
                        onClick={nextStep}
                        className="mt-5 rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition active:scale-95"
                    >
                        Next ▶
                    </button>
                </div>
            )}
        </section>
    );
}
