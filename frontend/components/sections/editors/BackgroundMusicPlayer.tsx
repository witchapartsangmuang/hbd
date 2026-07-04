"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function BackgroundMusicPlayerEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Background Music</h2>
                <Field label="Audio URL">
                    <Input
                        name={`backgroundMusicPlayer.${sectionId}.audioSrc`}
                        defaultValue={content.backgroundMusicPlayer?.[sectionId]?.audioSrc ?? ""}
                        placeholder="https://.../song.mp3"
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Label">
                        <Input
                            name={`backgroundMusicPlayer.${sectionId}.label`}
                            defaultValue={content.backgroundMusicPlayer?.[sectionId]?.label ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
