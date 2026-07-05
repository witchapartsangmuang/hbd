"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Textarea } from "@/components/Textarea";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SectionEditorProps, panelClass } from "./_shared";

export default function CakeEditor({ content, slug, hidden, sectionId }: SectionEditorProps) {
    const [cakeWishText, setCakeWishText] = useState(content.cake?.[sectionId]?.wishText ?? "");
    const [cakeWishTextAlign, setCakeWishTextAlign] = useState<"left" | "center">(
        content.cake?.[sectionId]?.wishTextAlign ?? "center"
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">Cake</h2>
                <Field label="Wish text (Supports multiple lines)">
                    <Textarea
                        name={`cake.${sectionId}.wishText`}
                        value={cakeWishText}
                        onChange={(e) => setCakeWishText(e.target.value)}
                        rows={4}
                        resize
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Text alignment">
                        <SegmentedControl
                            options={[
                                { value: "center", label: "Center" },
                                { value: "left", label: "Left" },
                            ]}
                            value={cakeWishTextAlign}
                            onChange={(v) => setCakeWishTextAlign(v as "left" | "center")}
                            fullWidth
                        />
                        <input
                            type="hidden"
                            name={`cake.${sectionId}.wishTextAlign`}
                            value={cakeWishTextAlign}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
