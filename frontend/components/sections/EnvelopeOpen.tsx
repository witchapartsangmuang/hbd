"use client";

import { useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function EnvelopeOpen({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { senderName = "", message = "" } = content.envelopeOpen?.[sectionId] ?? {};
    const [opened, setOpened] = useState(false);

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-soft) via-(--theme-softer) to-white p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    A Letter For You
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Open the Envelope 💌
                </h2>
            </div>

            <div className="relative w-full max-w-sm">
                <button
                    type="button"
                    onClick={() => {
                        setOpened(true);
                        nextStep();
                    }}
                    disabled={opened}
                    className="relative block h-48 w-full overflow-visible"
                    aria-label="Open envelope"
                >
                    <div
                        className={`absolute inset-x-0 top-6 z-30 mx-auto w-[92%] rounded-xl bg-white p-5 text-left shadow-xl transition-all duration-700 ${
                            opened ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                    >
                        <p className="text-xs font-semibold uppercase tracking-wide text-(--theme-primary-light)">
                            {senderName}
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                            {message}
                        </p>
                    </div>

                    <div
                        className={`absolute inset-0 transition-all duration-500 ${
                            opened ? "-translate-y-4 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100"
                        }`}
                    >
                        <div className="absolute inset-0 z-10 rounded-xl bg-(--theme-border) shadow-2xl" />
                        <div
                            className="absolute inset-x-0 top-0 z-20 h-1/2 rounded-t-xl bg-(--theme-primary-light) shadow-md"
                            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                        />
                        {!opened && (
                            <span className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-(--theme-primary-dark) shadow">
                                Tap to open
                            </span>
                        )}
                    </div>
                </button>
            </div>
        </section>
    );
}
