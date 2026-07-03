"use client";

import { useRef, useState } from "react";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function BackgroundMusicPlayer({
    nextStep,
    content,
}: {
    nextStep: () => void;
    content: HbdContent;
}) {
    const { audioSrc, label } = content.backgroundMusicPlayer;
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
        } else {
            audio.play().catch(() => {});
        }
        setPlaying((p) => !p);
    };

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-8 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Set The Mood
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">Background Music 🎵</h2>
                <p className="mt-2 max-w-sm text-sm text-slate-600">{label}</p>
            </div>

            {audioSrc ? (
                <>
                    <audio ref={audioRef} src={audioSrc} loop />
                    <button
                        type="button"
                        onClick={toggle}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) text-2xl text-white shadow-2xl transition active:scale-95 sm:h-24 sm:w-24 sm:text-3xl"
                        aria-label={playing ? "Pause music" : "Play music"}
                    >
                        {playing ? "⏸" : "▶"}
                    </button>
                </>
            ) : (
                <p className="text-sm text-slate-400">No music track has been added yet</p>
            )}

            <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition active:scale-95"
            >
                Next ▶
            </button>
        </section>
    );
}
