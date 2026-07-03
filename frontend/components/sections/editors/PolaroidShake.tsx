"use client";

import { useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

const SHAKES_NEEDED = 12;

export default function PolaroidShake({
    nextStep,
    content,
}: {
    nextStep: () => void;
    content: HbdContent;
}) {
    const { imgPath, caption } = content.polaroidShake;
    const [shakes, setShakes] = useState(0);
    const [jiggle, setJiggle] = useState(false);

    const progress = Math.min(1, shakes / SHAKES_NEEDED);
    const developed = progress >= 1;

    const handleShake = () => {
        if (developed) return;
        setShakes((s) => s + 1);
        setJiggle(true);
        window.setTimeout(() => setJiggle(false), 150);
    };

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-slate-100 via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Develop the Memory
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">Shake the Polaroid 📸</h2>
            </div>

            <button
                type="button"
                onClick={handleShake}
                disabled={developed}
                className={`rounded-lg bg-white p-3 pb-12 shadow-2xl transition-transform sm:p-4 sm:pb-14 ${
                    jiggle ? "rotate-2 scale-[1.02]" : "rotate-0"
                }`}
                aria-label="Shake the photo"
            >
                <div className="relative h-44 w-44 overflow-hidden rounded-sm bg-slate-200 sm:h-56 sm:w-56 md:h-64 md:w-64">
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
                <p className="mt-3 text-center text-sm text-slate-500">
                    {developed ? caption : "Keep shaking..."}
                </p>
            </button>

            {developed && (
                <button
                    type="button"
                    onClick={nextStep}
                    className="rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2.5 font-semibold text-white shadow-lg transition active:scale-95"
                >
                    Next ▶
                </button>
            )}
        </section>
    );
}
