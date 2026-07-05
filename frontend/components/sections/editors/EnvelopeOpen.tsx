"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { panelClass, SectionEditorProps } from "./_shared";

export default function EnvelopeOpenEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">Open the Envelope</h2>
                <Field label="Sender name">
                    <Input
                        name={`envelopeOpen.${sectionId}.senderName`}
                        defaultValue={content.envelopeOpen?.[sectionId]?.senderName ?? ""}
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Message">
                        <Textarea
                            rows={3}
                            name={`envelopeOpen.${sectionId}.message`}
                            defaultValue={content.envelopeOpen?.[sectionId]?.message ?? ""}
                            resize
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
