"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/Toast";
import {
    SECTION_TYPES,
    SECTION_LABELS,
    SectionInstance,
    SectionType,
    HbdContent,
    ImgCardItem,
} from "@/components/sections/utils/content-types";
import ImageUrlField from "./ImageUrlField";
import VideoUrlField from "./VideoUrlField";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import { SortableList } from "@/components/SortableList";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Eye, EyeSlash, Trash } from "@/icons/icons";

const panelClass = "rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-xl";

const NO_CONFIG_TYPES: SectionType[] = [
    "popTheBalloon",
    "memoryMatching",
    "catchTheGift",
    "heartCollector",
    "findTheHiddenGift",
    "whackAMoleBirthday",
    "cinematicCat",
    "cinematicDog",
];

const SCRATCH_CARD_TYPES: SectionType[] = [
    "scratchCard",
    "scratchCardYoutube",
    "scratchCardVdo",
    "scratchCardImg",
];

const LEGACY_TYPES: SectionType[] = ["scratchCardYoutube", "scratchCardVdo", "scratchCardImg"];

export default function SectionEditor({
    slug,
    content,
    error,
    savedAt,
    isPending,
}: {
    slug: string;
    content: HbdContent;
    error: string | null;
    savedAt: number | null;
    isPending: boolean;
}) {
    const [sections, setSections] = useState<SectionInstance[]>(content.sections);
    const [selectedId, setSelectedId] = useState<string | null>(content.sections[0]?.id ?? null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newSectionName, setNewSectionName] = useState("");
    const [newSectionType, setNewSectionType] = useState<SectionType | "">("");
    const [scratchRevealType, setScratchRevealType] = useState<"youtube" | "video" | "image">(
        content.scratchCard.revealType ?? "youtube"
    );
    const [youtubeUrl, setYoutubeUrl] = useState(content.scratchCard.youtubeUrl ?? "");
    const [cakeWishTextAlign, setCakeWishTextAlign] = useState<"left" | "center">(
        content.cake.wishTextAlign ?? "center"
    );
    const [messageAlign, setMessageAlign] = useState<"left" | "center">(
        content.typingText.messageAlign ?? "left"
    );
    const [scratchWidth, setScratchWidth] = useState(content.scratchCard.userWidth ?? 436);
    const [scratchAspectRatio, setScratchAspectRatio] = useState(content.scratchCard.aspectRatio ?? "16:9");
    const [videoSrc, setVideoSrc] = useState(content.scratchCard.videoSrc ?? "");
    const [imageSrc, setImageSrc] = useState(content.scratchCard.imageSrc ?? "");

    type ImgCardState = ImgCardItem & { id: string };
    const [imgCards, setImgCards] = useState<ImgCardState[]>(
        content.birthGift.imgCards.map((c, i) => ({ ...c, id: String(i) }))
    );

    const addImgCard = () =>
        setImgCards((prev) => [
            ...prev,
            { id: crypto.randomUUID(), imgPath: "", caption: "", rotateAngle: 0 },
        ]);

    const removeImgCard = (id: string) =>
        setImgCards((prev) => prev.filter((c) => c.id !== id));

    const updateImgCard = (id: string, patch: Partial<ImgCardItem>) =>
        setImgCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

    type ToastState = { key: number; message: string; variant: "success" | "error" } | null;
    const [toast, setToast] = useState<ToastState>(null);
    const toastKeyRef = useRef(0);

    useEffect(() => {
        if (savedAt) {
            setToast({ key: ++toastKeyRef.current, message: "Saved successfully", variant: "success" });
        }
    }, [savedAt]);

    useEffect(() => {
        if (error) {
            setToast({ key: ++toastKeyRef.current, message: error, variant: "error" });
        }
    }, [error]);

    const selected = sections.find((s) => s.id === selectedId) ?? null;
    const usedTypes = new Set(sections.map((s) => s.type));
    const hasScratchCard = SCRATCH_CARD_TYPES.some((t) => usedTypes.has(t));
    const availableTypes = SECTION_TYPES.filter(
        (t) =>
            !usedTypes.has(t) &&
            !LEGACY_TYPES.includes(t) &&
            !(t === "scratchCard" && hasScratchCard)
    );

    const toggleEnabled = (id: string) => {
        setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
    };

    const remove = (id: string) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const openAddModal = () => {
        setNewSectionName("");
        setNewSectionType("");
        setIsAddModalOpen(true);
    };

    const confirmAddSection = () => {
        if (!newSectionType || !newSectionName.trim()) return;
        const trimmedName = newSectionName.trim();
        const newSection: SectionInstance = {
            id: crypto.randomUUID(),
            type: newSectionType,
            enabled: true,
            ...(trimmedName ? { label: trimmedName } : {}),
        };
        setSections((prev) => [...prev, newSection]);
        setSelectedId(newSection.id);
        setIsAddModalOpen(false);
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-rose-100 bg-white/90 px-5 py-3 shadow-lg">
                <h1 className="text-lg font-semibold text-rose-700">
                    <span className="text-rose-400">[{slug}]</span>{" "}
                    <span className="text-rose-300">/</span>{" "}
                    {selected ? selected.label || SECTION_LABELS[selected.type] : "Select a section"}
                </h1>
                <div className="flex items-center gap-2">
                    <a
                        href={`/${slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                    >
                        Preview
                    </a>
                    <Button type="submit" loading={isPending}>
                        Save
                    </Button>
                </div>
            </div>

            {toast && (
                <Toast
                    key={toast.key}
                    message={toast.message}
                    variant={toast.variant}
                    onDismiss={() => setToast(null)}
                />
            )}

            <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1">
                    <div className={selected?.type === "birthGift" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Gift Box
                            </h2>
                            <Field label="Surprise text">
                                <Input
                                    name="birthGift.surpriseText"
                                    defaultValue={content.birthGift.surpriseText}
                                />
                            </Field>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <SortableList
                                    items={imgCards}
                                    onReorder={setImgCards}
                                    getItemId={(card) => card.id}
                                    grid
                                >
                                    {(card, i, dragHandle) => (
                                        <div className="flex flex-col gap-3 rounded-xl border border-rose-100 p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    {dragHandle}
                                                    <span className="text-sm font-medium text-rose-700">Photo {i + 1}</span>
                                                </div>
                                                {imgCards.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeImgCard(card.id)}
                                                    >
                                                        <Trash />
                                                    </Button>
                                                )}
                                            </div>
                                            <ImageUrlField
                                                slug={slug}
                                                defaultValue={card.imgPath}
                                                onValueChange={(url) => updateImgCard(card.id, { imgPath: url })}
                                                rotateAngle={card.rotateAngle}
                                            />
                                            <Field label="Caption">
                                                <Input
                                                    value={card.caption}
                                                    onChange={(e) => updateImgCard(card.id, { caption: e.target.value })}
                                                />
                                            </Field>
                                            <div>
                                                <div className="mb-1.5 flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Tilt angle</span>
                                                    <span className="text-sm font-semibold tabular-nums text-rose-600">
                                                        {card.rotateAngle > 0 ? "+" : ""}{card.rotateAngle}°
                                                    </span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="-15"
                                                    max="15"
                                                    step="1"
                                                    value={card.rotateAngle}
                                                    onChange={(e) => updateImgCard(card.id, { rotateAngle: Number(e.target.value) })}
                                                    className="w-full accent-rose-500"
                                                />
                                                <div className="flex justify-between text-[10px] text-gray-400">
                                                    <span>-15°</span>
                                                    <span>0°</span>
                                                    <span>+15°</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </SortableList>
                            </div>
                            <Button type="button" variant="secondary" onClick={addImgCard} className="mt-3 w-full">
                                + Add Photo
                            </Button>
                        </div>
                    </div>

                    <div className={selected?.type === "cake" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Cake</h2>
                            <Field label="Wish text (รองรับหลายบรรทัด)">
                                <Textarea
                                    name="cake.wishText"
                                    defaultValue={content.cake.wishText}
                                    rows={4}
                                    resize
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Text alignment">
                                    <SegmentedControl
                                        options={[
                                            { value: "center", label: "Center" },
                                            { value: "left", label: "Left" },
                                        ]}
                                        value={cakeWishTextAlign}
                                        onChange={(v) => setCakeWishTextAlign(v as "left" | "center")}
                                        fullWidth
                                    />
                                    <input type="hidden" name="cake.wishTextAlign" value={cakeWishTextAlign} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "typingText" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Typing Text
                            </h2>
                            <Field label="Message (newlines supported)">
                                <Textarea
                                    rows={4}
                                    name="typingText.message"
                                    defaultValue={content.typingText.message}
                                    resize
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Text alignment">
                                    <SegmentedControl
                                        options={[
                                            { value: "left", label: "Left" },
                                            { value: "center", label: "Center" },
                                        ]}
                                        value={messageAlign}
                                        onChange={(v) => setMessageAlign(v as "left" | "center")}
                                        fullWidth
                                    />
                                    <input type="hidden" name="typingText.messageAlign" value={messageAlign} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "dateOfBirth" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Birthday Code
                            </h2>
                            <Field label="6-digit code (DDMMYY)">
                                <Input
                                    name="dateOfBirth.correctCode"
                                    defaultValue={content.dateOfBirth.correctCode}
                                    maxLength={6}
                                    pattern="\d{6}"
                                />
                            </Field>
                        </div>
                    </div>

                    <div className={selected?.type === "releaseBalloon" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Balloon Wishes
                            </h2>
                            <Field label="Wishes (one per line)">
                                <Textarea
                                    rows={6}
                                    name="releaseBalloon.wishes"
                                    defaultValue={content.releaseBalloon.wishes.join("\n")}
                                    resize
                                />
                            </Field>
                        </div>
                    </div>

                    <div className={selected?.type === "flipPhotoCard" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Flip Photo Card
                            </h2>
                            <div className="flex flex-col gap-4">
                                <div className="rounded-xl border border-rose-100 p-3">
                                    <p className="mb-2 text-sm font-medium text-rose-700">🐶 Dog card</p>
                                    <Field label="Emoji (แสดงใหญ่เมื่อพลิกการ์ด)">
                                        <Input
                                            name="flipPhotoCard.dogEmoji"
                                            defaultValue={content.flipPhotoCard.dogEmoji}
                                            placeholder="เช่น 🐶 🎸 🌟"
                                        />
                                    </Field>
                                    <div className="mt-2">
                                        <ImageUrlField
                                            slug={slug}
                                            name="flipPhotoCard.dogImg"
                                            defaultValue={content.flipPhotoCard.dogImg}
                                            label="หรือ รูปภาพ (ใช้เมื่อไม่ได้ใส่ emoji)"
                                            compact
                                        />
                                    </div>
                                </div>
                                <div className="rounded-xl border border-rose-100 p-3">
                                    <p className="mb-2 text-sm font-medium text-rose-700">🐱 Cat card</p>
                                    <Field label="Emoji (แสดงใหญ่เมื่อพลิกการ์ด)">
                                        <Input
                                            name="flipPhotoCard.catEmoji"
                                            defaultValue={content.flipPhotoCard.catEmoji}
                                            placeholder="เช่น 🐱 🎀 💖"
                                        />
                                    </Field>
                                    <div className="mt-2">
                                        <ImageUrlField
                                            slug={slug}
                                            name="flipPhotoCard.catImg"
                                            defaultValue={content.flipPhotoCard.catImg}
                                            label="หรือ รูปภาพ (ใช้เมื่อไม่ได้ใส่ emoji)"
                                            compact
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "slideInIcon" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Slide-In Icon
                            </h2>
                            <Field label="Title">
                                <Input
                                    name="slideInIcon.title"
                                    defaultValue={content.slideInIcon.title}
                                />
                            </Field>
                        </div>
                    </div>

                    <div className={selected?.type === "cinematicBirthdayBear" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Birthday Bear Scene
                            </h2>
                            <Field label="Title">
                                <Input
                                    name="cinematicBirthdayBear.title"
                                    defaultValue={content.cinematicBirthdayBear.title}
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Subtitle">
                                    <Input
                                        name="cinematicBirthdayBear.subtitle"
                                        defaultValue={content.cinematicBirthdayBear.subtitle}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            selected && SCRATCH_CARD_TYPES.includes(selected.type) ? "" : "hidden"
                        }
                    >
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Scratch Card Settings
                            </h2>

                            {selected?.type === "scratchCard" && (
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
                                        name="scratchCard.revealType"
                                        value={scratchRevealType}
                                    />
                                </div>
                            )}

                            {(selected?.type === "scratchCard"
                                ? scratchRevealType === "youtube"
                                : selected?.type === "scratchCardYoutube") && (
                                <div className="mb-5">
                                    <Field label="YouTube embed URL">
                                        <Input
                                            name="scratchCard.youtubeUrl"
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                        />
                                    </Field>
                                </div>
                            )}

                            {(selected?.type === "scratchCard"
                                ? scratchRevealType === "video"
                                : selected?.type === "scratchCardVdo") && (
                                <div className="mb-5">
                                    <VideoUrlField
                                        slug={slug}
                                        name="scratchCard.videoSrc"
                                        defaultValue={content.scratchCard.videoSrc ?? ""}
                                        label="Video file"
                                        onValueChange={setVideoSrc}
                                    />
                                    <div className="mt-3">
                                        <Field label="Max video width (px)">
                                            <Input
                                                type="number"
                                                name="scratchCard.maxVdoWidth"
                                                defaultValue={content.scratchCard.maxVdoWidth}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            )}

                            {(selected?.type === "scratchCard"
                                ? scratchRevealType === "image"
                                : selected?.type === "scratchCardImg") && (
                                <div className="mb-5">
                                    <ImageUrlField
                                        slug={slug}
                                        name="scratchCard.imageSrc"
                                        defaultValue={content.scratchCard.imageSrc}
                                        label="Reveal image"
                                        onValueChange={setImageSrc}
                                    />
                                </div>
                            )}

                            <div className="mb-4 flex flex-col gap-3">
                                <Field label="Heading text">
                                    <Input
                                        name="scratchCard.headingText"
                                        defaultValue={content.scratchCard.headingText}
                                        placeholder="Try scratching the card!"
                                    />
                                </Field>
                                <Field label="Sub text">
                                    <Input
                                        name="scratchCard.subText"
                                        defaultValue={content.scratchCard.subText}
                                        placeholder="Something is hidden inside..."
                                    />
                                </Field>
                                <Field label="Revealed text">
                                    <Input
                                        name="scratchCard.revealedText"
                                        defaultValue={content.scratchCard.revealedText}
                                        placeholder="There's more to see 💌"
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Field label="Max width (px)">
                                    <Input
                                        type="number"
                                        name="scratchCard.userWidth"
                                        value={scratchWidth}
                                        onChange={(e) => setScratchWidth(Number(e.target.value) || 0)}
                                    />
                                </Field>
                                <Field label="Aspect ratio">
                                    <Select
                                        name="scratchCard.aspectRatio"
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
                                        name="scratchCard.brushRadius"
                                        defaultValue={content.scratchCard.brushRadius}
                                    />
                                </Field>
                                <Field label="% to reveal">
                                    <Input
                                        type="number"
                                        name="scratchCard.revealThreshold"
                                        defaultValue={content.scratchCard.revealThreshold}
                                    />
                                </Field>
                            </div>
                            {(() => {
                                const [aw, ah] = scratchAspectRatio.split(":").map(Number);
                                const actualHeight = scratchWidth > 0 ? Math.round(scratchWidth * ah / aw) : 0;
                                const revealType =
                                    selected?.type === "scratchCard"
                                        ? scratchRevealType
                                        : selected?.type === "scratchCardYoutube"
                                        ? "youtube"
                                        : selected?.type === "scratchCardVdo"
                                        ? "video"
                                        : "image";
                                return (
                                    <div className="mt-4 space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-rose-700">Size Preview</p>
                                            <p className="text-xs text-gray-400">{scratchWidth} × {actualHeight} px · {scratchAspectRatio}</p>
                                        </div>
                                        <div
                                            className="relative w-full overflow-hidden rounded-xl border border-rose-100 bg-black"
                                            style={{ aspectRatio: `${aw}/${ah}` }}
                                        >
                                            {revealType === "youtube" && (
                                                youtubeUrl ? (
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
                                                )
                                            )}
                                            {revealType === "video" && (
                                                videoSrc ? (
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
                                                )
                                            )}
                                            {revealType === "image" && (
                                                imageSrc ? (
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
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    <div
                        className={
                            selected && NO_CONFIG_TYPES.includes(selected.type) ? "" : "hidden"
                        }
                    >
                        <div className={panelClass}>
                            <h2 className="mb-2 text-lg font-semibold text-rose-700">
                                {selected ? selected.label || SECTION_LABELS[selected.type] : ""}
                            </h2>
                            <p className="text-sm text-rose-900/60">
                                This section has no additional settings
                            </p>
                        </div>
                    </div>

                    {!selected && (
                        <div className={panelClass}>
                            <p className="text-sm text-rose-900/60">
                                Select a section from the list to edit
                            </p>
                        </div>
                    )}
                </div>

                <div className="shrink-0 lg:w-72">
                    <div className="rounded-3xl border border-rose-100 bg-white/90 p-4 shadow-xl">
                        <div className="flex flex-col gap-1">
                            {sections.length === 0 && (
                                <p className="px-1 py-2 text-sm text-rose-400">No sections yet</p>
                            )}
                            <SortableList items={sections} onReorder={setSections}>
                                {(section, _index, dragHandle) => (
                                    <div
                                        onClick={() => setSelectedId(section.id)}
                                        className={`flex cursor-pointer items-center gap-1 rounded-xl border px-2 py-2 transition ${
                                            selectedId === section.id
                                                ? "border-rose-400 bg-rose-50"
                                                : "border-transparent hover:bg-rose-50/60"
                                        } ${!section.enabled ? "opacity-40" : ""}`}
                                    >
                                        {dragHandle}
                                        <span className="flex-1 truncate text-sm font-medium text-rose-800">
                                            {section.label || SECTION_LABELS[section.type]}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEnabled(section.id);
                                            }}
                                            title={section.enabled ? "Hide" : "Show"}
                                        >
                                            {section.enabled ? <Eye /> : <EyeSlash />}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                remove(section.id);
                                            }}
                                            title="Delete"
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                )}
                            </SortableList>
                        </div>

                        <div className="mt-3 border-t border-rose-100 pt-3">
                            <Button type="button" onClick={openAddModal} className="w-full">
                                + Add Section
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <input type="hidden" name="imgCards" value={JSON.stringify(imgCards)} />
            <input type="hidden" name="sections" value={JSON.stringify(sections)} />

            <Modal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Section"
                footer={
                    <>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmAddSection}
                            disabled={!newSectionType || !newSectionName.trim()}
                        >
                            Add
                        </Button>
                    </>
                }
            >
                <Field label="Section Name" required>
                    <Input
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        placeholder="e.g. Birthday gift"
                    />
                </Field>
                <Field label="Section Type" required>
                    <Select
                        value={newSectionType}
                        onChange={(e) => setNewSectionType(e.target.value as SectionType | "")}
                        options={[
                            { value: "", label: "-- Select type --" },
                            ...availableTypes.map((type) => ({
                                value: type,
                                label: SECTION_LABELS[type],
                            })),
                        ]}
                    />
                </Field>
            </Modal>
        </div>
    );
}
