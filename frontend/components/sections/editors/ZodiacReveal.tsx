"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function ZodiacRevealEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Zodiac Reveal</h2>
                <Field label="Intro message">
                    <Input
                        name={`zodiacReveal.${sectionId}.customMessage`}
                        defaultValue={content.zodiacReveal?.[sectionId]?.customMessage ?? ""}
                    />
                </Field>
                <p className="mt-2 text-xs text-rose-900/50">
                    Zodiac sign is calculated from the Birthday Code section&apos;s date
                </p>
            </div>
        </div>
    );
}
