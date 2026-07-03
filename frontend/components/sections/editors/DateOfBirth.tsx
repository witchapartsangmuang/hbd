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
    const { formatPlaceholder, correctCode, emptyDigits: empty_digits } = content.dateOfBirth;
    const { digits, setdigits, shake, setshake, success, setsuccess, error, seterror } =
        dateOfBirthState();
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const joinedCode = useMemo(() => digits.join(""), [digits]);
    const isComplete = useMemo(() => digits.every((d) => d !== ""), [digits]);
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

        if (index < 5) {
            focusInput(index + 1);
        }
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

        if (e.key === "ArrowLeft" && index > 0) {
            focusInput(index - 1);
        }

        if (e.key === "ArrowRight" && index < 5) {
            focusInput(index + 1);
        }

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

        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        if (!pasted) return;

        const next = [...empty_digits];
        pasted.split("").forEach((char, i) => {
            next[i] = char;
        });

        setdigits(next);

        const focusIndex = Math.min(pasted.length, 5);
        focusInput(focusIndex);
    };

    const handleReset = () => {
        setdigits([...empty_digits]);
        seterror("");
        setsuccess(false);
        setshake(false);
        focusInput(0);
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-[28px] border border-(--theme-border) bg-white/90 p-6 shadow-xl backdrop-blur">
            <div className="mb-5 text-center">
                <h2 className="text-2xl font-bold text-(--theme-primary-dark)">🔐 Enter Birthday Code</h2>
                <p className="mt-2 text-sm text-[#3a2433]/70">
                    Enter your 6-digit code in the format <span className="font-semibold">DDMMYY</span>
                </p>
                <p className="mt-1 text-xs text-(--theme-primary)">Example: 18/12/99 → 181299</p>
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
                    const showDivider = index === 1 || index === 3;

                    return (
                        <div key={index} className="flex items-center gap-1">
                            <input
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
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
                                <span className="select-none text-xl font-bold text-(--theme-primary-light)">
                                    /
                                </span>
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

                {!success && error && <p className="font-medium text-(--theme-primary)">{error}</p>}
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
                    {joinedCode.length}/6 digits
                </div>
            </div>

            <p className="mt-4 text-center text-xs text-(--theme-primary-light)">
                Hint: Use your date of birth as 6 digits
            </p>
        </div>
    );
}
