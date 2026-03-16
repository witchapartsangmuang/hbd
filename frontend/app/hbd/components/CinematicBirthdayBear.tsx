"use client";

import { useEffect, useRef, useState } from "react";

type CinematicBirthdayBearProps = {
    title?: string;
    subtitle?: string;
};

export default function CinematicBirthdayBear({
    title = "มีเซอร์ไพรส์พิเศษกำลังมาหาเธอ 🧸",
    subtitle = "พอ section นี้เข้าจอ หมีน้อยจะเลื่อนเข้ามาพร้อมป้าย HBD และเอฟเฟกต์น่ารัก ๆ",
}: CinematicBirthdayBearProps) {
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

    const confettiPieces = Array.from({ length: 24 }, (_, i) => i);
    const sparkles = Array.from({ length: 10 }, (_, i) => i);
    const balloons = Array.from({ length: 3 }, (_, i) => i);

    return (
        <section
            ref={containerRef}
            className="relative mx-auto my-24 flex min-h-[420px] max-w-6xl items-center overflow-hidden rounded-[32px] border border-pink-100 bg-gradient-to-br from-rose-50 via-pink-50 to-white px-6 py-12 shadow-[0_20px_80px_rgba(244,114,182,0.18)] sm:px-10"
        >
            <style jsx>{`
        @keyframes cinematic-enter {
          0% {
            transform: translateX(180px) scale(0.82);
            opacity: 0;
          }
          55% {
            transform: translateX(-10px) scale(1.03);
            opacity: 1;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes float-soft {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow-pulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.08);
          }
        }

        @keyframes sign-pop {
          0% {
            transform: translateY(20px) scale(0.6) rotate(-10deg);
            opacity: 0;
          }
          60% {
            transform: translateY(-6px) scale(1.08) rotate(3deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translate3d(0, -80px, 0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--rot));
            opacity: 0;
          }
        }

        @keyframes sparkle-burst {
          0% {
            transform: scale(0.2);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes balloon-rise {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-16px);
          }
        }

        @keyframes wave-hand {
          0%,
          100% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(28deg);
          }
        }

        @keyframes blink {
          0%,
          45%,
          100% {
            transform: scaleY(1);
          }
          48%,
          52% {
            transform: scaleY(0.15);
          }
        }

        @keyframes text-rise {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={`absolute -left-20 -top-20 h-56 w-56 rounded-full bg-pink-200/45 blur-3xl transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                />
                <div
                    className={`absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl transition-all duration-1000 delay-200 ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                />
            </div>

            {isVisible && (
                <>
                    {confettiPieces.map((i) => {
                        const left = 4 + (i % 12) * 7.8;
                        const tx = `${(i % 2 === 0 ? -1 : 1) * (20 + (i % 5) * 12)}px`;
                        const ty = `${180 + (i % 6) * 28}px`;
                        const rot = `${(i % 2 === 0 ? 1 : -1) * (120 + i * 11)}deg`;
                        const delay = `${i * 60}ms`;
                        const duration = `${1600 + (i % 5) * 220}ms`;
                        const colors = [
                            "bg-pink-400",
                            "bg-rose-400",
                            "bg-yellow-300",
                            "bg-fuchsia-400",
                            "bg-orange-300",
                        ];

                        return (
                            <span
                                key={`confetti-${i}`}
                                className={`pointer-events-none absolute top-0 z-30 block h-3 w-2 rounded-sm ${colors[i % colors.length]}`}
                                style={
                                    {
                                        left: `${left}%`,
                                        animation: `confetti-fall ${duration} ease-out ${delay} forwards`,
                                        ["--tx" as string]: tx,
                                        ["--ty" as string]: ty,
                                        ["--rot" as string]: rot,
                                    } as React.CSSProperties
                                }
                            />
                        );
                    })}

                    {sparkles.map((i) => {
                        const positions = [
                            { top: "20%", left: "60%" },
                            { top: "18%", left: "72%" },
                            { top: "34%", left: "82%" },
                            { top: "54%", left: "58%" },
                            { top: "62%", left: "84%" },
                            { top: "30%", left: "52%" },
                            { top: "70%", left: "68%" },
                            { top: "42%", left: "90%" },
                            { top: "12%", left: "86%" },
                            { top: "76%", left: "92%" },
                        ];

                        return (
                            <span
                                key={`sparkle-${i}`}
                                className="pointer-events-none absolute z-20"
                                style={{
                                    top: positions[i].top,
                                    left: positions[i].left,
                                    animation: `sparkle-burst 1400ms ease-out ${i * 160}ms infinite`,
                                }}
                            >
                                <span className="block h-4 w-4 rotate-45 rounded-[4px] bg-white shadow-[0_0_24px_rgba(255,255,255,0.95)]" />
                            </span>
                        );
                    })}
                </>
            )}

            <div className="relative z-10 grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="max-w-2xl">
                    <p
                        className={`text-sm font-semibold uppercase tracking-[0.25em] text-pink-500 ${isVisible ? "" : "opacity-0"
                            }`}
                        style={isVisible ? { animation: "text-rise 700ms ease-out forwards" } : undefined}
                    >
                        Birthday Cinematic Surprise
                    </p>

                    <h2
                        className={`mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-5xl ${isVisible ? "" : "opacity-0"
                            }`}
                        style={
                            isVisible
                                ? { animation: "text-rise 850ms ease-out 120ms forwards" }
                                : undefined
                        }
                    >
                        {title}
                    </h2>

                    <p
                        className={`mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg ${isVisible ? "" : "opacity-0"
                            }`}
                        style={
                            isVisible
                                ? { animation: "text-rise 850ms ease-out 240ms forwards" }
                                : undefined
                        }
                    >
                        {subtitle}
                    </p>

                    <div
                        className={`mt-8 flex flex-wrap gap-3 ${isVisible ? "" : "opacity-0"
                            }`}
                        style={
                            isVisible
                                ? { animation: "text-rise 850ms ease-out 360ms forwards" }
                                : undefined
                        }
                    >
                        <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-rose-500 shadow-sm ring-1 ring-pink-100">
                            🎉 Happy Birthday
                        </span>
                        <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-amber-600 shadow-sm ring-1 ring-pink-100">
                            🧸 Bear Delivery
                        </span>
                        <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-fuchsia-500 shadow-sm ring-1 ring-pink-100">
                            ✨ Surprise Mode
                        </span>
                    </div>
                </div>

                <div className="relative flex min-h-[320px] items-center justify-center">
                    {balloons.map((i) => {
                        const palette = [
                            "from-pink-400 to-rose-400",
                            "from-fuchsia-400 to-pink-500",
                            "from-amber-300 to-orange-300",
                        ];
                        const positions = [
                            "left-2 top-4",
                            "left-20 top-0",
                            "right-8 top-8",
                        ];

                        return (
                            <div
                                key={`balloon-${i}`}
                                className={`absolute ${positions[i]} ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
                                style={{
                                    animation: isVisible
                                        ? `balloon-rise ${2600 + i * 260}ms ease-in-out ${i * 120}ms infinite`
                                        : undefined,
                                }}
                            >
                                <div className={`h-16 w-12 rounded-[999px] bg-gradient-to-b ${palette[i]} shadow-lg`} />
                                <div className="mx-auto h-10 w-px bg-pink-300/70" />
                            </div>
                        );
                    })}

                    <div
                        className={`absolute inset-x-10 bottom-4 h-8 rounded-full bg-pink-200/50 blur-xl transition-all duration-700 ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
                            }`}
                    />

                    <div
                        className={`relative ${isVisible ? "opacity-100" : "opacity-0"
                            }`}
                        style={
                            isVisible
                                ? { animation: "cinematic-enter 5500ms cubic-bezier(.2,.8,.2,1) forwards" }
                                : undefined
                        }
                    >
                        <div
                            className="absolute inset-0 rounded-full bg-pink-300/35 blur-2xl"
                            style={isVisible ? { animation: "glow-pulse 2200ms ease-in-out infinite" } : undefined}
                        />

                        <div
                            className="relative"
                            style={isVisible ? { animation: "float-soft 2600ms ease-in-out infinite" } : undefined}
                        >
                            <div
                                className={`absolute -top-12 left-1/2 z-30 -translate-x-1/2 ${isVisible ? "opacity-100" : "opacity-0"
                                    }`}
                                style={isVisible ? { animation: "sign-pop 900ms ease-out 4000ms forwards" } : undefined}
                            >
                                <div className="relative rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 px-5 py-3 text-lg font-black tracking-wide text-white shadow-[0_14px_30px_rgba(244,114,182,0.35)]">
                                    HBD 🎉
                                    <div className="absolute left-1/2 top-full h-8 w-1 -translate-x-1/2 bg-amber-700" />
                                </div>
                            </div>

                            <div className="relative flex h-[250px] w-[220px] items-end justify-center">
                                <div className="absolute top-[56px] h-[128px] w-[128px] rounded-full bg-amber-300 shadow-[0_12px_30px_rgba(120,53,15,0.15)]">
                                    <div className="absolute -left-3 top-1 h-10 w-10 rounded-full bg-amber-300" />
                                    <div className="absolute -right-3 top-1 h-10 w-10 rounded-full bg-amber-300" />
                                    <div className="absolute left-0 top-0 h-full w-full rounded-full ring-4 ring-amber-200/60" />

                                    <div className="absolute left-[30px] top-[48px] h-4 w-4 rounded-full bg-slate-900 origin-center"
                                        style={isVisible ? { animation: "blink 4s ease-in-out 1s infinite" } : undefined}
                                    />
                                    <div className="absolute right-[30px] top-[48px] h-4 w-4 rounded-full bg-slate-900 origin-center"
                                        style={isVisible ? { animation: "blink 4s ease-in-out 1s infinite" } : undefined}
                                    />

                                    <div className="absolute left-1/2 top-[70px] h-8 w-10 -translate-x-1/2 rounded-[999px] bg-amber-100">
                                        <div className="absolute left-1/2 top-[8px] h-4 w-5 -translate-x-1/2 rounded-full bg-amber-800" />
                                    </div>

                                    <div className="absolute left-1/2 top-[98px] h-3 w-8 -translate-x-1/2 rounded-b-full border-b-[3px] border-amber-900" />
                                    <div className="absolute left-[24px] top-[76px] h-3 w-3 rounded-full bg-rose-300/60" />
                                    <div className="absolute right-[24px] top-[76px] h-3 w-3 rounded-full bg-rose-300/60" />
                                </div>

                                <div className="absolute bottom-3 h-[118px] w-[140px] rounded-[44px] bg-amber-300 shadow-[0_18px_30px_rgba(120,53,15,0.16)]">
                                    <div className="absolute -left-4 top-7 h-14 w-12 rounded-full bg-amber-300" />
                                    <div
                                        className="absolute -right-5 top-4 h-14 w-12 origin-top-left rounded-full bg-amber-300"
                                        style={isVisible ? { animation: "wave-hand 1200ms ease-in-out 1.2s infinite" } : undefined}
                                    />
                                    <div className="absolute bottom-0 left-5 h-10 w-9 rounded-full bg-amber-400" />
                                    <div className="absolute bottom-0 right-5 h-10 w-9 rounded-full bg-amber-400" />
                                    <div className="absolute left-1/2 top-4 h-9 w-9 -translate-x-1/2 rounded-full bg-white/30 blur-md" />
                                </div>

                                <div className="absolute bottom-[56px] left-[28px] h-10 w-10 rounded-full bg-amber-200" />
                                <div className="absolute bottom-[56px] right-[24px] h-10 w-10 rounded-full bg-amber-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}