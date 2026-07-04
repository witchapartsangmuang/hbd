"use client";

import { useState } from "react";
import { ImgCardItem } from "@/components/sections/utils/content-types";
import { SectionEditorProps, panelClass } from "./_shared";
import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { SortableList } from "@/components/SortableList";
import { Trash } from "@/icons/icons";

type ImgCardState = ImgCardItem & { id: string };

const blankCard = (): ImgCardItem => ({
    imgPath: "",
    caption: "",
    rotateAngle: 0,
    aspectRatio: "3:4",
});

export default function BirthGiftEditor({ content, slug, hidden, sectionId }: SectionEditorProps) {
    const [surpriseText, setSurpriseText] = useState(
        content.birthGift?.[sectionId]?.surpriseText ?? ""
    );

    const initialCards = content.birthGift?.[sectionId]?.imgCards ?? [];
    const [imgCards, setImgCards] = useState<ImgCardState[]>(
        (initialCards.length > 0 ? initialCards : [blankCard()]).map((c, i) => ({
            ...c,
            id: String(i),
        }))
    );

    const addImgCard = () =>
        setImgCards((prev) => [...prev, { id: crypto.randomUUID(), ...blankCard() }]);

    const removeImgCard = (id: string) => setImgCards((prev) => prev.filter((c) => c.id !== id));

    const updateImgCard = (id: string, patch: Partial<ImgCardItem>) =>
        setImgCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Gift Box</h2>
                <Field label="Surprise text">
                    <Input
                        name={`birthGift.${sectionId}.surpriseText`}
                        value={surpriseText}
                        onChange={(e) => setSurpriseText(e.target.value)}
                    />
                </Field>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <SortableList
                        items={imgCards}
                        onReorder={setImgCards}
                        getItemId={(card) => card.id}
                        grid
                    >
                        {(card, i, dragHandle) => (
                            <div className="flex flex-col gap-3 rounded-xl border border-rose-100 p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {dragHandle}
                                        <span className="text-sm font-medium text-rose-700">
                                            Photo {i + 1}
                                        </span>
                                    </div>
                                    {imgCards.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeImgCard(card.id)}
                                        >
                                            <Trash />
                                        </Button>
                                    )}
                                </div>
                                <ImageUrlField
                                    key={`${card.id}-${card.aspectRatio}-${card.rotateAngle}`}
                                    slug={slug}
                                    defaultValue={card.imgPath}
                                    onValueChange={(url) =>
                                        updateImgCard(card.id, { imgPath: url })
                                    }
                                    rotateAngle={card.rotateAngle}
                                    aspectRatio={card.aspectRatio ?? "3:4"}
                                />
                                <Field label="Caption">
                                    <Input
                                        value={card.caption}
                                        onChange={(e) =>
                                            updateImgCard(card.id, { caption: e.target.value })
                                        }
                                    />
                                </Field>
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Tilt angle</span>
                                        <span className="text-sm font-semibold tabular-nums text-rose-600">
                                            {card.rotateAngle > 0 ? "+" : ""}
                                            {card.rotateAngle}°
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-10"
                                        max="10"
                                        step="1"
                                        value={card.rotateAngle}
                                        onChange={(e) =>
                                            updateImgCard(card.id, {
                                                rotateAngle: Number(e.target.value),
                                            })
                                        }
                                        className="w-full accent-rose-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                        <span>-10°</span>
                                        <span>0°</span>
                                        <span>+10°</span>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <Field label="Aspect ratio">
                                        <Select
                                            value={card.aspectRatio ?? "3:4"}
                                            onChange={(e) =>
                                                updateImgCard(card.id, {
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
                    onClick={addImgCard}
                    className="mt-3 w-full"
                >
                    + Add Photo
                </Button>
            </div>
            <input
                type="hidden"
                name={`birthGift.${sectionId}.imgCards`}
                value={JSON.stringify(imgCards)}
            />
        </div>
    );
}
