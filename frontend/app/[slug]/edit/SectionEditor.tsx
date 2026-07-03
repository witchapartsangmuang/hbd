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
import { THEME_PRESETS } from "@/components/sections/utils/theme";
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
    const [themeBaseColor, setThemeBaseColor] = useState(content.theme.baseColor);
    const [selectedId, setSelectedId] = useState<string | null>(content.sections[0]?.id ?? null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newSectionName, setNewSectionName] = useState("");
    const [newSectionType, setNewSectionType] = useState<SectionType | "">("");

    // birthGift
    const [surpriseText, setSurpriseText] = useState(content.birthGift.surpriseText);

    // cake
    const [cakeWishText, setCakeWishText] = useState(content.cake.wishText);
    const [cakeWishTextAlign, setCakeWishTextAlign] = useState<"left" | "center">(
        content.cake.wishTextAlign ?? "center"
    );

    // typingText
    const [typingMessage, setTypingMessage] = useState(content.typingText.message);
    const [messageAlign, setMessageAlign] = useState<"left" | "center">(
        content.typingText.messageAlign ?? "left"
    );

    // dateOfBirth
    const [digitCount, setDigitCount] = useState<4 | 6 | 8>(
        (content.dateOfBirth.digitCount ?? 6) as 4 | 6 | 8
    );
    const [correctCode, setCorrectCode] = useState(content.dateOfBirth.correctCode);

    // releaseBalloon
    const [balloonWishes, setBalloonWishes] = useState(
        content.releaseBalloon.wishes.join("\n")
    );

    // flipPhotoCard
    const [flipAspectRatio, setFlipAspectRatio] = useState(
        content.flipPhotoCard.aspectRatio ?? "3:4"
    );
    const [dogEmoji, setDogEmoji] = useState(content.flipPhotoCard.dogEmoji);
    const [dogLabel, setDogLabel] = useState(content.flipPhotoCard.dogLabel);
    const [catEmoji, setCatEmoji] = useState(content.flipPhotoCard.catEmoji);
    const [catLabel, setCatLabel] = useState(content.flipPhotoCard.catLabel);

    // slideInIcon
    const [slideInTitle, setSlideInTitle] = useState(content.slideInIcon.title);

    // cinematicBirthdayBear
    const [bearTitle, setBearTitle] = useState(content.cinematicBirthdayBear.title);
    const [bearSubtitle, setBearSubtitle] = useState(content.cinematicBirthdayBear.subtitle);

    // scratchCard
    const [scratchRevealType, setScratchRevealType] = useState<"youtube" | "video" | "image">(
        content.scratchCard.revealType ?? "youtube"
    );
    const [scratchAspectRatio, setScratchAspectRatio] = useState(
        content.scratchCard.aspectRatio ?? "16:9"
    );
    const [youtubeUrl, setYoutubeUrl] = useState(content.scratchCard.youtubeUrl ?? "");
    const [videoSrc, setVideoSrc] = useState(content.scratchCard.videoSrc ?? "");
    const [imageSrc, setImageSrc] = useState(content.scratchCard.imageSrc ?? "");
    const [headingText, setHeadingText] = useState(content.scratchCard.headingText);
    const [subText, setSubText] = useState(content.scratchCard.subText);
    const [revealedText, setRevealedText] = useState(content.scratchCard.revealedText);
    const [brushRadius, setBrushRadius] = useState(String(content.scratchCard.brushRadius));
    const [revealThreshold, setRevealThreshold] = useState(
        String(content.scratchCard.revealThreshold)
    );

    // imgCards
    type ImgCardState = ImgCardItem & { id: string };
    const [imgCards, setImgCards] = useState<ImgCardState[]>(
        content.birthGift.imgCards.map((c, i) => ({ ...c, id: String(i) }))
    );

    const addImgCard = () =>
        setImgCards((prev) => [
            ...prev,
            { id: crypto.randomUUID(), imgPath: "", caption: "", rotateAngle: 0, aspectRatio: "3:4" },
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
        if (newSectionType === "birthGift") {
            setImgCards([{ id: crypto.randomUUID(), imgPath: "", caption: "", rotateAngle: 0, aspectRatio: "3:4" }]);
        }
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

            <div className="mb-4 rounded-[20px] border border-rose-100 bg-white/90 px-5 py-4 shadow-lg">
                <p className="mb-3 text-sm font-semibold text-rose-700">Page theme</p>
                <div className="flex flex-wrap items-center gap-3">
                    {THEME_PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => setThemeBaseColor(preset.baseColor)}
                            title={preset.label}
                            className={`h-9 w-9 rounded-full border-2 transition ${
                                themeBaseColor.toLowerCase() === preset.baseColor.toLowerCase()
                                    ? "border-rose-500 scale-110"
                                    : "border-white shadow ring-1 ring-gray-200"
                            }`}
                            style={{ backgroundColor: preset.baseColor }}
                        />
                    ))}
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={themeBaseColor}
                            onChange={(e) => setThemeBaseColor(e.target.value)}
                            className="h-9 w-9 cursor-pointer rounded-full border border-gray-200 bg-transparent p-0"
                            title="Custom color"
                        />
                        <span className="text-xs text-gray-500">Custom</span>
                    </div>
                </div>
                <input type="hidden" name="theme.baseColor" value={themeBaseColor} />
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1">
                    {/* Gift Box */}
                    <div className={selected?.type === "birthGift" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Gift Box</h2>
                            <Field label="Surprise text">
                                <Input
                                    name="birthGift.surpriseText"
                                    value={surpriseText}
                                    onChange={(e) => setSurpriseText(e.target.value)}
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
                                                key={`${card.id}-${card.aspectRatio}-${card.rotateAngle}`}
                                                slug={slug}
                                                defaultValue={card.imgPath}
                                                onValueChange={(url) => updateImgCard(card.id, { imgPath: url })}
                                                rotateAngle={card.rotateAngle}
                                                aspectRatio={card.aspectRatio ?? "3:4"}
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
                                                    min="-10"
                                                    max="10"
                                                    step="1"
                                                    value={card.rotateAngle}
                                                    onChange={(e) => updateImgCard(card.id, { rotateAngle: Number(e.target.value) })}
                                                    className="w-full accent-rose-500"
                                                />
                                                <div className="flex justify-between text-[10px] text-gray-400">
                                                    <span>-10°</span>
                                                    <span>0°</span>
                                                    <span>+10°</span>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <Field label="Aspect ratio">
                                                    <Select
                                                        value={card.aspectRatio ?? "3:4"}
                                                        onChange={(e) => updateImgCard(card.id, { aspectRatio: e.target.value })}
                                                        options={[
                                                            { value: "1:1", label: "1:1 — Square" },
                                                            { value: "3:4", label: "3:4 — Portrait" },
                                                            { value: "4:3", label: "4:3 — Classic" },
                                                            { value: "9:16", label: "9:16 — Tall" },
                                                            { value: "16:9", label: "16:9 — Landscape" },
                                                        ]}
                                                    />
                                                </Field>
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

                    {/* Cake */}
                    <div className={selected?.type === "cake" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Cake</h2>
                            <Field label="Wish text (Supports multiple lines)">
                                <Textarea
                                    name="cake.wishText"
                                    value={cakeWishText}
                                    onChange={(e) => setCakeWishText(e.target.value)}
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

                    {/* Typing Text */}
                    <div className={selected?.type === "typingText" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Typing Text</h2>
                            <Field label="Message (newlines supported)">
                                <Textarea
                                    rows={4}
                                    name="typingText.message"
                                    value={typingMessage}
                                    onChange={(e) => setTypingMessage(e.target.value)}
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

                    {/* Birthday Code */}
                    <div className={selected?.type === "dateOfBirth" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Birthday Code</h2>
                            <input type="hidden" name="dateOfBirth.digitCount" value={digitCount} />
                            <div className="mb-4">
                                <Field label="จำนวนหลัก">
                                    <SegmentedControl
                                        fullWidth
                                        value={String(digitCount)}
                                        onChange={(v) => {
                                            setDigitCount(Number(v) as 4 | 6 | 8);
                                            setCorrectCode("");
                                        }}
                                        options={[
                                            { value: "4", label: "4 หลัก (DDMM)" },
                                            { value: "6", label: "6 หลัก (DDMMYY)" },
                                            { value: "8", label: "8 หลัก (DDMMYYYY)" },
                                        ]}
                                    />
                                </Field>
                            </div>
                            <Field label={`รหัส ${digitCount} หลัก (${digitCount === 4 ? "DDMM" : digitCount === 8 ? "DDMMYYYY" : "DDMMYY"})`}>
                                <Input
                                    name="dateOfBirth.correctCode"
                                    value={correctCode}
                                    onChange={(e) =>
                                        setCorrectCode(e.target.value.replace(/\D/g, "").slice(0, digitCount))
                                    }
                                    maxLength={digitCount}
                                    pattern={`\\d{${digitCount}}`}
                                    placeholder={digitCount === 4 ? "เช่น 1812" : digitCount === 8 ? "เช่น 18121999" : "เช่น 181299"}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Release Balloon */}
                    <div className={selected?.type === "releaseBalloon" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Balloon Wishes</h2>
                            <Field label="Wishes (one per line)">
                                <Textarea
                                    rows={6}
                                    name="releaseBalloon.wishes"
                                    value={balloonWishes}
                                    onChange={(e) => setBalloonWishes(e.target.value)}
                                    resize
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Flip Photo Card */}
                    <div className={selected?.type === "flipPhotoCard" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Flip Photo Card</h2>
                            <input type="hidden" name="flipPhotoCard.aspectRatio" value={flipAspectRatio} />
                            <div className="mb-4">
                                <Field label="Aspect ratio">
                                    <Select
                                        name="_flipPhotoCard.aspectRatio"
                                        value={flipAspectRatio}
                                        onChange={(e) => setFlipAspectRatio(e.target.value)}
                                        options={[
                                            { value: "1:1", label: "1:1 — Square" },
                                            { value: "3:4", label: "3:4 — Portrait" },
                                            { value: "4:3", label: "4:3 — Landscape" },
                                            { value: "9:16", label: "9:16 — Tall" },
                                            { value: "16:9", label: "16:9 — Wide" },
                                        ]}
                                    />
                                </Field>
                            </div>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex-1 rounded-xl border border-rose-100 p-3">
                                    <p className="mb-2 text-sm font-medium text-rose-700">ปุ่มซ้าย</p>
                                    <Field label="Emoji บนปุ่ม">
                                        <Input
                                            name="flipPhotoCard.dogEmoji"
                                            value={dogEmoji}
                                            onChange={(e) => setDogEmoji(e.target.value)}
                                            placeholder="🐶"
                                        />
                                    </Field>
                                    <div className="mt-2">
                                        <Field label="ข้อความบนปุ่ม">
                                            <Input
                                                name="flipPhotoCard.dogLabel"
                                                value={dogLabel}
                                                onChange={(e) => setDogLabel(e.target.value)}
                                                placeholder="Dog"
                                            />
                                        </Field>
                                    </div>
                                    <div className="mt-2">
                                        <ImageUrlField
                                            slug={slug}
                                            name="flipPhotoCard.dogImg"
                                            defaultValue={content.flipPhotoCard.dogImg}
                                            label="รูปภาพที่แสดงเมื่อพลิกการ์ด"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 rounded-xl border border-rose-100 p-3">
                                    <p className="mb-2 text-sm font-medium text-rose-700">ปุ่มขวา</p>
                                    <Field label="Emoji บนปุ่ม">
                                        <Input
                                            name="flipPhotoCard.catEmoji"
                                            value={catEmoji}
                                            onChange={(e) => setCatEmoji(e.target.value)}
                                            placeholder="🐱"
                                        />
                                    </Field>
                                    <div className="mt-2">
                                        <Field label="ข้อความบนปุ่ม">
                                            <Input
                                                name="flipPhotoCard.catLabel"
                                                value={catLabel}
                                                onChange={(e) => setCatLabel(e.target.value)}
                                                placeholder="Cat"
                                            />
                                        </Field>
                                    </div>
                                    <div className="mt-2">
                                        <ImageUrlField
                                            slug={slug}
                                            name="flipPhotoCard.catImg"
                                            defaultValue={content.flipPhotoCard.catImg}
                                            label="รูปภาพที่แสดงเมื่อพลิกการ์ด"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide-In Icon */}
                    <div className={selected?.type === "slideInIcon" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Slide-In Icon</h2>
                            <Field label="Title">
                                <Input
                                    name="slideInIcon.title"
                                    value={slideInTitle}
                                    onChange={(e) => setSlideInTitle(e.target.value)}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* Cinematic Birthday Bear */}
                    <div className={selected?.type === "cinematicBirthdayBear" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Birthday Bear Scene</h2>
                            <Field label="Title">
                                <Input
                                    name="cinematicBirthdayBear.title"
                                    value={bearTitle}
                                    onChange={(e) => setBearTitle(e.target.value)}
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Subtitle">
                                    <Input
                                        name="cinematicBirthdayBear.subtitle"
                                        value={bearSubtitle}
                                        onChange={(e) => setBearSubtitle(e.target.value)}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

<<<<<<< HEAD
                    {/* Scratch Card */}
=======
                    <div className={selected?.type === "spinTheWheel" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Spin the Wheel</h2>
                            <Field label="Prizes (one per line)">
                                <Textarea
                                    rows={6}
                                    name="spinTheWheel.prizes"
                                    defaultValue={content.spinTheWheel.prizes.join("\n")}
                                    resize
                                />
                            </Field>
                        </div>
                    </div>

                    <div className={selected?.type === "jigsawPhotoPuzzle" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Jigsaw Puzzle</h2>
                            <ImageUrlField
                                slug={slug}
                                name="jigsawPhotoPuzzle.imagePath"
                                defaultValue={content.jigsawPhotoPuzzle.imagePath}
                                label="Puzzle image"
                            />
                            <div className="mt-3">
                                <Field label="Grid size (e.g. 3 = 3x3)">
                                    <Input
                                        type="number"
                                        name="jigsawPhotoPuzzle.gridSize"
                                        defaultValue={content.jigsawPhotoPuzzle.gridSize}
                                        min={2}
                                        max={5}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "quizAboutYou" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                How Well Do You Know Me
                            </h2>
                            <Field label="Questions (JSON)">
                                <Textarea
                                    rows={10}
                                    name="quizAboutYou.questionsJson"
                                    defaultValue={JSON.stringify(content.quizAboutYou.questions, null, 2)}
                                    resize
                                />
                            </Field>
                            <p className="mt-2 text-xs text-rose-900/50">
                                Array of {"{ question, options[], correctIndex }"}
                            </p>
                        </div>
                    </div>

                    <div className={selected?.type === "candleBlow" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Blow the Candle</h2>
                            <Field label="Number of candles">
                                <Input
                                    type="number"
                                    name="candleBlow.candleCount"
                                    defaultValue={content.candleBlow.candleCount}
                                    min={1}
                                    max={10}
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Message">
                                    <Input
                                        name="candleBlow.message"
                                        defaultValue={content.candleBlow.message}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "giftBoxUnwrap" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Unwrap the Gift Box
                            </h2>
                            <ImageUrlField
                                slug={slug}
                                name="giftBoxUnwrap.imgPath"
                                defaultValue={content.giftBoxUnwrap.imgPath}
                                label="Reveal image"
                            />
                            <div className="mt-3">
                                <Field label="Message">
                                    <Input
                                        name="giftBoxUnwrap.message"
                                        defaultValue={content.giftBoxUnwrap.message}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "envelopeOpen" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Open the Envelope</h2>
                            <Field label="Sender name">
                                <Input
                                    name="envelopeOpen.senderName"
                                    defaultValue={content.envelopeOpen.senderName}
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Message">
                                    <Textarea
                                        rows={3}
                                        name="envelopeOpen.message"
                                        defaultValue={content.envelopeOpen.message}
                                        resize
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "polaroidShake" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Shake the Polaroid
                            </h2>
                            <ImageUrlField
                                slug={slug}
                                name="polaroidShake.imgPath"
                                defaultValue={content.polaroidShake.imgPath}
                                label="Photo"
                            />
                            <div className="mt-3">
                                <Field label="Caption">
                                    <Input
                                        name="polaroidShake.caption"
                                        defaultValue={content.polaroidShake.caption}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "countdownToNextBirthday" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Countdown to Next Birthday
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Birthday month (1-12)">
                                    <Input
                                        type="number"
                                        name="countdownToNextBirthday.birthdayMonth"
                                        defaultValue={content.countdownToNextBirthday.birthdayMonth}
                                        min={1}
                                        max={12}
                                    />
                                </Field>
                                <Field label="Birthday day">
                                    <Input
                                        type="number"
                                        name="countdownToNextBirthday.birthdayDay"
                                        defaultValue={content.countdownToNextBirthday.birthdayDay}
                                        min={1}
                                        max={31}
                                    />
                                </Field>
                            </div>
                            <div className="mt-3">
                                <Field label="Message">
                                    <Input
                                        name="countdownToNextBirthday.message"
                                        defaultValue={content.countdownToNextBirthday.message}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "memoryTimeline" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Memory Timeline</h2>
                            <Field label="Timeline items (JSON)">
                                <Textarea
                                    rows={10}
                                    name="memoryTimeline.itemsJson"
                                    defaultValue={JSON.stringify(content.memoryTimeline.items, null, 2)}
                                    resize
                                />
                            </Field>
                            <p className="mt-2 text-xs text-rose-900/50">
                                Array of {"{ year, imgPath, caption }"}
                            </p>
                        </div>
                    </div>

                    <div className={selected?.type === "voiceMessage" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Voice Message</h2>
                            <Field label="Audio URL">
                                <Input
                                    name="voiceMessage.audioSrc"
                                    defaultValue={content.voiceMessage.audioSrc}
                                    placeholder="https://.../voice.mp3"
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Message">
                                    <Input
                                        name="voiceMessage.message"
                                        defaultValue={content.voiceMessage.message}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "zodiacReveal" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Zodiac Reveal</h2>
                            <Field label="Intro message">
                                <Input
                                    name="zodiacReveal.customMessage"
                                    defaultValue={content.zodiacReveal.customMessage}
                                />
                            </Field>
                            <p className="mt-2 text-xs text-rose-900/50">
                                Zodiac sign is calculated from the Birthday Code section&apos;s date
                            </p>
                        </div>
                    </div>

                    <div className={selected?.type === "guestbookWall" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Guestbook Wall</h2>
                            <Field label="Wishes (JSON)">
                                <Textarea
                                    rows={10}
                                    name="guestbookWall.wishesJson"
                                    defaultValue={JSON.stringify(content.guestbookWall.wishes, null, 2)}
                                    resize
                                />
                            </Field>
                            <p className="mt-2 text-xs text-rose-900/50">
                                Array of {"{ name, message }"}
                            </p>
                        </div>
                    </div>

                    <div className={selected?.type === "digitalSignature" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">Sign the Card</h2>
                            <Field label="Prompt text">
                                <Input
                                    name="digitalSignature.promptText"
                                    defaultValue={content.digitalSignature.promptText}
                                />
                            </Field>
                        </div>
                    </div>

                    <div className={selected?.type === "backgroundMusicPlayer" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Background Music
                            </h2>
                            <Field label="Audio URL">
                                <Input
                                    name="backgroundMusicPlayer.audioSrc"
                                    defaultValue={content.backgroundMusicPlayer.audioSrc}
                                    placeholder="https://.../song.mp3"
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Label">
                                    <Input
                                        name="backgroundMusicPlayer.label"
                                        defaultValue={content.backgroundMusicPlayer.label}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "cinematicRabbit" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Cinematic Rabbit
                            </h2>
                            <Field label="Title">
                                <Input
                                    name="cinematicRabbit.title"
                                    defaultValue={content.cinematicRabbit.title}
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Subtitle">
                                    <Input
                                        name="cinematicRabbit.subtitle"
                                        defaultValue={content.cinematicRabbit.subtitle}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "cinematicPanda" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Cinematic Panda
                            </h2>
                            <Field label="Title">
                                <Input
                                    name="cinematicPanda.title"
                                    defaultValue={content.cinematicPanda.title}
                                />
                            </Field>
                            <div className="mt-3">
                                <Field label="Subtitle">
                                    <Input
                                        name="cinematicPanda.subtitle"
                                        defaultValue={content.cinematicPanda.subtitle}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className={selected?.type === "fireworksFinale" ? "" : "hidden"}>
                        <div className={panelClass}>
                            <h2 className="mb-4 text-lg font-semibold text-rose-700">
                                Fireworks Finale
                            </h2>
                            <Field label="Closing message">
                                <Input
                                    name="fireworksFinale.message"
                                    defaultValue={content.fireworksFinale.message}
                                />
                            </Field>
                        </div>
                    </div>

>>>>>>> 86186fc85f85b263506d3394eaa423f0576a6c37
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
                                        value={headingText}
                                        onChange={(e) => setHeadingText(e.target.value)}
                                        placeholder="Try scratching the card!"
                                    />
                                </Field>
                                <Field label="Sub text">
                                    <Input
                                        name="scratchCard.subText"
                                        value={subText}
                                        onChange={(e) => setSubText(e.target.value)}
                                        placeholder="Something is hidden inside..."
                                    />
                                </Field>
                                <Field label="Revealed text">
                                    <Input
                                        name="scratchCard.revealedText"
                                        value={revealedText}
                                        onChange={(e) => setRevealedText(e.target.value)}
                                        placeholder="There's more to see 💌"
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                                        value={brushRadius}
                                        onChange={(e) => setBrushRadius(e.target.value)}
                                    />
                                </Field>
                                <Field label="% to reveal">
                                    <Input
                                        type="number"
                                        name="scratchCard.revealThreshold"
                                        value={revealThreshold}
                                        onChange={(e) => setRevealThreshold(e.target.value)}
                                    />
                                </Field>
                            </div>
                            {(() => {
                                const [aw, ah] = scratchAspectRatio.split(":").map(Number);
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
                                            <p className="text-sm font-medium text-rose-700">Content Preview</p>
                                            <p className="text-xs text-gray-400">{scratchAspectRatio}</p>
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

                    {/* No config */}
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
