"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function CinematicBirthdayBearEditor({
    content,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const [bearTitle, setBearTitle] = useState(
        content.cinematicBirthdayBear?.[sectionId]?.title ?? ""
    );
    const [bearSubtitle, setBearSubtitle] = useState(
        content.cinematicBirthdayBear?.[sectionId]?.subtitle ?? ""
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Birthday Bear Scene
                </h2>
                <Field label="Title">
                    <Input
                        name={`cinematicBirthdayBear.${sectionId}.title`}
                        value={bearTitle}
                        onChange={(e) => setBearTitle(e.target.value)}
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Subtitle">
                        <Input
                            name={`cinematicBirthdayBear.${sectionId}.subtitle`}
                            value={bearSubtitle}
                            onChange={(e) => setBearSubtitle(e.target.value)}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
