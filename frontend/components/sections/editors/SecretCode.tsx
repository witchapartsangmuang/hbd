"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import { SegmentedControl } from "@/components/SegmentedControl";
import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { SectionEditorProps, panelClass } from "./_shared";

export default function SecretCodeEditor({ content, slug, hidden, sectionId }: SectionEditorProps) {
    const [digitCount, setDigitCount] = useState<2 | 4 | 6 | 8>(
        (content.secretCode?.[sectionId]?.digitCount ?? 4) as 2 | 4 | 6 | 8
    );
    const [correctCode, setCorrectCode] = useState(
        content.secretCode?.[sectionId]?.correctCode ?? ""
    );
    const [hint, setHint] = useState(content.secretCode?.[sectionId]?.hint ?? "");
    const [aspectRatio, setAspectRatio] = useState(
        content.secretCode?.[sectionId]?.aspectRatio ?? "3:4"
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Secret Code
                </h2>
                <input
                    type="hidden"
                    name={`secretCode.${sectionId}.digitCount`}
                    value={digitCount}
                />
                <div className="mb-4">
                    <Field label="จำนวนหลัก">
                        <SegmentedControl
                            fullWidth
                            value={String(digitCount)}
                            onChange={(v) => {
                                setDigitCount(Number(v) as 2 | 4 | 6 | 8);
                                setCorrectCode("");
                            }}
                            options={[
                                { value: "2", label: "2 หลัก" },
                                { value: "4", label: "4 หลัก" },
                                { value: "6", label: "6 หลัก" },
                                { value: "8", label: "8 หลัก" },
                            ]}
                        />
                    </Field>
                </div>
                <Field label={`รหัสลับ ${digitCount} หลัก`}>
                    <Input
                        name={`secretCode.${sectionId}.correctCode`}
                        value={correctCode}
                        onChange={(e) =>
                            setCorrectCode(e.target.value.replace(/\D/g, "").slice(0, digitCount))
                        }
                        maxLength={digitCount}
                        pattern={`\\d{${digitCount}}`}
                        placeholder={"0".repeat(digitCount)}
                    />
                </Field>
                <div className="mt-4">
                    <Field label="คำใบ้ (ไม่บังคับ)">
                        <Textarea
                            name={`secretCode.${sectionId}.hint`}
                            value={hint}
                            onChange={(e) => setHint(e.target.value)}
                            rows={3}
                            resize
                            placeholder="เช่น วันเกิดของเรา หรือ เลขที่เราชอบ"
                        />
                    </Field>
                </div>
                <div className="mt-4">
                    <Field label="สัดส่วนการ์ด/รูป (Aspect ratio)">
                        <Select
                            name={`secretCode.${sectionId}.aspectRatio`}
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            options={[
                                { value: "1:1", label: "1:1 — Square" },
                                { value: "3:4", label: "3:4 — Portrait" },
                                { value: "4:3", label: "4:3 — Classic" },
                                { value: "9:16", label: "9:16 — Tall" },
                                { value: "16:9", label: "16:9 — Landscape" },
                            ]}
                        />
                    </Field>
                </div>
                <div className="mt-4">
                    <ImageUrlField
                        key={aspectRatio}
                        slug={slug}
                        name={`secretCode.${sectionId}.revealImage`}
                        defaultValue={content.secretCode?.[sectionId]?.revealImage ?? ""}
                        label="รูปที่จะโชว์หลังเปิดกล่อง (ไม่บังคับ)"
                        aspectRatio={aspectRatio}
                    />
                </div>
            </div>
        </div>
    );
}
