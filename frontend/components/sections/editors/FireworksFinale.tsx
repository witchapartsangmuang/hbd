"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function FireworksFinaleEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Fireworks Finale</h2>
                <Field label="Closing message">
                    <Input
                        name={`fireworksFinale.${sectionId}.message`}
                        defaultValue={content.fireworksFinale?.[sectionId]?.message ?? ""}
                    />
                </Field>
            </div>
        </div>
    );
}
