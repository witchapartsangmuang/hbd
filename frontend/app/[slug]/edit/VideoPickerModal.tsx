"use client";

import { useEffect, useRef, useState } from "react";
import { listUploadedVideosAction } from "./actions";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

type VideoItem = { url: string; name: string };
type UploadItem = { id: string; name: string; progress: number };

export default function VideoPickerModal({
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
    const [videos, setVideos] = useState<VideoItem[]>([]);
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
        listUploadedVideosAction(slug).then((result) => {
            setIsLoading(false);
            if ("error" in result) {
                setError(result.error);
                return;
            }
            setVideos(result.videos);
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
            xhr.open("POST", `/api/upload-video/${slug}`);

            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    setUploads((prev) =>
                        prev.map((u) =>
                            u.id === id
                                ? { ...u, progress: Math.round((e.loaded / e.total) * 100) }
                                : u
                        )
                    );
                }
            });

            xhr.addEventListener("load", () => {
                setUploads((prev) => prev.filter((u) => u.id !== id));
                try {
                    const result = JSON.parse(xhr.responseText) as
                        { url: string } | { error: string };
                    if ("error" in result) {
                        setError(result.error);
                        return;
                    }
                    setVideos((prev) => [{ url: result.url, name: file.name }, ...prev]);
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
            title="Select Video"
            size="xl"
            footer={
                <div className="flex w-full justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        disabled={!selected}
                        onClick={() => {
                            if (selected) onSelect(selected);
                        }}
                    >
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
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = Array.from(e.dataTransfer.files).filter((f) =>
                        f.type.startsWith("video/")
                    );
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
                        <p className="pt-1 text-center text-xs text-gray-400">
                            Click or drop more files to queue
                        </p>
                    </div>
                ) : (
                    "Click or drag video files here (mp4, mov, webm)"
                )}
                <input
                    ref={fileRef}
                    type="file"
                    accept="video/*"
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

            <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
                {isLoading && <p className="py-6 text-center text-sm text-gray-400">Loading...</p>}
                {!isLoading && videos.length === 0 && (
                    <p className="py-6 text-center text-sm text-gray-400">No uploaded videos yet</p>
                )}
                {videos.map((video) => (
                    <button
                        type="button"
                        key={video.url}
                        onClick={() => setSelected(video.url)}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition ${
                            selected === video.url
                                ? "border-rose-400 bg-rose-50 text-rose-700"
                                : "border-transparent hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                        <span className="text-lg">🎬</span>
                        <span className="flex-1 truncate font-medium">{video.name}</span>
                        {selected === video.url && (
                            <span className="shrink-0 text-xs text-rose-500">✓ Selected</span>
                        )}
                    </button>
                ))}
            </div>
        </Modal>
    );
}
