"use client";

import { useRef, useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { SortableList } from "@/components/SortableList";
import { MemoryTimelineItem } from "@/components/sections/utils/content-types";
import { panelClass, SectionEditorProps } from "./_shared";
import { Trash } from "@/icons/icons";

const ASPECT_OPTIONS = [
    { value: "1:1", label: "1:1 — Square" },
    { value: "3:4", label: "3:4 — Portrait" },
    { value: "4:3", label: "4:3 — Classic" },
    { value: "9:16", label: "9:16 — Tall" },
    { value: "16:9", label: "16:9 — Landscape" },
];

// ImageUrlField keeps its own internal value state, so rows need keys that
// stay stable across removals — index keys would leak state between rows.
type EditableItem = MemoryTimelineItem & { key: string };

export default function MemoryTimelineEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const initialItems = content.memoryTimeline?.[sectionId]?.items ?? [];
    const [items, setItems] = useState<EditableItem[]>(() =>
        initialItems.map((item, i) => ({
            ...item,
            aspectRatio: item.aspectRatio || "4:3",
            key: `item-${i}`,
        }))
    );
    const nextKeyRef = useRef(initialItems.length);

    const updateItem = (key: string, field: keyof MemoryTimelineItem, value: string) => {
        setItems((prev) =>
            prev.map((item) => (item.key === key ? { ...item, [field]: value } : item))
        );
    };

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                key: `item-${nextKeyRef.current++}`,
                year: "",
                imgPath: "",
                caption: "",
                aspectRatio: "4:3",
            },
        ]);
    };

    const removeItem = (key: string) => {
        setItems((prev) => prev.filter((item) => item.key !== key));
    };

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Memory Timeline
                </h2>
                <div className="flex flex-col gap-3">
                    {items.length === 0 && (
                        <p className="text-sm text-(--theme-primary-dark)/50">
                            No timeline items yet
                        </p>
                    )}
                    <SortableList items={items} onReorder={setItems} getItemId={(item) => item.key}>
                        {(item, _i, dragHandle) => (
                            <div className="flex flex-col gap-2 rounded-xl border border-(--theme-border) p-3 sm:flex-row sm:items-start">
                                <div className="flex items-center pt-6 sm:pt-6">{dragHandle}</div>
                                <div className="sm:w-24">
                                    <Field label="Year">
                                        <Input
                                            value={item.year}
                                            onChange={(e) =>
                                                updateItem(item.key, "year", e.target.value)
                                            }
                                            placeholder="2024"
                                        />
                                    </Field>
                                </div>
                                <div className="sm:w-64">
                                    <ImageUrlField
                                        key={`${item.key}-${item.aspectRatio}`}
                                        slug={slug}
                                        defaultValue={item.imgPath}
                                        label="Photo"
                                        aspectRatio={item.aspectRatio}
                                        onValueChange={(url) =>
                                            updateItem(item.key, "imgPath", url)
                                        }
                                    />
                                    <div className="mt-2">
                                        <Field label="Ratio">
                                            <Select
                                                value={item.aspectRatio}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.key,
                                                        "aspectRatio",
                                                        e.target.value
                                                    )
                                                }
                                                options={ASPECT_OPTIONS}
                                            />
                                        </Field>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <Field label="Caption">
                                        <Input
                                            value={item.caption}
                                            onChange={(e) =>
                                                updateItem(item.key, "caption", e.target.value)
                                            }
                                            placeholder="e.g. Our first trip together"
                                        />
                                    </Field>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="mt-6 shrink-0"
                                    onClick={() => removeItem(item.key)}
                                    title="Remove"
                                >
                                    <Trash />
                                </Button>
                            </div>
                        )}
                    </SortableList>
                </div>
                <Button type="button" onClick={addItem} className="mt-3 w-full">
                    + Add Timeline Item
                </Button>
                <input
                    type="hidden"
                    name={`memoryTimeline.${sectionId}.itemsJson`}
                    value={JSON.stringify(items.map(({ key: _key, ...item }) => item))}
                />
            </div>
        </div>
    );
}
