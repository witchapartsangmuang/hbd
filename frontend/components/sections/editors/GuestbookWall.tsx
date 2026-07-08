"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { GuestbookEntry } from "@/components/sections/utils/content-types";
import { SectionEditorProps, panelClass } from "./_shared";
import { Trash } from "@/icons/icons";

export default function GuestbookWallEditor({ content, hidden, sectionId }: SectionEditorProps) {
    const [entries, setEntries] = useState<GuestbookEntry[]>(
        content.guestbookWall?.[sectionId]?.wishes ?? []
    );

    const updateEntry = (index: number, field: keyof GuestbookEntry, value: string) => {
        setEntries((prev) =>
            prev.map((entry, i) => (i === index ? { ...entry, [field]: value } : entry))
        );
    };

    const addEntry = () => {
        setEntries((prev) => [...prev, { name: "", message: "" }]);
    };

    const removeEntry = (index: number) => {
        setEntries((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Guestbook Wall
                </h2>
                <div className="flex flex-col gap-3">
                    {entries.length === 0 && (
                        <p className="text-sm text-(--theme-primary-dark)/50">
                            No guestbook wishes yet
                        </p>
                    )}
                    {entries.map((entry, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-2 rounded-xl border border-(--theme-border) p-3 sm:flex-row sm:items-start"
                        >
                            <div className="sm:w-40">
                                <Field label="Name">
                                    <Input
                                        value={entry.name}
                                        onChange={(e) => updateEntry(index, "name", e.target.value)}
                                        placeholder="e.g. Alice"
                                    />
                                </Field>
                            </div>
                            <div className="flex-1">
                                <Field label="Message">
                                    <Textarea
                                        rows={3}
                                        value={entry.message}
                                        onChange={(e) =>
                                            updateEntry(index, "message", e.target.value)
                                        }
                                        placeholder="e.g. Happy birthday!"
                                        resize
                                    />
                                </Field>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-6 shrink-0"
                                onClick={() => removeEntry(index)}
                                title="Remove"
                            >
                                <Trash />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" onClick={addEntry} className="mt-3 w-full">
                    + Add Wish
                </Button>
                <input
                    type="hidden"
                    name={`guestbookWall.${sectionId}.wishesJson`}
                    value={JSON.stringify(entries)}
                />
            </div>
        </div>
    );
}
