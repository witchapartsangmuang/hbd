"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function CinematicRabbitEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Cinematic Rabbit</h2>
                <Field label="Title">
                    <Input
                        name={`cinematicRabbit.${sectionId}.title`}
                        defaultValue={content.cinematicRabbit?.[sectionId]?.title ?? ""}
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Subtitle">
                        <Input
                            name={`cinematicRabbit.${sectionId}.subtitle`}
                            defaultValue={content.cinematicRabbit?.[sectionId]?.subtitle ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
