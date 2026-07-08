"use client";

import { useEffect, useRef, useState } from "react";
import ScrollDownButton from "@/components/ScrollDownButton";
import { HbdContent } from "@/components/sections/utils/content-types";
import { launchConfetti } from "@/components/sections/utils/functions";
import { ConfettiPiece } from "@/components/sections/utils/type";

const SHAKES_NEEDED = 12;
const NEXT_STEP_DELAY_MS = 1200;

export default function PolaroidShake({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const {
        imgPath = "",
        caption = "",
        aspectRatio = "1:1",
        eyebrow = "Develop the Memory",
        heading = "Shake the Polaroid 📸",
    } = content.polaroidShake?.[sectionId] ?? {};
    const [aw, ah] = aspectRatio.split(":").map(Number);
    const [shakes, setShakes] = useState(0);
    const [jiggle, setJiggle] = useState(false);
    const confettiIdRef = useRef(1);
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

    const progress = Math.min(1, shakes / SHAKES_NEEDED);
    const developed = progress >= 1;
    const nextStepRef = useRef(nextStep);
    nextStepRef.current = nextStep;

    const handleShake = () => {
        if (developed) return;
        setShakes((s) => s + 1);
        setJiggle(true);
        window.setTimeout(() => setJiggle(false), 150);
    };

    useEffect(() => {
        if (!developed) return;
        launchConfetti(confettiIdRef, setConfetti, content.confettiColors);
        const timer = window.setTimeout(() => nextStepRef.current(), NEXT_STEP_DELAY_MS);
        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [developed]);

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="pointer-events-none w-full overflow-hidden h-1">
                {confetti.map((piece) => (
                    <span
                        key={piece.id}
                        className="confetti-piece pointer-events-none absolute z-9999 block rounded-sm"
                        style={
                            {
                                left: `${piece.left}px`,
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
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    {eyebrow}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">{heading}</h2>
            </div>

            <button
                type="button"
                onClick={handleShake}
                disabled={developed}
                className={`rounded-lg bg-white p-4 shadow-2xl transition-transform ${
                    jiggle ? "rotate-2 scale-[1.02]" : "rotate-0"
                }`}
                style={{ width: "min(100%, 320px)" }}
                aria-label="Shake the photo"
            >
                <div
                    className="relative w-full overflow-hidden rounded-sm bg-slate-200"
                    style={{ aspectRatio: `${aw}/${ah}` }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imgPath}
                        alt="Polaroid memory"
                        className="h-full w-full object-cover transition-all duration-300"
                        style={{
                            filter: `blur(${(1 - progress) * 10}px) brightness(${0.6 + progress * 0.4})`,
                        }}
                    />
                    {!developed && (
                        <div
                            className="pointer-events-none absolute inset-0 bg-white transition-opacity"
                            style={{ opacity: 1 - progress }}
                        />
                    )}
                </div>
                <p className="mt-5 text-center text-sm text-slate-500">
                    {developed ? caption : "Click for shaking..."}
                </p>
            </button>
            {developed && <ScrollDownButton />}
        </section>
    );
}
