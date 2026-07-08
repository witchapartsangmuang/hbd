"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { SectionEditorProps, panelClass } from "./_shared";

export default function PolaroidShakeEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const [polaroidAspectRatio, setPolaroidAspectRatio] = useState(
        content.polaroidShake?.[sectionId]?.aspectRatio ?? "1:1"
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Shake the Polaroid
                </h2>
                <Field label="Eyebrow">
                    <Input
                        name={`polaroidShake.${sectionId}.eyebrow`}
                        defaultValue={content.polaroidShake?.[sectionId]?.eyebrow ?? ""}
                        placeholder="Develop the Memory"
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Heading">
                        <Input
                            name={`polaroidShake.${sectionId}.heading`}
                            defaultValue={content.polaroidShake?.[sectionId]?.heading ?? ""}
                            placeholder="Shake the Polaroid 📸"
                        />
                    </Field>
                </div>
                <div className="mt-3">
                    <ImageUrlField
                        slug={slug}
                        name={`polaroidShake.${sectionId}.imgPath`}
                        defaultValue={content.polaroidShake?.[sectionId]?.imgPath ?? ""}
                        label="Photo"
                        aspectRatio={polaroidAspectRatio}
                    />
                </div>
                <input
                    type="hidden"
                    name={`polaroidShake.${sectionId}.aspectRatio`}
                    value={polaroidAspectRatio}
                />
                <div className="mt-3">
                    <Field label="Aspect ratio">
                        <Select
                            name="_polaroidShake.aspectRatio"
                            value={polaroidAspectRatio}
                            onChange={(e) => setPolaroidAspectRatio(e.target.value)}
                            options={[
                                { value: "1:1", label: "1:1 — Square" },
                                { value: "3:4", label: "3:4 — Portrait" },
                                { value: "4:3", label: "4:3 — Landscape" },
                                { value: "9:16", label: "9:16 — Tall" },
                                { value: "16:9", label: "16:9 — Wide" },
                            ]}
                        />
                    </Field>
                </div>
                <div className="mt-3">
                    <Field label="Caption">
                        <Input
                            name={`polaroidShake.${sectionId}.caption`}
                            defaultValue={content.polaroidShake?.[sectionId]?.caption ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
