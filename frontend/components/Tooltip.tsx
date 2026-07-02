"use client";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { cx } from "@/lib/format";

type TooltipSide =
    "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "right";

interface TooltipProps {
    content: ReactNode;
    side?: TooltipSide;
    className?: string;
    children: ReactNode;
}

const SIDE: Record<TooltipSide, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    "top-start": "bottom-full left-0 mb-1.5",
    "top-end": "bottom-full right-0 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    "bottom-start": "top-full left-0 mt-1.5",
    "bottom-end": "top-full right-0 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

const FLIP: Record<TooltipSide, TooltipSide> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
    "top-start": "top-end",
    "top-end": "top-start",
    "bottom-start": "bottom-end",
    "bottom-end": "bottom-start",
};

const GAP = 8; // minimum px from viewport edge

function resolvedSide(trigger: DOMRect, tooltip: DOMRect, preferred: TooltipSide): TooltipSide {
    const tw = tooltip.width;
    const th = tooltip.height;
    const cx = trigger.left + trigger.width / 2; // trigger center x
    const cy = trigger.top + trigger.height / 2; // trigger center y
    const W = window.innerWidth;
    const H = window.innerHeight;

    const fits = (s: TooltipSide): boolean => {
        switch (s) {
            // vertical — also check horizontal centering / alignment
            case "top":
                return trigger.top >= th + GAP && cx - tw / 2 >= GAP && cx + tw / 2 <= W - GAP;
            case "bottom":
                return (
                    trigger.bottom + th + GAP <= H && cx - tw / 2 >= GAP && cx + tw / 2 <= W - GAP
                );
            case "top-start":
                return trigger.top >= th + GAP && trigger.left + tw <= W - GAP;
            case "bottom-start":
                return trigger.bottom + th + GAP <= H && trigger.left + tw <= W - GAP;
            case "top-end":
                return trigger.top >= th + GAP && trigger.right - tw >= GAP;
            case "bottom-end":
                return trigger.bottom + th + GAP <= H && trigger.right - tw >= GAP;
            // horizontal — also check vertical centering
            case "left":
                return trigger.left >= tw + GAP && cy - th / 2 >= GAP && cy + th / 2 <= H - GAP;
            case "right":
                return (
                    trigger.right + tw + GAP <= W && cy - th / 2 >= GAP && cy + th / 2 <= H - GAP
                );
        }
    };

    if (fits(preferred)) return preferred;
    const flipped = FLIP[preferred];
    if (fits(flipped)) return flipped;

    // Neither axis fits — pick the side with the most available space
    const space: Record<TooltipSide, number> = {
        top: trigger.top,
        bottom: H - trigger.bottom,
        left: trigger.left,
        right: W - trigger.right,
        "top-start": trigger.top,
        "top-end": trigger.top,
        "bottom-start": H - trigger.bottom,
        "bottom-end": H - trigger.bottom,
    };
    return ([preferred, flipped] as TooltipSide[]).reduce(
        (best, s) => (space[s] >= space[best] ? s : best),
        preferred
    );
}

export function Tooltip({ content, side = "top", className, children }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [computedSide, setComputedSide] = useState<TooltipSide>(side);
    const [ready, setReady] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLSpanElement>(null);

    // After tooltip renders (hidden), measure and resolve side
    useEffect(() => {
        if (!visible || !triggerRef.current || !tooltipRef.current) return;
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        setComputedSide(resolvedSide(triggerRect, tooltipRect, side));
        setReady(true);
    }, [visible, side]);

    function show() {
        timeoutRef.current = setTimeout(() => {
            setComputedSide(side);
            setReady(false);
            setVisible(true);
        }, 120);
    }

    function hide() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(false);
        setReady(false);
    }

    return (
        <span
            ref={triggerRef}
            className="relative inline-flex items-center"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            {visible && (
                <span
                    ref={tooltipRef}
                    role="tooltip"
                    className={cx(
                        "pointer-events-none absolute z-9999 w-max max-w-96 whitespace-normal wrap-break-word rounded-md px-2.5 py-1.5 text-[14px] bg-white font-semibold shadow-md transition-opacity",
                        ready ? "opacity-100" : "opacity-0",
                        SIDE[computedSide],
                        className
                    )}
                >
                    {content}
                </span>
            )}
        </span>
    );
}
