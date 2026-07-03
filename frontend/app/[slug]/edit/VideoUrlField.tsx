"use client";

import { useState } from "react";
import VideoPickerModal from "./VideoPickerModal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function VideoUrlField({
    slug,
    name,
    defaultValue,
    label,
    onValueChange,
}: {
    slug: string;
    name?: string;
    defaultValue: string;
    label?: string;
    onValueChange?: (url: string) => void;
}) {
    const [value, setValue] = useState(defaultValue ?? "");
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const content = (
        <>
            <div className="flex gap-2">
                <Input
                    name={name}
                    value={value}
                    readOnly
                    onChange={() => {}}
                    className="cursor-default bg-gray-50 text-gray-500"
                />
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsPickerOpen(true)}
                    className="shrink-0"
                >
                    Select File
                </Button>
            </div>
            {value && (
                <video
                    key={value}
                    src={value}
                    controls
                    className="mt-2 max-h-85.5 w-full rounded-lg bg-black"
                />
            )}
            <VideoPickerModal
                slug={slug}
                open={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(url) => {
                    setValue(url);
                    onValueChange?.(url);
                    setIsPickerOpen(false);
                }}
            />
        </>
    );

    return label ? <Field label={label}>{content}</Field> : <div>{content}</div>;
}
