"use client";

import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { panelClass, SectionEditorProps } from "./_shared";

export default function GiftBoxUnwrapEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Unwrap the Gift Box</h2>
                <ImageUrlField
                    slug={slug}
                    name={`giftBoxUnwrap.${sectionId}.imgPath`}
                    defaultValue={content.giftBoxUnwrap?.[sectionId]?.imgPath ?? ""}
                    label="Reveal image"
                />
                <div className="mt-3">
                    <Field label="Message">
                        <Input
                            name={`giftBoxUnwrap.${sectionId}.message`}
                            defaultValue={content.giftBoxUnwrap?.[sectionId]?.message ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
