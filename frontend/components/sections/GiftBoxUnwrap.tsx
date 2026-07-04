"use client";

import { useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function GiftBoxUnwrap({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { imgPath = "", message = "" } = content.giftBoxUnwrap?.[sectionId] ?? {};
    const [unwrapped, setUnwrapped] = useState(false);

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-amber-50 p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Birthday Surprise
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Unwrap Your Gift 🎁
                </h2>
            </div>

            <button
                type="button"
                onClick={() => setUnwrapped(true)}
                disabled={unwrapped}
                className="group relative flex h-44 w-44 items-center justify-center sm:h-56 sm:w-56 md:h-64 md:w-64"
                aria-label="Unwrap gift"
            >
                {!unwrapped ? (
                    <>
                        <div className="absolute h-full w-full rounded-2xl bg-linear-to-br from-(--theme-primary-light) to-(--theme-primary) shadow-2xl transition group-active:scale-95" />
                        <div className="absolute h-full w-6 bg-amber-300" />
                        <div className="absolute h-6 w-full bg-amber-300" />
                        <div className="absolute -top-6 flex h-14 w-20 items-center justify-center rounded-full bg-amber-300 text-3xl shadow-lg">
                            🎀
                        </div>
                        <span className="absolute bottom-6 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-(--theme-primary-dark) shadow">
                            Tap to open
                        </span>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-5 shadow-xl sm:p-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imgPath}
                            alt="Gift reveal"
                            className="h-40 w-40 rounded-2xl object-cover shadow-lg"
                        />
                        <p className="max-w-xs text-center text-sm font-medium text-slate-700">
                            {message}
                        </p>
                    </div>
                )}
            </button>

            {unwrapped && (
                <button
                    type="button"
                    onClick={nextStep}
                    className="rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2.5 font-semibold text-white shadow-lg transition active:scale-95"
                >
                    Next ▶
                </button>
            )}
        </section>
    );
}
