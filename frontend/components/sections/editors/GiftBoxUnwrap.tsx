"use client";

import { useState } from "react";
import { GiftBoxImageItem } from "@/components/sections/utils/content-types";
import { SectionEditorProps, panelClass } from "./_shared";
import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { SortableList } from "@/components/SortableList";
import { Trash } from "@/icons/icons";

type GiftBoxImageState = GiftBoxImageItem & { id: string };

const blankImage = (): GiftBoxImageItem => ({
    imgPath: "",
    caption: "",
    aspectRatio: "3:4",
});

export default function GiftBoxUnwrapEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const [message, setMessage] = useState(content.giftBoxUnwrap?.[sectionId]?.message ?? "");

    const initialImages = content.giftBoxUnwrap?.[sectionId]?.images ?? [];
    const [images, setImages] = useState<GiftBoxImageState[]>(
        (initialImages.length > 0 ? initialImages : [blankImage()]).map((img, i) => ({
            ...img,
            id: String(i),
        }))
    );

    const addImage = () =>
        setImages((prev) => [...prev, { id: crypto.randomUUID(), ...blankImage() }]);

    const removeImage = (id: string) => setImages((prev) => prev.filter((img) => img.id !== id));

    const updateImage = (id: string, patch: Partial<GiftBoxImageItem>) =>
        setImages((prev) => prev.map((img) => (img.id === id ? { ...img, ...patch } : img)));

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Unwrap the Gift Box
                </h2>
                <Field label="Message">
                    <Input
                        name={`giftBoxUnwrap.${sectionId}.message`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Field>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SortableList
                        items={images}
                        onReorder={setImages}
                        getItemId={(img) => img.id}
                        grid
                    >
                        {(img, i, dragHandle) => (
                            <div className="flex flex-col gap-3 rounded-xl border border-(--theme-border) p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {dragHandle}
                                        <span className="text-sm font-medium text-(--theme-primary-dark)">
                                            Photo {i + 1}
                                        </span>
                                    </div>
                                    {images.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeImage(img.id)}
                                        >
                                            <Trash />
                                        </Button>
                                    )}
                                </div>
                                <ImageUrlField
                                    key={`${img.id}-${img.aspectRatio}`}
                                    slug={slug}
                                    defaultValue={img.imgPath}
                                    onValueChange={(url) => updateImage(img.id, { imgPath: url })}
                                    aspectRatio={img.aspectRatio ?? "3:4"}
                                />
                                <Field label="Caption">
                                    <Input
                                        value={img.caption}
                                        onChange={(e) =>
                                            updateImage(img.id, { caption: e.target.value })
                                        }
                                    />
                                </Field>
                                <div className="mt-3">
                                    <Field label="Aspect ratio">
                                        <Select
                                            value={img.aspectRatio ?? "3:4"}
                                            onChange={(e) =>
                                                updateImage(img.id, {
                                                    aspectRatio: e.target.value,
                                                })
                                            }
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
                            </div>
                        )}
                    </SortableList>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={addImage}
                    className="mt-3 w-full"
                >
                    + Add Photo
                </Button>
            </div>
            <input
                type="hidden"
                name={`giftBoxUnwrap.${sectionId}.images`}
                value={JSON.stringify(images)}
            />
        </div>
    );
}
