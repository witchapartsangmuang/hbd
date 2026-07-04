"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function DigitalSignatureEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Sign the Card</h2>
                <Field label="Prompt text">
                    <Input
                        name={`digitalSignature.${sectionId}.promptText`}
                        defaultValue={content.digitalSignature?.[sectionId]?.promptText ?? ""}
                    />
                </Field>
            </div>
        </div>
    );
}
