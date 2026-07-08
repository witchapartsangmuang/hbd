"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { SectionEditorProps, panelClass } from "./_shared";

export default function ReleaseBalloonEditor({ content, hidden, sectionId }: SectionEditorProps) {
    const [balloonWishes, setBalloonWishes] = useState(
        (content.releaseBalloon?.[sectionId]?.wishes ?? []).join("\n")
    );
    const [balloonCount, setBalloonCount] = useState(
        content.releaseBalloon?.[sectionId]?.balloonCount ?? 5
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Balloon Wishes
                </h2>
                <Field label="Wishes (one per line)">
                    <Textarea
                        rows={6}
                        name={`releaseBalloon.${sectionId}.wishes`}
                        value={balloonWishes}
                        onChange={(e) => setBalloonWishes(e.target.value)}
                        resize
                    />
                </Field>
                <Field label="Number of balloons (1-10)">
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        name={`releaseBalloon.${sectionId}.balloonCount`}
                        value={balloonCount}
                        onChange={(e) =>
                            setBalloonCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
                        }
                    />
                </Field>
            </div>
        </div>
    );
}
