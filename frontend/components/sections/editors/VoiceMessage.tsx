"use client";

import { HbdContent } from "@/components/sections/utils/content-types";

export default function VoiceMessage({
    nextStep,
    content,
}: {
    nextStep: () => void;
    content: HbdContent;
}) {
    const { audioSrc, message } = content.voiceMessage;

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-softer) via-(--theme-soft) to-(--theme-border) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    A Message For You
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">Voice Message 🎙️</h2>
                <p className="mt-2 max-w-sm text-sm text-slate-600">{message}</p>
            </div>

            <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-white p-4 shadow-xl sm:p-6">
                <div className="text-4xl">💌</div>
                {audioSrc ? (
                    <audio controls src={audioSrc} className="w-full" />
                ) : (
                    <p className="text-sm text-slate-400">No voice message has been added yet</p>
                )}
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
