"use client";

import { useEffect, useRef, useState } from "react";
import { listUploadedImagesAction, uploadImageAction } from "./actions";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

type ImageItem = { url: string; name: string };

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
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setError(null);
    setIsLoading(true);
    listUploadedImagesAction(slug).then((result) => {
      setIsLoading(false);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setImages(result.images);
    });
  }, [open, slug]);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImageAction(slug, formData);

    setIsUploading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setImages((prev) => [{ url: result.url, name: file.name }, ...prev]);
    setSelected(result.url);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="เลือกรูปภาพ"
      size="xl"
      footer={
        <div className="flex w-full justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            type="button"
            disabled={!selected}
            onClick={() => {
              if (selected) onSelect(selected);
            }}
          >
            เลือก
          </Button>
        </div>
      }
    >
      <div
        className={`flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed text-sm text-gray-400 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
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
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        {isUploading ? "กำลังอัปโหลด..." : "คลิกหรือลากไฟล์มาวางที่นี่"}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}

      <div className="grid max-h-96 grid-cols-4 gap-3 overflow-y-auto">
        {isLoading && <p className="col-span-4 py-6 text-center text-sm text-gray-400">กำลังโหลด...</p>}
        {!isLoading && images.length === 0 && (
          <p className="col-span-4 py-6 text-center text-sm text-gray-400">ยังไม่มีไฟล์ที่อัปโหลด</p>
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
