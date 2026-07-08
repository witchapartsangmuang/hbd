"use client";

import ScrollDownButton from "@/components/ScrollDownButton";
import { useScratchCanvas } from "@/components/sections/utils/useScratchCanvas";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function ScratchCardYoutube({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const {
        mounted,
        cardSize,
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
        sizeInsetPx: 10,
    });

    return (
        <section className="relative flex flex-col items-center p-5">
            <p className="mt-6 text-3xl font-bold text-(--theme-primary-dark)">{headingText}</p>
            <p className="mt-3 text-center text-[#3a2433]/80">{subText}</p>
            <div className="w-full z-1000 h-1">
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
            <div className="flex w-full p-2 justify-center">
                {mounted && (
                    <div
                        ref={containerRef}
                        style={{ minWidth: cardSize.width, minHeight: cardSize.height }}
                        className="flex justify-center rounded-3xl border shadow-2xl border-white/70 bg-white/70 p-2"
                    >
                        <div
                            className="flex items-center justify-center relative overflow-hidden rounded-2xl border border-(--theme-border) bg-linear-to-br from-(--theme-soft) via-(--theme-softer) to-white"
                            style={{ width: cardSize.width, height: cardSize.height }}
                        >
                            {!showVideo && (
                                <>
                                    <canvas
                                        ref={canvasRef}
                                        className={`absolute z-10 transition-opacity duration-500 touch-none ${
                                            isRevealed ? "pointer-events-none" : "cursor-crosshair"
                                        }`}
                                        style={{
                                            opacity: isFading ? 0 : 1,
                                        }}
                                        {...canvasHandlers}
                                    />
                                    <div
                                        className="absolute z-5 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,var(--theme-softer),var(--theme-soft)_55%,var(--theme-border))]"
                                        style={{
                                            width: cardSize.width,
                                            height: cardSize.height,
                                            opacity: isFading ? 0 : 1,
                                        }}
                                    />
                                </>
                            )}
                            <iframe
                                className="absolute h-full w-full"
                                src={`${content.scratchCard?.[sectionId]?.youtubeUrl ?? "https://www.youtube.com/embed/S43vWT9waGQ"}?autoplay=${showVideo ? "1" : "0"}&rel=0`}
                                title="Birthday Video"
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
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
