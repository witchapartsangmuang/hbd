"use client";

import { useState } from "react";
import { SectionType } from "@/components/sections/utils/content-types";
import { SectionEditorProps, panelClass } from "./_shared";
import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import VideoUrlField from "@/app/[slug]/edit/VideoUrlField";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { SegmentedControl } from "@/components/SegmentedControl";

export const SCRATCH_CARD_TYPES: SectionType[] = [
    "scratchCard",
    "scratchCardYoutube",
    "scratchCardVdo",
    "scratchCardImg",
];

export default function ScratchCardEditor({
    content,
    slug,
    hidden,
    sectionId,
    selectedType,
}: SectionEditorProps & { selectedType: SectionType | undefined }) {
    const scratchContent = content.scratchCard?.[sectionId];
    const [scratchRevealType, setScratchRevealType] = useState<"youtube" | "video" | "image">(
        scratchContent?.revealType ?? "youtube"
    );
    const [scratchAspectRatio, setScratchAspectRatio] = useState(
        scratchContent?.aspectRatio ?? "16:9"
    );
    const [youtubeUrl, setYoutubeUrl] = useState(scratchContent?.youtubeUrl ?? "");
    const [videoSrc, setVideoSrc] = useState(scratchContent?.videoSrc ?? "");
    const [imageSrc, setImageSrc] = useState(scratchContent?.imageSrc ?? "");
    const [headingText, setHeadingText] = useState(scratchContent?.headingText ?? "");
    const [subText, setSubText] = useState(scratchContent?.subText ?? "");
    const [revealedText, setRevealedText] = useState(scratchContent?.revealedText ?? "");
    const [brushRadius, setBrushRadius] = useState(String(scratchContent?.brushRadius ?? 56));
    const [revealThreshold, setRevealThreshold] = useState(
        String(scratchContent?.revealThreshold ?? 50)
    );

    const [aw, ah] = scratchAspectRatio.split(":").map(Number);
    const revealType =
        selectedType === "scratchCard"
            ? scratchRevealType
            : selectedType === "scratchCardYoutube"
              ? "youtube"
              : selectedType === "scratchCardVdo"
                ? "video"
                : "image";

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Scratch Card Settings</h2>

                {selectedType === "scratchCard" && (
                    <div className="mb-5">
                        <Field label="Reveal type">
                            <SegmentedControl
                                options={[
                                    { value: "youtube", label: "YouTube" },
                                    { value: "video", label: "Video" },
                                    { value: "image", label: "Image" },
                                ]}
                                value={scratchRevealType}
                                onChange={(v) =>
                                    setScratchRevealType(v as "youtube" | "video" | "image")
                                }
                                fullWidth
                            />
                        </Field>
                        <input
                            type="hidden"
                            name={`scratchCard.${sectionId}.revealType`}
                            value={scratchRevealType}
                        />
                    </div>
                )}

                {(selectedType === "scratchCard"
                    ? scratchRevealType === "youtube"
                    : selectedType === "scratchCardYoutube") && (
                    <div className="mb-5">
                        <Field label="YouTube embed URL">
                            <Input
                                name={`scratchCard.${sectionId}.youtubeUrl`}
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                            />
                        </Field>
                    </div>
                )}

                {(selectedType === "scratchCard"
                    ? scratchRevealType === "video"
                    : selectedType === "scratchCardVdo") && (
                    <div className="mb-5">
                        <VideoUrlField
                            slug={slug}
                            name={`scratchCard.${sectionId}.videoSrc`}
                            defaultValue={scratchContent?.videoSrc ?? ""}
                            label="Video file"
                            onValueChange={setVideoSrc}
                        />
                    </div>
                )}

                {(selectedType === "scratchCard"
                    ? scratchRevealType === "image"
                    : selectedType === "scratchCardImg") && (
                    <div className="mb-5">
                        <ImageUrlField
                            slug={slug}
                            name={`scratchCard.${sectionId}.imageSrc`}
                            defaultValue={scratchContent?.imageSrc ?? ""}
                            label="Reveal image"
                            onValueChange={setImageSrc}
                        />
                    </div>
                )}

                <div className="mb-4 flex flex-col gap-3">
                    <Field label="Heading text">
                        <Input
                            name={`scratchCard.${sectionId}.headingText`}
                            value={headingText}
                            onChange={(e) => setHeadingText(e.target.value)}
                            placeholder="Try scratching the card!"
                        />
                    </Field>
                    <Field label="Sub text">
                        <Input
                            name={`scratchCard.${sectionId}.subText`}
                            value={subText}
                            onChange={(e) => setSubText(e.target.value)}
                            placeholder="Something is hidden inside..."
                        />
                    </Field>
                    <Field label="Revealed text">
                        <Input
                            name={`scratchCard.${sectionId}.revealedText`}
                            value={revealedText}
                            onChange={(e) => setRevealedText(e.target.value)}
                            placeholder="There's more to see 💌"
                        />
                    </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Aspect ratio">
                        <Select
                            name={`scratchCard.${sectionId}.aspectRatio`}
                            value={scratchAspectRatio}
                            onChange={(e) => setScratchAspectRatio(e.target.value)}
                            options={[
                                { value: "16:9", label: "16:9 — Landscape" },
                                { value: "4:3", label: "4:3 — Classic" },
                                { value: "1:1", label: "1:1 — Square" },
                                { value: "3:4", label: "3:4 — Portrait" },
                                { value: "9:16", label: "9:16 — Tall" },
                            ]}
                        />
                    </Field>
                    <Field label="Brush size">
                        <Input
                            type="number"
                            name={`scratchCard.${sectionId}.brushRadius`}
                            value={brushRadius}
                            onChange={(e) => setBrushRadius(e.target.value)}
                        />
                    </Field>
                    <Field label="% to reveal">
                        <Input
                            type="number"
                            name={`scratchCard.${sectionId}.revealThreshold`}
                            value={revealThreshold}
                            onChange={(e) => setRevealThreshold(e.target.value)}
                        />
                    </Field>
                </div>
                <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-rose-700">Content Preview</p>
                        <p className="text-xs text-gray-400">{scratchAspectRatio}</p>
                    </div>
                    <div
                        className="relative w-full overflow-hidden rounded-xl border border-rose-100 bg-black"
                        style={{ aspectRatio: `${aw}/${ah}` }}
                    >
                        {revealType === "youtube" &&
                            (youtubeUrl ? (
                                <iframe
                                    src={youtubeUrl}
                                    className="absolute inset-0 h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-pink-50 text-sm text-rose-300">
                                    No URL set
                                </div>
                            ))}
                        {revealType === "video" &&
                            (videoSrc ? (
                                <video
                                    key={videoSrc}
                                    src={videoSrc}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    playsInline
                                    preload="metadata"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-pink-50 text-sm text-rose-300">
                                    No video selected
                                </div>
                            ))}
                        {revealType === "image" &&
                            (imageSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imageSrc}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-pink-50 text-sm text-rose-300">
                                    No image selected
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
