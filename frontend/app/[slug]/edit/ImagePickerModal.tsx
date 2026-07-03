"use client";

import { useEffect, useRef, useState } from "react";
import { listUploadedImagesAction } from "./actions";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

type ImageItem = { url: string; name: string };
type UploadItem = { id: string; name: string; progress: number };

export default function ImagePickerModal({
    slug,
    open,
    onClose,
    onSelect,
}: {
    slug: string;
    open: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        setSelected(null);
        setError(null);
        setIsLoading(true);
        listUploadedImagesAction(slug).then((result) => {
            setIsLoading(false);
            if ("error" in result) { setError(result.error); return; }
            setImages(result.images);
        });
    }, [open, slug]);

    const handleFiles = (files: File[]) => {
        setError(null);
        for (const file of files) {
            const id = Math.random().toString(36).slice(2);
            setUploads((prev) => [...prev, { id, name: file.name, progress: 0 }]);

            const formData = new FormData();
            formData.append("file", file);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", `/api/upload-image/${slug}`);

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    setUploads((prev) =>
                        prev.map((u) => u.id === id ? { ...u, progress: Math.round((e.loaded / e.total) * 100) } : u)
                    );
                }
            });

            xhr.addEventListener("load", () => {
                setUploads((prev) => prev.filter((u) => u.id !== id));
                try {
                    const result = JSON.parse(xhr.responseText) as { url: string } | { error: string };
                    if ("error" in result) { setError(result.error); return; }
                    setImages((prev) => [{ url: result.url, name: file.name }, ...prev]);
                    setSelected(result.url);
                } catch {
                    setError("Upload failed, please try again");
                }
            });

            xhr.addEventListener("error", () => {
                setUploads((prev) => prev.filter((u) => u.id !== id));
                setError("Upload failed, please try again");
            });

            xhr.send(formData);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Select Image"
            size="xl"
            footer={
                <div className="flex w-full justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="button" disabled={!selected} onClick={() => { if (selected) onSelect(selected); }}>
                        Select
                    </Button>
                </div>
            }
        >
            <div
                className={`relative flex min-h-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 text-sm text-gray-400 transition-colors ${
                    isDragging ? "border-rose-400 bg-rose-50" : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
                    if (files.length) handleFiles(files);
                }}
            >
                {uploads.length > 0 ? (
                    <div className="w-full space-y-2">
                        {uploads.map((u) => (
                            <div key={u.id}>
                                <div className="mb-0.5 flex items-center justify-between text-xs text-rose-600">
                                    <span className="truncate font-medium">{u.name}</span>
                                    <span className="ml-2 shrink-0">{u.progress}%</span>
                                </div>
                                <div className="overflow-hidden rounded-full bg-rose-100">
                                    <div
                                        className="h-1.5 rounded-full bg-rose-400 transition-all duration-200"
                                        style={{ width: `${u.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        <p className="pt-1 text-center text-xs text-gray-400">Click or drop more files to queue</p>
                    </div>
                ) : (
                    "Click or drag image files here"
                )}
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length) handleFiles(files);
                        e.target.value = "";
                    }}
                />
            </div>

            {error && <p className="text-xs font-medium text-rose-500">{error}</p>}

            <div className="grid max-h-96 grid-cols-4 gap-3 overflow-y-auto">
                {isLoading && (
                    <p className="col-span-4 py-6 text-center text-sm text-gray-400">Loading...</p>
                )}
                {!isLoading && images.length === 0 && (
                    <p className="col-span-4 py-6 text-center text-sm text-gray-400">No uploaded files yet</p>
                )}
                {images.map((image) => (
                    <button
                        type="button"
                        key={image.url}
                        onClick={() => setSelected(image.url)}
                        className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
                            selected === image.url ? "border-primary" : "border-transparent"
                        }`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-1.5 py-1 text-[10px] text-white">
                            {image.name}
                        </span>
                    </button>
                ))}
            </div>
        </Modal>
    );
}
