"use client";

import { useEffect, useRef, useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function CinematicPanda({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { title = "", subtitle = "" } = content.cinematicPanda?.[sectionId] ?? {};
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.35 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-linear-to-br from-slate-50 via-(--theme-softer) to-white px-4 py-10 text-center sm:gap-6 sm:px-6 sm:py-16"
        >
            <style jsx>{`
                @keyframes roll-in {
                    0% {
                        transform: translateY(80px) scale(0.7) rotate(-8deg);
                        opacity: 0;
                    }
                    60% {
                        transform: translateY(-10px) scale(1.05) rotate(4deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(0) scale(1) rotate(0deg);
                    }
                }
                @keyframes sway {
                    0%,
                    100% {
                        transform: rotate(-3deg);
                    }
                    50% {
                        transform: rotate(3deg);
                    }
                }
            `}</style>

            <p
                className={`text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
                Birthday Cinematic Surprise
            </p>
            <h2
                className={`max-w-xl text-2xl font-black text-slate-900 transition-opacity duration-700 sm:text-3xl md:text-4xl ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
                {title}
            </h2>
            <p
                className={`max-w-lg text-sm text-slate-600 transition-opacity delay-150 duration-700 sm:text-base ${isVisible ? "opacity-100" : "opacity-0"}`}
            >
                {subtitle}
            </p>

            <div
                className="mt-3 text-6xl sm:mt-4 sm:text-8xl md:text-9xl"
                style={
                    isVisible
                        ? { animation: "roll-in 1400ms cubic-bezier(.2,.8,.2,1) forwards" }
                        : { opacity: 0 }
                }
            >
                <span
                    className="inline-block"
                    style={
                        isVisible
                            ? { animation: "sway 2400ms ease-in-out 1400ms infinite" }
                            : undefined
                    }
                >
                    🐼
                </span>
            </div>

            {isVisible && (
                <button
                    type="button"
                    onClick={nextStep}
                    className="mt-4 rounded-full bg-linear-to-r from-slate-700 to-(--theme-primary) px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition active:scale-95"
                >
                    Next ▶
                </button>
            )}
        </section>
    );
}
