"use client";

import { useState } from "react";
import AudioPickerModal from "./AudioPickerModal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function AudioUrlField({
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

    const update = (url: string) => {
        setValue(url);
        onValueChange?.(url);
    };

    const content = (
        <>
            <div className="flex gap-2">
                <Input
                    name={name}
                    value={value}
                    onChange={(e) => update(e.target.value)}
                    placeholder="https://.../song.mp3"
                />
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsPickerOpen(true)}
                    className="shrink-0"
                >
                    Upload File
                </Button>
            </div>
            {value && <audio key={value} src={value} controls className="mt-2 w-full" />}
            <AudioPickerModal
                slug={slug}
                open={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(url) => {
                    update(url);
                    setIsPickerOpen(false);
                }}
            />
        </>
    );

    return label ? <Field label={label}>{content}</Field> : <div>{content}</div>;
}
