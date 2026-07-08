"use client";

import { Field } from "@/components/Field";
import { Textarea } from "@/components/Textarea";
import { panelClass, SectionEditorProps } from "./_shared";

export default function SpinTheWheelEditor({ content, hidden, sectionId }: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Spin the Wheel
                </h2>
                <Field label="Prizes (one per line)">
                    <Textarea
                        rows={6}
                        name={`spinTheWheel.${sectionId}.prizes`}
                        defaultValue={(content.spinTheWheel?.[sectionId]?.prizes ?? []).join("\n")}
                        resize
                    />
                </Field>
            </div>
        </div>
    );
}
