"use client";

import { useState } from "react";
import ImagePickerModal from "./ImagePickerModal";
import { Modal } from "@/components/Modal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ImageUrlField({
    slug,
    name,
    defaultValue,
    label,
    onValueChange,
    rotateAngle = 0,
    compact = false,
}: {
    slug: string;
    name?: string;
    defaultValue: string;
    label?: string;
    onValueChange?: (url: string) => void;
    rotateAngle?: number;
    compact?: boolean;
}) {
    const [value, setValue] = useState(defaultValue);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
                    Select Image
                </Button>
            </div>
            {value && (
                compact ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={value}
                        alt=""
                        onClick={() => setIsPreviewOpen(true)}
                        className="mt-2 h-20 w-20 cursor-zoom-in rounded-lg object-cover"
                    />
                ) : (
                    <div
                        onClick={() => setIsPreviewOpen(true)}
                        className="mt-2 cursor-zoom-in overflow-hidden rounded-xl transition-transform"
                        style={{ transform: `rotate(${rotateAngle}deg)` }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={value} alt="" className="max-h-85.5 w-full object-cover" />
                    </div>
                )
            )}
            <ImagePickerModal
                slug={slug}
                open={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(url) => {
                    setValue(url);
                    onValueChange?.(url);
                    setIsPickerOpen(false);
                }}
            />
            <Modal open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value} alt="" className="w-full rounded-lg object-contain" />
            </Modal>
        </>
    );

    return label ? <Field label={label}>{content}</Field> : <div>{content}</div>;
}
