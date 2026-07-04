"use client";

import { HbdContent } from "@/components/sections/utils/content-types";

const ROTATIONS = [-3, 2, -1, 3, -2, 1];

export default function GuestbookWall({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { wishes = [] } = content.guestbookWall?.[sectionId] ?? {};

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-yellow-50 via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    From The People Who Love You
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Guestbook Wall 💌
                </h2>
            </div>

            <div className="flex w-full max-w-2xl flex-wrap justify-center gap-3 sm:gap-4">
                {wishes.map((entry, i) => (
                    <div
                        key={i}
                        className="w-[45%] min-w-36 rounded-xl bg-amber-100 p-3 shadow-lg sm:w-48 sm:p-4"
                        style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}
                    >
                        <p className="text-sm leading-5 text-slate-700">
                            &ldquo;{entry.message}&rdquo;
                        </p>
                        <p className="mt-2 text-right text-xs font-semibold text-(--theme-primary)">
                            — {entry.name}
                        </p>
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
