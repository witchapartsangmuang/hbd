"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { SectionEditorProps, panelClass } from "./_shared";

export default function FlipPhotoCardEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const [flipAspectRatio, setFlipAspectRatio] = useState(
        content.flipPhotoCard?.[sectionId]?.aspectRatio ?? "3:4"
    );
    const [dogEmoji, setDogEmoji] = useState(content.flipPhotoCard?.[sectionId]?.dogEmoji ?? "");
    const [dogLabel, setDogLabel] = useState(content.flipPhotoCard?.[sectionId]?.dogLabel ?? "");
    const [catEmoji, setCatEmoji] = useState(content.flipPhotoCard?.[sectionId]?.catEmoji ?? "");
    const [catLabel, setCatLabel] = useState(content.flipPhotoCard?.[sectionId]?.catLabel ?? "");

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Flip Photo Card
                </h2>
                <input
                    type="hidden"
                    name={`flipPhotoCard.${sectionId}.aspectRatio`}
                    value={flipAspectRatio}
                />
                <div className="mb-4">
                    <Field label="Aspect ratio">
                        <Select
                            name="_flipPhotoCard.aspectRatio"
                            value={flipAspectRatio}
                            onChange={(e) => setFlipAspectRatio(e.target.value)}
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
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1 rounded-xl border border-(--theme-border) p-3">
                        <p className="mb-2 text-sm font-medium text-(--theme-primary-dark)">
                            ปุ่มซ้าย
                        </p>
                        <Field label="Emoji บนปุ่ม">
                            <Input
                                name={`flipPhotoCard.${sectionId}.dogEmoji`}
                                value={dogEmoji}
                                onChange={(e) => setDogEmoji(e.target.value)}
                                placeholder="🐶"
                            />
                        </Field>
                        <div className="mt-2">
                            <Field label="ข้อความบนปุ่ม">
                                <Input
                                    name={`flipPhotoCard.${sectionId}.dogLabel`}
                                    value={dogLabel}
                                    onChange={(e) => setDogLabel(e.target.value)}
                                    placeholder="Dog"
                                />
                            </Field>
                        </div>
                        <div className="mt-2">
                            <ImageUrlField
                                slug={slug}
                                name={`flipPhotoCard.${sectionId}.dogImg`}
                                defaultValue={content.flipPhotoCard?.[sectionId]?.dogImg ?? ""}
                                label="รูปภาพที่แสดงเมื่อพลิกการ์ด"
                            />
                        </div>
                    </div>
                    <div className="flex-1 rounded-xl border border-(--theme-border) p-3">
                        <p className="mb-2 text-sm font-medium text-(--theme-primary-dark)">
                            ปุ่มขวา
                        </p>
                        <Field label="Emoji บนปุ่ม">
                            <Input
                                name={`flipPhotoCard.${sectionId}.catEmoji`}
                                value={catEmoji}
                                onChange={(e) => setCatEmoji(e.target.value)}
                                placeholder="🐱"
                            />
                        </Field>
                        <div className="mt-2">
                            <Field label="ข้อความบนปุ่ม">
                                <Input
                                    name={`flipPhotoCard.${sectionId}.catLabel`}
                                    value={catLabel}
                                    onChange={(e) => setCatLabel(e.target.value)}
                                    placeholder="Cat"
                                />
                            </Field>
                        </div>
                        <div className="mt-2">
                            <ImageUrlField
                                slug={slug}
                                name={`flipPhotoCard.${sectionId}.catImg`}
                                defaultValue={content.flipPhotoCard?.[sectionId]?.catImg ?? ""}
                                label="รูปภาพที่แสดงเมื่อพลิกการ์ด"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
