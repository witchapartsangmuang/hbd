"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BirthdayPasscodeProps = {
    correctCode?: string; // เช่น 181299 = 18/12/99
    onSuccess?: () => void;
};

const EMPTY_DIGITS = ["", "", "", "", "", ""];

export default function DateOfBirth({
    correctCode = "181299",
    onSuccess,
}: BirthdayPasscodeProps) {
    const [digits, setDigits] = useState<string[]>(EMPTY_DIGITS);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [shake, setShake] = useState(false);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const joinedCode = useMemo(() => digits.join(""), [digits]);
    const isComplete = useMemo(() => digits.every((d) => d !== ""), [digits]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (!isComplete) {
            setSuccess(false);
            setError("");
            return;
        }

        if (joinedCode === correctCode) {
            setError("");
            setSuccess(true);
            onSuccess?.();
        } else {
            setSuccess(false);
            setError("รหัสวันเกิดไม่ถูกต้อง ลองอีกครั้งนะ 💗");
            setShake(true);

            const timer = setTimeout(() => setShake(false), 450);
            return () => clearTimeout(timer);
        }
    }, [joinedCode, isComplete, correctCode, onSuccess]);

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
        inputRefs.current[index]?.select();
    };

    const handleChange = (index: number, value: string) => {
        const onlyNumber = value.replace(/\D/g, "");

        const next = [...digits];

        if (!onlyNumber) {
            next[index] = "";
            setDigits(next);
            return;
        }

        next[index] = onlyNumber.slice(-1);
        setDigits(next);

        if (index < 5) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace") {
            if (digits[index]) {
                const next = [...digits];
                next[index] = "";
                setDigits(next);
                return;
            }

            if (index > 0) {
                const next = [...digits];
                next[index - 1] = "";
                setDigits(next);
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
                setSuccess(true);
                setError("");
                onSuccess?.();
            } else {
                setSuccess(false);
                setError("รหัสวันเกิดไม่ถูกต้อง ลองอีกครั้งนะ 💗");
                setShake(true);
                setTimeout(() => setShake(false), 450);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        const next = [...EMPTY_DIGITS];
        pasted.split("").forEach((char, i) => {
            next[i] = char;
        });

        setDigits(next);

        const focusIndex = Math.min(pasted.length, 5);
        focusInput(focusIndex);
    };

    const handleReset = () => {
        setDigits([...EMPTY_DIGITS]);
        setError("");
        setSuccess(false);
        setShake(false);
        focusInput(0);
    };

    const placeholders = ["D", "D", "M", "M", "Y", "Y"];

    return (
        <div className="mx-auto w-full max-w-md rounded-[28px] border border-rose-100 bg-white/90 p-6 shadow-xl backdrop-blur">
            <div className="mb-5 text-center">
                <h2 className="text-2xl font-bold text-rose-600">🔐 ใส่รหัสวันเกิด</h2>
                <p className="mt-2 text-sm text-rose-900/70">
                    กรอกรหัส 6 หลักในรูปแบบ <span className="font-semibold">DDMMYY</span>
                </p>
                <p className="mt-1 text-xs text-rose-500">
                    ตัวอย่าง: 18/12/99 → 181299
                </p>
            </div>

            <div className="mb-3 flex justify-center gap-2">
                {digits.map((digit, i) => (
                    <span
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full transition ${digit ? "bg-rose-500" : "bg-rose-200"
                            } ${success ? "!bg-emerald-500" : ""}`}
                    />
                ))}
            </div>

            <div
                className={`flex items-center justify-center gap-2 transition ${shake ? "animate-[shake_0.35s_ease-in-out]" : ""
                    }`}
            >
                {digits.map((digit, index) => {
                    const showDivider = index === 1 || index === 3;

                    return (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                placeholder={placeholders[index]}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className={`h-14 w-12 rounded-2xl border text-center text-xl font-bold outline-none transition placeholder:text-rose-300
                                ${success
                                        ? "border-emerald-400 bg-emerald-50 text-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                                        : error
                                            ? "border-rose-400 bg-rose-50 text-rose-700"
                                            : "border-rose-200 bg-rose-50 text-rose-700 focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)]"
                                    }`}
                            />
                            {showDivider && (
                                <span className="select-none text-xl font-bold text-rose-300">
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
                        ถูกต้องแล้ว 🎉 พร้อมไปดูเซอร์ไพรส์ต่อได้เลย
                    </p>
                )}

                {!success && error && (
                    <p className="font-medium text-rose-500">{error}</p>
                )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 active:scale-95"
                >
                    ล้างรหัส
                </button>

                <div className="rounded-full bg-rose-100 px-4 py-2 text-sm text-rose-700">
                    {joinedCode.length}/6 หลัก
                </div>
            </div>

            <p className="mt-4 text-center text-xs text-rose-400">
                Hint: ใช้วันเดือนปีเกิดแบบ 6 หลัก
            </p>
        </div>
    );
}