"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ScrollDownButton from "@/components/ScrollDownButton";
import { launchConfetti } from "@/components/sections/utils/functions";
import { ConfettiPiece } from "@/components/sections/utils/type";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function SecretCode({
    content,
    nextStep,
    sectionId,
}: {
    content: HbdContent;
    nextStep: () => void;
    sectionId: string;
}) {
    const {
        digitCount = 4,
        correctCode = "",
        hint = "",
        revealImage = "",
        aspectRatio = "3:4",
    } = content.secretCode?.[sectionId] ?? {};
    const cardAspect = aspectRatio.replace(":", "/");
    const emptyArr = useMemo<string[]>(() => Array(digitCount).fill(""), [digitCount]);
    const [digits, setdigits] = useState<string[]>(() => Array(digitCount).fill(""));
    const [shake, setshake] = useState(false);
    const [success, setsuccess] = useState(false);
    const [error, seterror] = useState("");
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    // Post-success flow: fade the code card out, show a flip card, then flip it
    // to reveal the photo.
    const [stage, setStage] = useState<"input" | "reveal">("input");
    const [cardIn, setCardIn] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const confettiIdRef = useRef(1);
    const successHandledRef = useRef(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const joinedCode = useMemo(() => digits.join(""), [digits]);
    const isComplete = useMemo(() => digits.every((d) => d !== ""), [digits]);
    const last = digitCount - 1;

    // Runs once when the code is correct. Fires confetti, then either hands off
    // to the gift-box reveal (when a photo is configured) or just unlocks the
    // next section (original behaviour when no reveal image is set).
    const handleSuccess = () => {
        if (successHandledRef.current) return;
        successHandledRef.current = true;
        seterror("");
        setsuccess(true);
        launchConfetti(confettiIdRef, setConfetti, content.confettiColors);
        if (revealImage) {
            // let the code card fade out (700ms) before swapping in the flip card
            window.setTimeout(() => setStage("reveal"), 700);
        } else {
            nextStep();
        }
    };

    useEffect(() => {
        if (!isComplete) {
            setsuccess(false);
            seterror("");
            return;
        }

        if (joinedCode === correctCode) {
            handleSuccess();
        } else {
            setsuccess(false);
            seterror("Incorrect code, please try again 💗");
            setshake(true);
            const timer = setTimeout(() => setshake(false), 450);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [joinedCode, isComplete, correctCode]);

    // Fade the flip card in once it mounts.
    useEffect(() => {
        if (stage !== "reveal") return;
        const t = setTimeout(() => setCardIn(true), 20);
        return () => clearTimeout(t);
    }, [stage]);

    const flipCard = () => {
        if (flipped) return;
        setFlipped(true);
        launchConfetti(confettiIdRef, setConfetti, content.confettiColors);
        nextStep();
    };

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
        inputRefs.current[index]?.select();
    };

    const handleChange = (index: number, value: string) => {
        const onlyNumber = value.replace(/\D/g, "");
        const next = [...digits];
        if (!onlyNumber) {
            next[index] = "";
            setdigits(next);
            return;
        }
        next[index] = onlyNumber.slice(-1);
        setdigits(next);
        if (index < last) focusInput(index + 1);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (digits[index]) {
                const next = [...digits];
                next[index] = "";
                setdigits(next);
                return;
            }
            if (index > 0) {
                const next = [...digits];
                next[index - 1] = "";
                setdigits(next);
                focusInput(index - 1);
            }
        }
        if (e.key === "ArrowLeft" && index > 0) focusInput(index - 1);
        if (e.key === "ArrowRight" && index < last) focusInput(index + 1);
        if (e.key === "Enter" && isComplete) {
            if (joinedCode === correctCode) {
                handleSuccess();
            } else {
                setsuccess(false);
                seterror("Incorrect code, please try again 💗");
                setshake(true);
                setTimeout(() => setshake(false), 450);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, digitCount);
        if (!pasted) return;
        const next = [...emptyArr];
        pasted.split("").forEach((char, i) => {
            next[i] = char;
        });
        setdigits(next);
        focusInput(Math.min(pasted.length, last));
    };

    const handleReset = () => {
        setdigits([...emptyArr]);
        seterror("");
        setsuccess(false);
        setshake(false);
        successHandledRef.current = false;
        focusInput(0);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6">
            {stage === "input" && (
                <div
                    className={`mx-auto w-full max-w-md rounded-[28px] border border-(--theme-border) bg-white/90 p-6 shadow-xl backdrop-blur transition-opacity duration-700 ${
                        success && revealImage ? "opacity-0" : "opacity-100"
                    }`}
                >
                    <div className="mb-5 text-center">
                        <h2 className="text-2xl font-bold text-(--theme-primary-dark)">
                            🔒 Enter Secret Code
                        </h2>
                        <p className="mt-2 text-sm text-[#3a2433]/70">
                            Enter the {digitCount}-digit secret code to unlock the next surprise
                        </p>
                        {hint && (
                            <p className="mx-auto mt-3 max-w-xs rounded-2xl bg-(--theme-softer) px-4 py-2 text-sm text-(--theme-primary-dark)">
                                💡 {hint}
                            </p>
                        )}
                    </div>

                    <div className="mb-3 flex justify-center gap-2">
                        {digits.map((digit, i) => (
                            <span
                                key={i}
                                className={`h-2.5 w-2.5 rounded-full transition ${
                                    digit ? "bg-(--theme-primary)" : "bg-(--theme-border)"
                                } ${success ? "bg-emerald-500!" : ""}`}
                            />
                        ))}
                    </div>

                    <div
                        className={`flex w-full items-center justify-center gap-1.5 transition sm:gap-2 ${
                            shake ? "animate-[shake_0.35s_ease-in-out]" : ""
                        }`}
                    >
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                placeholder="•"
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className={`h-11 min-w-0 max-w-11 flex-1 rounded-2xl border text-center text-lg font-bold outline-none transition placeholder:text-(--theme-primary-light) sm:h-12 sm:text-xl
                                ${
                                    success
                                        ? "border-emerald-400 bg-emerald-50 text-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                                        : error
                                          ? "border-(--theme-primary-light) bg-(--theme-softer) text-(--theme-primary-dark)"
                                          : "border-(--theme-border) bg-(--theme-softer) text-(--theme-primary-dark) focus:border-(--theme-primary-light) focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="mt-5 min-h-6 text-center">
                        {success && (
                            <p className="font-semibold text-emerald-600">
                                Correct 🎉 Continue to your birthday surprise
                            </p>
                        )}
                        {!success && error && (
                            <p className="font-medium text-(--theme-primary)">{error}</p>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-full border border-(--theme-border) px-4 py-2 text-sm font-medium text-(--theme-primary-dark) transition hover:bg-(--theme-softer) active:scale-95"
                        >
                            Clear
                        </button>
                        <div className="rounded-full bg-(--theme-soft) px-4 py-2 text-sm text-(--theme-primary-dark)">
                            {joinedCode.length}/{digitCount} digits
                        </div>
                    </div>

                    {success && !revealImage && (
                        <div className="mt-5 flex justify-center">
                            <ScrollDownButton />
                        </div>
                    )}
                </div>
            )}

            {stage === "reveal" && (
                <div
                    className={`flex w-full max-w-md flex-col items-center text-center transition-all duration-700 ${
                        cardIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
                    {!flipped && (
                        <p className="mb-8 text-lg font-medium text-(--theme-primary-dark)">
                            🎴 Tap the card to reveal your surprise
                        </p>
                    )}
                    <div className="mx-auto" style={{ perspective: "1400px" }}>
                        <button
                            type="button"
                            onClick={flipCard}
                            disabled={flipped}
                            aria-label="Flip the card to reveal the photo"
                            className="relative block cursor-pointer disabled:cursor-default"
                            style={{ width: "min(80vw, 300px)", aspectRatio: cardAspect }}
                        >
                            <div
                                className="relative h-full w-full transition-transform duration-700 ease-in-out"
                                style={{
                                    transformStyle: "preserve-3d",
                                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                }}
                            >
                                {/* front */}
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center rounded-[28px] border border-(--theme-border) bg-linear-to-br from-(--theme-primary-light) via-(--theme-primary-light) to-(--theme-gradient-to) p-6 text-center text-white shadow-[0_20px_60px_rgba(236,72,153,0.28)]"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    <div className="text-6xl drop-shadow">🎁</div>
                                    <p className="mt-3 max-w-45 text-sm leading-relaxed text-white/90">
                                        Tap to reveal your surprise
                                    </p>
                                </div>
                                {/* back — the revealed photo */}
                                <div
                                    className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={revealImage}
                                        alt="surprise"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </button>
                    </div>

                    {flipped && <ScrollDownButton className="mt-8" />}
                </div>
            )}

            {confetti.length > 0 && (
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
            )}
        </div>
    );
}
