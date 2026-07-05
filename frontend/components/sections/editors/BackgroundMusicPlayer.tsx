"use client";

import { useState } from "react";
import AudioUrlField from "@/app/[slug]/edit/AudioUrlField";
import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function BackgroundMusicPlayerEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const music = content.backgroundMusicPlayer?.[sectionId];
    const [audioSrc, setAudioSrc] = useState(music?.audioSrc ?? "");
    const [audioDuration, setAudioDuration] = useState<number | null>(null);
    const [startAtSeconds, setStartAtSeconds] = useState(music?.startAtSeconds ?? 0);
    const maxStart = audioDuration ? Math.floor(audioDuration) : undefined;

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Background Music
                </h2>
                <div className="flex flex-col gap-4">
                    <AudioUrlField
                        slug={slug}
                        name={`backgroundMusicPlayer.${sectionId}.audioSrc`}
                        defaultValue={audioSrc}
                        label="Audio file"
                        onValueChange={(url) => {
                            setAudioSrc(url);
                            setAudioDuration(null);
                        }}
                    />
                    {/* Hidden probe just to learn the file's duration so "Start
                        at" can be capped to it — not rendered as a player. */}
                    {audioSrc && (
                        <audio
                            src={audioSrc}
                            className="hidden"
                            onLoadedMetadata={(e) => {
                                const d = e.currentTarget.duration;
                                if (!Number.isFinite(d)) return;
                                setAudioDuration(d);
                                setStartAtSeconds((prev) => Math.min(prev, Math.floor(d)));
                            }}
                        />
                    )}
                    <ImageUrlField
                        slug={slug}
                        name={`backgroundMusicPlayer.${sectionId}.coverImagePath`}
                        defaultValue={music?.coverImagePath ?? ""}
                        label="Cover image (optional)"
                        compact
                    />
                    <Field label="Song name">
                        <Input
                            name={`backgroundMusicPlayer.${sectionId}.songName`}
                            defaultValue={music?.songName ?? ""}
                            placeholder="Song Name"
                        />
                    </Field>
                    <Field label="Singer name">
                        <Input
                            name={`backgroundMusicPlayer.${sectionId}.singerName`}
                            defaultValue={music?.singerName ?? ""}
                            placeholder="Singer Full Name"
                        />
                    </Field>
                    <Field
                        label={
                            maxStart !== undefined
                                ? `Start at (seconds) — up to ${maxStart}s`
                                : "Start at (seconds)"
                        }
                    >
                        <Input
                            type="number"
                            min={0}
                            max={maxStart}
                            name={`backgroundMusicPlayer.${sectionId}.startAtSeconds`}
                            value={startAtSeconds}
                            onChange={(e) => {
                                const raw = Math.max(0, Number(e.target.value) || 0);
                                setStartAtSeconds(maxStart !== undefined ? Math.min(raw, maxStart) : raw);
                            }}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
