"use client";

import { useMemo } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

const ZODIAC_SIGNS: {
    name: string;
    emoji: string;
    blurb: string;
    endDay: number;
    endMonth: number;
}[] = [
    {
        name: "Capricorn",
        emoji: "♑",
        blurb: "Grounded, disciplined, and quietly ambitious.",
        endMonth: 1,
        endDay: 19,
    },
    {
        name: "Aquarius",
        emoji: "♒",
        blurb: "Curious, independent, and a little bit ahead of their time.",
        endMonth: 2,
        endDay: 18,
    },
    {
        name: "Pisces",
        emoji: "♓",
        blurb: "Dreamy, kind-hearted, and endlessly imaginative.",
        endMonth: 3,
        endDay: 20,
    },
    {
        name: "Aries",
        emoji: "♈",
        blurb: "Bold, energetic, and first to jump into anything new.",
        endMonth: 4,
        endDay: 19,
    },
    {
        name: "Taurus",
        emoji: "♉",
        blurb: "Loyal, steady, and someone who values comfort and care.",
        endMonth: 5,
        endDay: 20,
    },
    {
        name: "Gemini",
        emoji: "♊",
        blurb: "Witty, adaptable, and always full of stories.",
        endMonth: 6,
        endDay: 20,
    },
    {
        name: "Cancer",
        emoji: "♋",
        blurb: "Warm, protective, and deeply devoted to loved ones.",
        endMonth: 7,
        endDay: 22,
    },
    {
        name: "Leo",
        emoji: "♌",
        blurb: "Confident, generous, and impossible not to notice.",
        endMonth: 8,
        endDay: 22,
    },
    {
        name: "Virgo",
        emoji: "♍",
        blurb: "Thoughtful, precise, and always looking out for others.",
        endMonth: 9,
        endDay: 22,
    },
    {
        name: "Libra",
        emoji: "♎",
        blurb: "Charming, fair-minded, and a natural peacemaker.",
        endMonth: 10,
        endDay: 22,
    },
    {
        name: "Scorpio",
        emoji: "♏",
        blurb: "Passionate, intuitive, and fiercely loyal.",
        endMonth: 11,
        endDay: 21,
    },
    {
        name: "Sagittarius",
        emoji: "♐",
        blurb: "Adventurous, honest, and always chasing the next horizon.",
        endMonth: 12,
        endDay: 21,
    },
    {
        name: "Capricorn",
        emoji: "♑",
        blurb: "Grounded, disciplined, and quietly ambitious.",
        endMonth: 12,
        endDay: 31,
    },
];

function getZodiac(day: number, month: number) {
    return (
        ZODIAC_SIGNS.find((z) => month < z.endMonth || (month === z.endMonth && day <= z.endDay)) ??
        ZODIAC_SIGNS[0]
    );
}

export default function ZodiacReveal({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { customMessage = "" } = content.zodiacReveal?.[sectionId] ?? {};
    // Borrows the birthday code from the page's dateOfBirth section (a different instance), not
    // this section's own id — falls back to the first dateOfBirth instance found on the page.
    const { correctCode = "" } = Object.values(content.dateOfBirth ?? {})[0] ?? {};

    const zodiac = useMemo(() => {
        const day = Number(correctCode.slice(0, 2));
        const month = Number(correctCode.slice(2, 4));
        if (!day || !month) return ZODIAC_SIGNS[0];
        return getZodiac(day, month);
    }, [correctCode]);

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-indigo-100 via-violet-50 to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">
                    Written in the Stars
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Zodiac Reveal ⭐
                </h2>
                <p className="mt-2 max-w-sm text-sm text-slate-600">{customMessage}</p>
            </div>

            <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl bg-white p-5 text-center shadow-xl sm:p-8">
                <div className="text-5xl sm:text-6xl">{zodiac.emoji}</div>
                <p className="text-2xl font-bold text-slate-800">{zodiac.name}</p>
                <p className="text-sm text-slate-600">{zodiac.blurb}</p>
            </div>

            <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-linear-to-r from-violet-500 to-(--theme-primary) px-6 py-2.5 font-semibold text-white shadow-lg transition active:scale-95"
            >
                Next ▶
            </button>
        </section>
    );
}
