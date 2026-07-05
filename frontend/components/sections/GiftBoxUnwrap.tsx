"use client";

import { useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";
import { ChevronLeft, ChevronRight } from "@/icons/icons";

export default function GiftBoxUnwrap({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { images = [], message = "" } = content.giftBoxUnwrap?.[sectionId] ?? {};
    const [unwrapped, setUnwrapped] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const showPrev = () => setImageIndex((i) => (i - 1 + images.length) % images.length);
    const showNext = () => setImageIndex((i) => (i + 1) % images.length);
    const current = images[imageIndex];
    const [aw, ah] = (current?.aspectRatio ?? "1:1").split(":").map(Number);

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

            {!unwrapped ? (
                <button
                    type="button"
                    onClick={() => {
                        setUnwrapped(true);
                        nextStep();
                    }}
                    className="group relative flex h-44 w-44 items-center justify-center sm:h-56 sm:w-56 md:h-64 md:w-64"
                    aria-label="Unwrap gift"
                >
                    <div className="absolute h-full w-full rounded-2xl bg-linear-to-br from-(--theme-primary-light) to-(--theme-primary) shadow-2xl transition group-active:scale-95" />
                    <div className="absolute h-full w-6 bg-amber-300" />
                    <div className="absolute h-6 w-full bg-amber-300" />
                    <div className="absolute -top-6 flex h-14 w-20 items-center justify-center rounded-full bg-amber-300 text-3xl shadow-lg">
                        🎀
                    </div>
                    <span className="absolute bottom-6 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-(--theme-primary-dark) shadow">
                        Tap to open
                    </span>
                </button>
            ) : (
                <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-5 shadow-xl sm:p-6">
                    {current && (
                        <div className="relative w-64 sm:w-72">
                            <div
                                className="w-full overflow-hidden rounded-2xl shadow-lg"
                                style={{ aspectRatio: `${aw}/${ah}` }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={current.imgPath}
                                    alt={current.caption || "Gift reveal"}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {current.caption && (
                                <p className="mt-2 text-center text-sm font-medium text-slate-600">
                                    {current.caption}
                                </p>
                            )}
                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={showPrev}
                                        aria-label="Previous image"
                                        className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition active:scale-90"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={showNext}
                                        aria-label="Next image"
                                        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition active:scale-90"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                    <div className="mt-2 flex justify-center gap-1.5">
                                        {images.map((_, i) => (
                                            <span
                                                key={i}
                                                className={`size-1.5 rounded-full transition ${
                                                    i === imageIndex
                                                        ? "bg-(--theme-primary)"
                                                        : "bg-(--theme-border)"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <p className="max-w-xs text-center text-sm font-medium text-slate-700">
                        {message}
                    </p>
                </div>
            )}
        </section>
    );
}
