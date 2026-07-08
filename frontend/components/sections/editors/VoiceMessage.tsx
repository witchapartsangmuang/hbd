"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function VoiceMessageEditor({ content, hidden, sectionId }: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Voice Message
                </h2>
                <Field label="Audio URL">
                    <Input
                        name={`voiceMessage.${sectionId}.audioSrc`}
                        defaultValue={content.voiceMessage?.[sectionId]?.audioSrc ?? ""}
                        placeholder="https://.../voice.mp3"
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Message">
                        <Input
                            name={`voiceMessage.${sectionId}.message`}
                            defaultValue={content.voiceMessage?.[sectionId]?.message ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
