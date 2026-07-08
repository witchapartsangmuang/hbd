"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SectionEditorProps, panelClass } from "./_shared";

export default function DigitalSignatureEditor({ content, hidden, sectionId }: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Sign the Card
                </h2>
                <div className="flex flex-col gap-4">
                    <Field label="Eyebrow">
                        <Input
                            name={`digitalSignature.${sectionId}.eyebrow`}
                            defaultValue={
                                content.digitalSignature?.[sectionId]?.eyebrow ??
                                "Seal It With Love"
                            }
                        />
                    </Field>
                    <Field label="Heading">
                        <Input
                            name={`digitalSignature.${sectionId}.heading`}
                            defaultValue={
                                content.digitalSignature?.[sectionId]?.heading ?? "Sign the Card ✍️"
                            }
                        />
                    </Field>
                    <Field label="Prompt text">
                        <Input
                            name={`digitalSignature.${sectionId}.promptText`}
                            defaultValue={content.digitalSignature?.[sectionId]?.promptText ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
