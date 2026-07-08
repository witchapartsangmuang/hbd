"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function CinematicPandaEditor({ content, hidden, sectionId }: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Cinematic Panda
                </h2>
                <Field label="Title">
                    <Input
                        name={`cinematicPanda.${sectionId}.title`}
                        defaultValue={content.cinematicPanda?.[sectionId]?.title ?? ""}
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Subtitle">
                        <Input
                            name={`cinematicPanda.${sectionId}.subtitle`}
                            defaultValue={content.cinematicPanda?.[sectionId]?.subtitle ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
