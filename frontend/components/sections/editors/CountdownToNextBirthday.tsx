"use client";

import { useEffect, useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

function getNextBirthday(month: number, day: number, from: Date): Date {
    const year = from.getFullYear();
    let next = new Date(year, month - 1, day, 0, 0, 0, 0);
    if (next.getTime() <= from.getTime()) {
        next = new Date(year + 1, month - 1, day, 0, 0, 0, 0);
    }
    return next;
}

export default function CountdownToNextBirthday({
    nextStep,
    content,
}: {
    nextStep: () => void;
    content: HbdContent;
}) {
    const { birthdayMonth, birthdayDay, message } = content.countdownToNextBirthday;
    const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number } | null>(
        null
    );

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const target = getNextBirthday(birthdayMonth, birthdayDay, now);
            const diff = Math.max(0, target.getTime() - now.getTime());
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            setRemaining({ d, h, m, s });
        };
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, [birthdayMonth, birthdayDay]);

    const units = remaining
        ? [
              { label: "Days", value: remaining.d },
              { label: "Hours", value: remaining.h },
              { label: "Min", value: remaining.m },
              { label: "Sec", value: remaining.s },
          ]
        : [];

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-indigo-50 via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Looking Ahead
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">Countdown 🎂</h2>
                <p className="mt-2 max-w-sm text-sm text-slate-600">{message}</p>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {units.map((unit) => (
                    <div
                        key={unit.label}
                        className="flex w-14 flex-col items-center rounded-2xl bg-white p-2 shadow-xl sm:w-20 sm:p-3"
                    >
                        <span className="text-2xl font-black tabular-nums text-(--theme-primary-dark) sm:text-3xl">
                            {unit.value}
                        </span>
                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                            {unit.label}
                        </span>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2.5 font-semibold text-white shadow-lg transition active:scale-95"
            >
                Next ▶
            </button>
        </section>
    );
}
