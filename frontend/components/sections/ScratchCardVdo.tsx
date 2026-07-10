"use client";

import { useEffect, useRef } from "react";
import ScrollDownButton from "@/components/ScrollDownButton";
import { useScratchCanvas } from "@/components/sections/utils/useScratchCanvas";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function ScratchCardVdo({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const {
        mounted,
        cardAspect,
        isRevealed,
        isFading,
        showVideo,
        confetti,
        containerRef,
        canvasRef,
        canvasHandlers,
        headingText,
        subText,
        revealedText,
    } = useScratchCanvas({
        content,
        sectionId,
        nextStep,
        clearDelayMs: 120,
        showVideoDelayMs: 1000,
        onInitCanvas: () => {
            const video = videoRef.current;
            if (!video) return;
            video.pause();
            video.currentTime = 0;
            video.muted = false;
        },
    });

    useEffect(() => {
        if (!showVideo) return;
        const video = videoRef.current;
        if (!video) return;
        video.muted = false;
        video.currentTime = 0;
        video.play().catch((error) => {
            console.error("Video play failed:", error);
        });
    }, [showVideo]);

    return (
        <section className="relative flex flex-col items-center p-5">
            <p className="mt-6 text-3xl font-bold text-(--theme-primary-dark)">{headingText}</p>
            <p className="mt-3 text-center text-[#3a2433]/80">{subText}</p>
            <div className="pointer-events-none fixed inset-0 z-1000">
                {confetti.map((piece) => (
                    <span
                        key={piece.id}
                        className="confetti-piece pointer-events-none absolute z-9999 block rounded-sm"
                        style={
                            {
                                left: "50%",
                                top: "50%",
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
            <div className="flex w-full p-2 justify-center">
                {mounted && (
                    <div className="w-full max-w-md flex justify-center rounded-3xl border shadow-2xl border-white/70 bg-white/70 p-2">
                        <div
                            ref={containerRef}
                            className="w-full flex items-center justify-center relative overflow-hidden rounded-2xl border border-(--theme-border) bg-linear-to-br from-(--theme-soft) via-(--theme-softer) to-white"
                            style={{ aspectRatio: cardAspect }}
                        >
                            {!showVideo && (
                                <>
                                    <canvas
                                        ref={canvasRef}
                                        className={`absolute z-10 transition-opacity duration-1000 touch-none ${
                                            isRevealed ? "pointer-events-none" : "cursor-crosshair"
                                        }`}
                                        style={{
                                            opacity: isFading ? 0 : 1,
                                        }}
                                        {...canvasHandlers}
                                    />
                                    <div
                                        className="absolute inset-0 z-5 transition-opacity duration-1000 bg-[radial-gradient(circle_at_top,var(--theme-softer),var(--theme-soft)_55%,var(--theme-border))]"
                                        style={{
                                            opacity: isFading ? 0 : 1,
                                        }}
                                    />
                                </>
                            )}
                            <video
                                ref={videoRef}
                                controls={showVideo}
                                playsInline
                                preload="auto"
                                className="absolute inset-0 w-full h-full object-contain"
                            >
                                <source
                                    src={
                                        content.scratchCard?.[sectionId]?.videoSrc ??
                                        "/video/nm-tt.mp4"
                                    }
                                    type="video/mp4"
                                />
                            </video>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4 rounded-[18px] bg-white/80 p-4 shadow-sm sm:mt-5 sm:rounded-[20px]">
                <p className="text-sm font-medium text-(--theme-primary-dark)">
                    {isRevealed ? revealedText : "Scratch slowly ✨"}
                </p>
            </div>
            {isRevealed && <ScrollDownButton className="mt-5" />}
        </section>
    );
}
