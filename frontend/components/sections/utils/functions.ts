"use client";
import { ConfettiPiece } from "./type";
import { Dispatch, RefObject, SetStateAction } from "react";

const DEFAULT_CONFETTI_COLORS = [
    "#ff5fa2",
    "#ffcc66",
    "#7a7aff",
    "#67d5b5",
    "#ff8b5c",
    "#f472b6",
    "#60a5fa",
];

export function launchConfetti(
    confettiIdRef: RefObject<number>,
    setConfetti: Dispatch<SetStateAction<ConfettiPiece[]>>,
    colors: string[] = DEFAULT_CONFETTI_COLORS
) {
    const centerX = typeof window !== "undefined" ? window.innerWidth / 2 : 600;
    const pieces: ConfettiPiece[] = Array.from({ length: 120 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 260;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance + 150;

        return {
            id: confettiIdRef.current++,
            left: centerX,
            x,
            y,
            rotate: Math.random() * 720,
            color: colors[Math.floor(Math.random() * colors.length)],
            width: 6 + Math.random() * 8,
            height: 8 + Math.random() * 12,
            duration: 1200 + Math.random() * 900,
        };
    });

    setConfetti((prev) => [...prev, ...pieces]);

    const maxDuration = Math.max(...pieces.map((p) => p.duration));
    window.setTimeout(() => {
        setConfetti((prev) => prev.filter((item) => !pieces.some((piece) => piece.id === item.id)));
    }, maxDuration + 100);
}

