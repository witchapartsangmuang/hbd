"use client";

import { useEffect, useRef, useState } from "react";
import { launchConfetti } from "@/components/sections/utils/functions";
import { ConfettiPiece } from "@/components/sections/utils/type";
import { HbdContent } from "@/components/sections/utils/content-types";

type CanvasPointerEvent = React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>;

/**
 * Shared scratch-off canvas logic for the ScratchCard section family
 * (image / video / YouTube reveal). Owns the cover drawing, pointer
 * scratching, reveal-progress tracking, and the reveal sequence; the
 * variants only render what sits underneath the canvas.
 */
export function useScratchCanvas({
    content,
    sectionId,
    nextStep,
    clearDelayMs,
    sizeInsetPx = 0,
    showVideoDelayMs,
    onInitCanvas,
}: {
    content: HbdContent;
    sectionId: string;
    nextStep: () => void;
    /** Delay before the scratched-out cover canvas is fully cleared. */
    clearDelayMs: number;
    /** Shrink the measured card size by this many px (YouTube variant). */
    sizeInsetPx?: number;
    /** When set, flips `showVideo` on this long after the reveal. */
    showVideoDelayMs?: number;
    /** Extra per-variant reset run whenever the cover canvas is redrawn. */
    onInitCanvas?: () => void;
}) {
    const {
        brushRadius = 56,
        revealThreshold = 50,
        aspectRatio = "16:9",
        headingText = "",
        subText = "",
        revealedText = "",
    } = content.scratchCard?.[sectionId] ?? {};
    const confettiIdRef = useRef(1);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isDrawingRef = useRef(false);
    const revealedRef = useRef(false);
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [mounted, setmouted] = useState(false);
    const [progress, setprogress] = useState(0);
    const [isRevealed, setisRevealed] = useState(false);
    const [isFading, setisFading] = useState(false);
    const [cardSize, setCardSize] = useState(() => {
        if (typeof window === "undefined") {
            return { width: 1, height: 1 };
        }
        return {
            width: window.innerWidth,
            height: window.innerHeight * 0.4,
        };
    });
    const [showVideo, setshowVideo] = useState(false);

    useEffect(() => {
        setmouted(true);
    }, []);

    useEffect(() => {
        if (progress === revealThreshold) {
            launchConfetti(confettiIdRef, setConfetti, content.confettiColors);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progress]);

    const isMobile = cardSize.width < 720;
    const actualBrushRadius = isMobile ? Math.max(26, brushRadius * 0.6) : brushRadius;

    const initCanvas = (renderWidth: number, renderHeight: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(renderWidth * dpr);
        canvas.height = Math.floor(renderHeight * dpr);
        canvas.style.width = `${renderWidth}px`;
        canvas.style.height = `${renderHeight}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        // Canvas fills need resolved colors, so read the theme CSS variables
        // off the element (with the original pinks as fallbacks).
        const styles = getComputedStyle(canvas);
        const themeVar = (name: string, fallback: string) =>
            styles.getPropertyValue(name).trim() || fallback;
        const gradient = ctx.createLinearGradient(0, 0, renderWidth, renderHeight);
        gradient.addColorStop(0, themeVar("--theme-primary-light", "#f9a8d4"));
        gradient.addColorStop(0.5, themeVar("--theme-primary", "#fb7185"));
        gradient.addColorStop(1, themeVar("--theme-gradient-to", "#f472b6"));
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, renderWidth, renderHeight);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, renderWidth, renderHeight);
        for (let i = 0; i < 36; i++) {
            const x = Math.random() * renderWidth;
            const y = Math.random() * renderHeight;
            const size = 8 + Math.random() * 16;
            ctx.fillStyle = "rgba(255,255,255,0.22)";
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.textAlign = "center";
        ctx.font = isMobile ? "700 24px sans-serif" : "700 34px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fillText("Scratch Me ✨", renderWidth / 2, renderHeight / 2);
        setprogress(0);
        setisRevealed(false);
        setisFading(false);
        setshowVideo(false);
        revealedRef.current = false;
        onInitCanvas?.();
    };

    useEffect(() => {
        if (typeof window === "undefined") return;
        const updateSize = () => {
            const wrapper = containerRef.current;
            if (!wrapper) return;
            const [rw, rh] = (aspectRatio ?? "16:9").split(":").map(Number);
            const nextWidth = wrapper.clientWidth;
            const nextHeight = Math.round(nextWidth * (rh / rw));
            setCardSize({ width: nextWidth - sizeInsetPx, height: nextHeight - sizeInsetPx });
        };
        updateSize();
        const observer = new ResizeObserver(() => {
            updateSize();
        });
        if (containerRef.current) observer.observe(containerRef.current);
        window.addEventListener("resize", updateSize);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateSize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, setCardSize]);

    useEffect(() => {
        if (!cardSize.width || !cardSize.height) return;
        initCanvas(cardSize.width, cardSize.height);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardSize.width, cardSize.height]);

    const getPoint = (e: CanvasPointerEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        if ("touches" in e) {
            const touch = e.touches[0];
            if (!touch) return null;
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const revealSuccess = () => {
        if (revealedRef.current) return;
        revealedRef.current = true;
        setisRevealed(true);
        setisFading(true);
        window.setTimeout(() => {
            const c = canvasRef.current;
            if (!c) return;
            const clearCtx = c.getContext("2d");
            if (!clearCtx) return;
            clearCtx.clearRect(0, 0, c.width, c.height);
        }, clearDelayMs);
        if (showVideoDelayMs !== undefined) {
            window.setTimeout(() => setshowVideo(true), showVideoDelayMs);
        }
        nextStep();
    };

    const scratchAt = (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, actualBrushRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, actualBrushRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        calculateProgress();
    };

    const calculateProgress = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentCount = 0;
        const totalPixels = pixels.length / 4;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 20) transparentCount++;
        }
        const percent = Math.round((transparentCount / totalPixels) * 100);
        setprogress(percent);
        if (percent >= revealThreshold) {
            revealSuccess();
        }
    };

    const canvasHandlers = {
        // Scratching is pointer-only, so give keyboard users a way in:
        // focus the card and press Enter/Space to reveal it directly.
        tabIndex: 0,
        role: "button" as const,
        "aria-label": "Scratch card — press Enter to reveal",
        onKeyDown: (e: React.KeyboardEvent<HTMLCanvasElement>) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            revealSuccess();
        },
        onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => {
            isDrawingRef.current = true;
            const point = getPoint(e);
            if (!point) return;
            scratchAt(point.x, point.y);
        },
        onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!isDrawingRef.current) return;
            const point = getPoint(e);
            if (!point) return;
            scratchAt(point.x, point.y);
        },
        onMouseUp: () => {
            isDrawingRef.current = false;
        },
        onMouseLeave: () => {
            isDrawingRef.current = false;
        },
        onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => {
            isDrawingRef.current = true;
            const point = getPoint(e);
            if (!point) return;
            scratchAt(point.x, point.y);
        },
        onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => {
            if (!isDrawingRef.current) return;
            const point = getPoint(e);
            if (!point) return;
            scratchAt(point.x, point.y);
        },
        onTouchEnd: () => {
            isDrawingRef.current = false;
        },
    };

    return {
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
    };
}
