"use client";

import { useRef, useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function DigitalSignature({
    nextStep,
    content,
}: {
    nextStep: () => void;
    content: HbdContent;
}) {
    const { promptText } = content.digitalSignature;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingRef = useRef(false);
    const [hasSigned, setHasSigned] = useState(false);

    const getContext = () => canvasRef.current?.getContext("2d") ?? null;

    const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        // Canvas is CSS-scaled to fit narrow viewports (width: 100%), so the
        // rendered size can differ from the 340x180 drawing resolution — map
        // pointer coordinates back into canvas space or strokes land offset.
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        drawingRef.current = true;
        const ctx = getContext();
        const { x, y } = getPoint(e);
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawingRef.current) return;
        const ctx = getContext();
        const { x, y } = getPoint(e);
        if (!ctx) return;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#be123c";
        ctx.lineTo(x, y);
        ctx.stroke();
        if (!hasSigned) setHasSigned(true);
    };

    const handlePointerUp = () => {
        drawingRef.current = false;
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = getContext();
        if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
    };

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-white p-4 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Seal It With Love
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">Sign the Card ✍️</h2>
                <p className="mt-2 max-w-sm text-sm text-slate-600">{promptText}</p>
            </div>

            <canvas
                ref={canvasRef}
                width={340}
                height={180}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="aspect-340/180 w-full max-w-85 touch-none rounded-2xl border-2 border-dashed border-(--theme-primary-light) bg-white shadow-xl"
            />

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={clearSignature}
                    className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                    Clear
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    disabled={!hasSigned}
                    className="rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2 text-sm font-semibold text-white shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                    Next ▶
                </button>
            </div>
        </section>
    );
}
