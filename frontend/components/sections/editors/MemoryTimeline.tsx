"use client";

import { Field } from "@/components/Field";
import { Textarea } from "@/components/Textarea";
import { panelClass, SectionEditorProps } from "./_shared";

export default function MemoryTimelineEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">Memory Timeline</h2>
                <Field label="Timeline items (JSON)">
                    <Textarea
                        rows={10}
                        name={`memoryTimeline.${sectionId}.itemsJson`}
                        defaultValue={JSON.stringify(
                            content.memoryTimeline?.[sectionId]?.items ?? [],
                            null,
                            2
                        )}
                        resize
                    />
                </Field>
                <p className="mt-2 text-xs text-(--theme-primary-dark)/50">
                    Array of {"{ year, imgPath, caption }"}
                </p>
            </div>
        </div>
    );
}
