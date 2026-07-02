"use client";

import { useRef, useState } from "react";
import { uploadImageAction } from "./actions";

const inputClass =
  "h-11 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white";
const labelClass = "mb-1 block text-sm font-medium text-rose-700";

export default function ImageUrlField({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadImageAction(formData);

    setIsUploading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    if (inputRef.current) inputRef.current.value = result.url;
    setPreview(result.url);
  };

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          className={inputClass}
          name={name}
          defaultValue={defaultValue}
          onChange={(e) => setPreview(e.target.value)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="shrink-0 rounded-2xl border border-rose-200 bg-white px-4 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
        >
          {isUploading ? "กำลังอัปโหลด..." : "อัปโหลด"}
        </button>
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
      {error && <p className="mt-1 text-xs font-medium text-rose-500">{error}</p>}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="mt-2 h-20 w-20 rounded-lg object-cover" />
      )}
    </div>
  );
}
