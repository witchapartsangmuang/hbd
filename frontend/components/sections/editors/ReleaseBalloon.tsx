"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Textarea } from "@/components/Textarea";
import { SectionEditorProps, panelClass } from "./_shared";

export default function ReleaseBalloonEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const [balloonWishes, setBalloonWishes] = useState(
        (content.releaseBalloon?.[sectionId]?.wishes ?? []).join("\n")
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Balloon Wishes</h2>
                <Field label="Wishes (one per line)">
                    <Textarea
                        rows={6}
                        name={`releaseBalloon.${sectionId}.wishes`}
                        value={balloonWishes}
                        onChange={(e) => setBalloonWishes(e.target.value)}
                        resize
                    />
                </Field>
            </div>
        </div>
    );
}
