"use client";

import { useRef, useState } from "react";
import NextStepButton from "@/components/NextStepButton";
import ScrollDownButton from "@/components/ScrollDownButton";
import { HbdContent } from "@/components/sections/utils/content-types";
import { HeartIcon, PlayIcon, PauseIcon, BackwardIcon, ForwardIcon } from "@/icons/icons";

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function BackgroundMusicPlayer({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const {
        audioSrc = "",
        songName = "",
        singerName = "",
        coverImagePath = "",
        startAtSeconds = 0,
    } = content.backgroundMusicPlayer?.[sectionId] ?? {};

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(startAtSeconds);
    const [duration, setDuration] = useState(0);
    const hasSeekedOnPlayRef = useRef(false);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
        } else {
            // Some mobile browsers (notably iOS Safari) silently drop a
            // currentTime set before the first user gesture once playback
            // actually starts, so re-apply it here on the real tap.
            if (!hasSeekedOnPlayRef.current) {
                audio.currentTime = startAtSeconds;
                setCurrentTime(startAtSeconds);
                hasSeekedOnPlayRef.current = true;
            }
            audio.play().catch(() => {});
            nextStep();
            setHasStarted(true);
        }
        setPlaying((p) => !p);
    };

    const seek = (value: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = value;
        setCurrentTime(value);
    };

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-(--theme-soft) p-4 sm:p-6">
            {audioSrc && (
                <audio
                    ref={audioRef}
                    src={audioSrc}
                    onLoadedMetadata={(e) => {
                        const audio = e.currentTarget;
                        audio.currentTime = Math.min(startAtSeconds, audio.duration || 0);
                        setDuration(audio.duration || 0);
                        setCurrentTime(audio.currentTime);
                    }}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onEnded={(e) => {
                        const audio = e.currentTarget;
                        audio.currentTime = startAtSeconds;
                        audio.play().catch(() => {});
                    }}
                />
            )}

            <div className="w-full max-w-72 rounded-3xl bg-slate-900 p-5 shadow-2xl">
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-(--theme-soft)">
                    {coverImagePath ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={coverImagePath} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <p className="px-4 text-center text-lg font-extrabold uppercase tracking-wide text-(--theme-primary-dark)">
                            Music Player
                        </p>
                    )}
                </div>

                <p className="mt-4 truncate text-lg font-semibold text-white">
                    {songName || "Song Name"}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-slate-400">
                        {singerName || "Singer Full Name"}
                    </p>
                    <HeartIcon className="size-4 shrink-0 text-(--theme-primary)" />
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <span className="shrink-0 text-xs text-slate-400">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => seek(Number(e.target.value))}
                        disabled={!audioSrc}
                        className="h-1 flex-1 cursor-pointer accent-(--theme-primary) disabled:cursor-not-allowed"
                    />
                </div>

                <div className="mt-4 flex items-center justify-center gap-6">
                    <BackwardIcon className="size-5 text-slate-600 opacity-60" />
                    <button
                        type="button"
                        onClick={toggle}
                        disabled={!audioSrc}
                        aria-label={playing ? "Pause music" : "Play music"}
                        className="flex size-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition active:scale-95 disabled:opacity-40"
                    >
                        {playing ? (
                            <PauseIcon className="size-5" />
                        ) : (
                            <PlayIcon className="size-5" />
                        )}
                    </button>
                    <ForwardIcon className="size-5 text-slate-600 opacity-60" />
                </div>
            </div>

            {hasStarted && <ScrollDownButton />}

            {!audioSrc && (
                <>
                    <p className="text-sm text-slate-400">No music track has been added yet</p>
                    <NextStepButton
                        nextStep={nextStep}
                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition active:scale-95"
                    />
                </>
            )}
        </section>
    );
}
