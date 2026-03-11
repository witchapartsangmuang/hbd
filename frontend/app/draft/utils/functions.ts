'use client'
import { confettiState } from "./hooks";
import { ConfettiPiece } from "./type";
import { wishes, typewriterMessage, balloonGradients, confettiColors } from "./data";
import { Dispatch, RefObject, SetStateAction } from "react";


export function launchConfetti(confettiIdRef: RefObject<number>, setConfetti: Dispatch<SetStateAction<ConfettiPiece[]>>) {
    const centerX =
        typeof window !== "undefined" ? window.innerWidth / 2 : 600;
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
            color:
                confettiColors[Math.floor(Math.random() * confettiColors.length)],
            width: 6 + Math.random() * 8,
            height: 8 + Math.random() * 12,
            duration: 1200 + Math.random() * 900,
        };
    });

    setConfetti((prev) => [...prev, ...pieces]);

    const maxDuration = Math.max(...pieces.map((p) => p.duration));
    window.setTimeout(() => {
        setConfetti((prev) =>
            prev.filter((item) => !pieces.some((piece) => piece.id === item.id))
        );
    }, maxDuration + 100);
};