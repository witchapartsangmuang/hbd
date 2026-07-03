"use client";

import { useEffect, useMemo, useRef } from "react";
import { dateOfBirthState } from "@/components/sections/utils/hooks";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function DateOfBirth({
    content,
    nextStep,
}: {
    content: HbdContent;
    nextStep: () => void;
}) {
    const { digitCount = 6, formatPlaceholder, correctCode } = content.dateOfBirth as typeof content.dateOfBirth & { digitCount: 4 | 6 | 8 };
    const emptyArr = useMemo<string[]>(() => Array(digitCount).fill(""), [digitCount]);
    const { digits, setdigits, shake, setshake, success, setsuccess, error, seterror } =
        dateOfBirthState(digitCount);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const joinedCode = useMemo(() => digits.join(""), [digits]);
    const isComplete = useMemo(() => digits.every((d) => d !== ""), [digits]);
    const last = digitCount - 1;

    useEffect(() => {
        if (!isComplete) {
            setsuccess(false);
            seterror("");
            return;
        }

        if (joinedCode === correctCode) {
            seterror("");
            setsuccess(true);
            nextStep();
        } else {
            setsuccess(false);
            seterror("Incorrect code, please try again 💗");
            setshake(true);
            const timer = setTimeout(() => setshake(false), 450);
            return () => clearTimeout(timer);
        }
    }, [joinedCode, isComplete, correctCode]);

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
                setsuccess(true);
                seterror("");
                nextStep();
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
        pasted.split("").forEach((char, i) => { next[i] = char; });
        setdigits(next);
        focusInput(Math.min(pasted.length, last));
    };

    const handleReset = () => {
        setdigits([...emptyArr]);
        seterror("");
        setsuccess(false);
        setshake(false);
        focusInput(0);
    };

    const formatLabel = digitCount === 4 ? "DDMM" : digitCount === 8 ? "DDMMYYYY" : "DDMMYY";
    const exampleHint = digitCount === 4 ? "18/12 → 1812" : digitCount === 8 ? "18/12/1999 → 18121999" : "18/12/99 → 181299";

    return (
        <div className="mx-auto w-full max-w-md rounded-[28px] border border-(--theme-border) bg-white/90 p-6 shadow-xl backdrop-blur">
            <div className="mb-5 text-center">
<<<<<<< HEAD
                <h2 className="text-2xl font-bold text-rose-600">Enter Birthday Code</h2>
                <p className="mt-2 text-sm text-rose-900/70">
                    Enter your {digitCount}-digit code in the format{" "}
                    <span className="font-semibold">{formatLabel}</span>
                </p>
                <p className="mt-1 text-xs text-rose-500">Example: {exampleHint}</p>
=======
                <h2 className="text-2xl font-bold text-(--theme-primary-dark)">🔐 Enter Birthday Code</h2>
                <p className="mt-2 text-sm text-[#3a2433]/70">
                    Enter your 6-digit code in the format <span className="font-semibold">DDMMYY</span>
                </p>
                <p className="mt-1 text-xs text-(--theme-primary)">Example: 18/12/99 → 181299</p>
>>>>>>> 86186fc85f85b263506d3394eaa423f0576a6c37
            </div>

            <div className="mb-3 flex justify-center gap-2">
                {digits.map((digit, i) => (
                    <span
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full transition ${
                            digit ? "bg-(--theme-primary)" : "bg-(--theme-border)"
                        } ${success ? "!bg-emerald-500" : ""}`}
                    />
                ))}
            </div>

            <div
                className={`flex items-center justify-center gap-2 transition ${
                    shake ? "animate-[shake_0.35s_ease-in-out]" : ""
                }`}
            >
                {digits.map((digit, index) => {
                    const showDivider = index === 1 || (digitCount !== 4 && index === 3);
                    return (
                        <div key={index} className="flex items-center gap-1">
                            <input
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                placeholder={formatPlaceholder[index]}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className={`h-12 w-10 rounded-2xl border text-center text-xl font-bold outline-none transition placeholder:text-(--theme-primary-light)
                                ${
                                    success
                                        ? "border-emerald-400 bg-emerald-50 text-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                                        : error
                                          ? "border-(--theme-primary-light) bg-(--theme-softer) text-(--theme-primary-dark)"
                                          : "border-(--theme-border) bg-(--theme-softer) text-(--theme-primary-dark) focus:border-(--theme-primary-light) focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]"
                                }`}
                            />
                            {showDivider && (
<<<<<<< HEAD
                                <span className="select-none text-xl font-bold text-rose-300">/</span>
=======
                                <span className="select-none text-xl font-bold text-(--theme-primary-light)">
                                    /
                                </span>
>>>>>>> 86186fc85f85b263506d3394eaa423f0576a6c37
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 min-h-6 text-center">
                {success && (
                    <p className="font-semibold text-emerald-600">
                        Correct 🎉 Continue to your birthday surprise
                    </p>
                )}
<<<<<<< HEAD
                {!success && error && <p className="font-medium text-rose-500">{error}</p>}
=======

                {!success && error && <p className="font-medium text-(--theme-primary)">{error}</p>}
>>>>>>> 86186fc85f85b263506d3394eaa423f0576a6c37
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-(--theme-border) px-4 py-2 text-sm font-medium text-(--theme-primary-dark) transition hover:bg-(--theme-softer) active:scale-95"
                >
                    Clear
                </button>
<<<<<<< HEAD
                <div className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700">
                    {joinedCode.length}/{digitCount} digits
                </div>
            </div>

            <p className="mt-4 text-center text-xs text-rose-400">
                Hint: Use your date of birth as {digitCount} digits
=======

                <div className="rounded-full bg-(--theme-soft) px-4 py-2 text-sm text-(--theme-primary-dark)">
                    {joinedCode.length}/6 digits
                </div>
            </div>

            <p className="mt-4 text-center text-xs text-(--theme-primary-light)">
                Hint: Use your date of birth as 6 digits
>>>>>>> 86186fc85f85b263506d3394eaa423f0576a6c37
            </p>
        </div>
    );
}
