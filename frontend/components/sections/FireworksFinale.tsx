"use client";

import { useEffect, useRef, useState } from "react";
import NextStepButton from "@/components/NextStepButton";
import { HbdContent } from "@/components/sections/utils/content-types";

type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
};

const FALLBACK_ACCENTS = ["#ff5fa2", "#f472b6"];
const FIXED_COLORS = ["#ffcc66", "#7a7aff", "#67d5b5", "#ff8b5c", "#60a5fa"];

export default function FireworksFinale({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { message = "" } = content.fireworksFinale?.[sectionId] ?? {};
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Canvas fills need resolved colors, so read the theme CSS variables
        // off the element; the fixed accents keep the bursts multicolored.
        const styles = getComputedStyle(canvas);
        const themeVar = (name: string, fallback: string) =>
            styles.getPropertyValue(name).trim() || fallback;
        const colors = [
            themeVar("--theme-primary", FALLBACK_ACCENTS[0]),
            themeVar("--theme-gradient-to", FALLBACK_ACCENTS[1]),
            ...FIXED_COLORS,
        ];

        const spawnBurst = () => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const count = 32;
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const speed = 1.5 + Math.random() * 2.5;
                particlesRef.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color,
                    life: 1,
                });
            }
        };

        const burstInterval = window.setInterval(spawnBurst, 900);
        spawnBurst();

        let raf: number;
        const draw = () => {
            ctx.fillStyle = "rgba(10, 10, 30, 0.18)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02;
                p.life -= 0.012;
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            window.clearInterval(burstInterval);
            cancelAnimationFrame(raf);
        };
    }, []);

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        try {
            if (navigator.share) {
                await navigator.share({ title: "Happy Birthday", url });
                return;
            }
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // user cancelled share or clipboard unavailable — ignore
        }
    };

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-slate-950 p-4 text-center sm:gap-6 sm:p-6">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6">
                <h2 className="text-2xl font-black text-white drop-shadow-lg sm:text-3xl md:text-4xl">
                    {message}
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="rounded-full bg-white/90 px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-lg transition active:scale-95"
                    >
                        {copied ? "Link copied! 🔗" : "Share this page 🔗"}
                    </button>
                    <NextStepButton
                        nextStep={nextStep}
                        className="rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition active:scale-95"
                    >
                        🎉 Finish
                    </NextStepButton>
                </div>
            </div>
        </section>
    );
}
