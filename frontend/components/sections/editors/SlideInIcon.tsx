"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function SlideInIconEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const [slideInTitle, setSlideInTitle] = useState(
        content.slideInIcon?.[sectionId]?.title ?? ""
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">Slide-In Icon</h2>
                <Field label="Title">
                    <Input
                        name={`slideInIcon.${sectionId}.title`}
                        value={slideInTitle}
                        onChange={(e) => setSlideInTitle(e.target.value)}
                    />
                </Field>
            </div>
        </div>
    );
}
