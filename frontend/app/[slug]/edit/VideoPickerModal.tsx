"use client";

import { useEffect, useRef, useState } from "react";
import { listUploadedVideosAction, uploadVideoAction } from "./actions";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

type VideoItem = { url: string; name: string };

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
    const [isUploading, setIsUploading] = useState(false);
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

    const handleFile = async (file: File) => {
        setIsUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadVideoAction(slug, formData);
        setIsUploading(false);
        if ("error" in result) {
            setError(result.error);
            return;
        }
        setVideos((prev) => [{ url: result.url, name: file.name }, ...prev]);
        setSelected(result.url);
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
                        onClick={() => { if (selected) onSelect(selected); }}
                    >
                        Select
                    </Button>
                </div>
            }
        >
            <div
                className={`flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed text-sm text-gray-400 transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFile(file);
                }}
            >
                {isUploading ? "Uploading..." : "Click or drag a video file here (mp4, mov, webm)"}
                <input
                    ref={fileRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                        e.target.value = "";
                    }}
                />
            </div>

            {error && <p className="text-xs font-medium text-rose-500">{error}</p>}

            <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
                {isLoading && (
                    <p className="py-6 text-center text-sm text-gray-400">Loading...</p>
                )}
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
