"use client";

import { useEffect, useState } from "react";
import ScrollDownButton from "@/components/ScrollDownButton";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function CountdownToNextBirthday({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const {
        birthdayYear = new Date().getFullYear(),
        birthdayMonth = 12,
        birthdayDay = 18,
        message = "",
    } = content.countdownToNextBirthday?.[sectionId] ?? {};
    const [remaining, setRemaining] = useState<{
        d: number;
        h: number;
        m: number;
        s: number;
    } | null>(null);

    // Auto-advance: unlock the next section on mount (no Next button). nextStep
    // is idempotent, so a Strict-Mode double-invoke is harmless.
    useEffect(() => {
        nextStep();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const target = new Date(birthdayYear, birthdayMonth - 1, birthdayDay, 0, 0, 0, 0);
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
    }, [birthdayYear, birthdayMonth, birthdayDay]);

    const units = remaining
        ? [
              { label: "Days", value: remaining.d },
              { label: "Hours", value: remaining.h },
              { label: "Min", value: remaining.m },
              { label: "Sec", value: remaining.s },
          ]
        : [];

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Looking Ahead
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">Countdown 🎂</h2>
                <p className="mt-2 max-w-sm whitespace-pre-line text-sm text-slate-600">
                    {message}
                </p>
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

            <ScrollDownButton />
        </section>
    );
}
