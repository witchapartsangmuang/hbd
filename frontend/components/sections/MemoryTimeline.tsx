"use client";

import { HbdContent } from "@/components/sections/utils/content-types";

export default function MemoryTimeline({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { items = [] } = content.memoryTimeline?.[sectionId] ?? {};

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-white p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    A Look Back
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Memory Timeline 🕰️
                </h2>
            </div>

            <div className="relative w-full max-w-xl">
                <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-(--theme-border) sm:block" />
                <div className="flex flex-col gap-4 sm:gap-6">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className={`relative flex flex-col items-center gap-3 rounded-3xl bg-white p-3 shadow-lg sm:flex-row sm:gap-4 sm:p-4 ${
                                i % 2 === 1 ? "sm:flex-row-reverse" : ""
                            }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.imgPath}
                                alt={item.caption}
                                className="h-32 w-full rounded-2xl object-cover sm:h-24 sm:w-32"
                            />
                            <div className="text-center sm:text-left">
                                <p className="text-sm font-bold text-(--theme-primary)">
                                    {item.year}
                                </p>
                                <p className="mt-1 text-sm text-slate-700">{item.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
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
