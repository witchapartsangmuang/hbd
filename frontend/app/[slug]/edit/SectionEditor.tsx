"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/Toast";
import {
    SECTION_TYPES,
    SECTION_LABELS,
    SectionInstance,
    SectionType,
    HbdContent,
} from "@/components/sections/utils/content-types";
import { THEME_PRESETS } from "@/components/sections/utils/theme";
import { SECTION_EDITOR_REGISTRY } from "@/components/sections/_section_editors";
import ScratchCardEditor, { SCRATCH_CARD_TYPES } from "@/components/sections/editors/ScratchCard";
import { panelClass } from "@/components/sections/editors/_shared";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SearchSelect } from "@/components/SearchSelect";
import { SortableList } from "@/components/SortableList";
import { Eye, EyeSlash, Trash } from "@/icons/icons";

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
    const [sections, setSections] = useState<SectionInstance[]>(content.sections ?? []);
    const [themeBaseColor, setThemeBaseColor] = useState(content.theme?.baseColor ?? "#f43f5e");
    const [selectedId, setSelectedId] = useState<string | null>(content.sections?.[0]?.id ?? null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newSectionName, setNewSectionName] = useState("");
    const [newSectionType, setNewSectionType] = useState<SectionType | "">("");

    type ToastState = { key: number; message: string; variant: "success" | "error" } | null;
    const [toast, setToast] = useState<ToastState>(null);
    const toastKeyRef = useRef(0);

    useEffect(() => {
        if (savedAt) {
            setToast({
                key: ++toastKeyRef.current,
                message: "Saved successfully",
                variant: "success",
            });
        }
    }, [savedAt]);

    useEffect(() => {
        if (error) {
            setToast({ key: ++toastKeyRef.current, message: error, variant: "error" });
        }
    }, [error]);

    const selected = sections.find((s) => s.id === selectedId) ?? null;
    const availableTypes = SECTION_TYPES.filter((t) => !LEGACY_TYPES.includes(t));

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
                    {selected
                        ? selected.label || SECTION_LABELS[selected.type]
                        : "Select a section"}
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
                    {sections.map((section) => {
                        const Editor =
                            SECTION_EDITOR_REGISTRY[
                                section.type as keyof typeof SECTION_EDITOR_REGISTRY
                            ];
                        if (!Editor) return null;
                        return (
                            <Editor
                                key={section.id}
                                content={content}
                                slug={slug}
                                sectionId={section.id}
                                hidden={selectedId !== section.id}
                            />
                        );
                    })}

                    {sections
                        .filter((section) => SCRATCH_CARD_TYPES.includes(section.type))
                        .map((section) => (
                            <ScratchCardEditor
                                key={section.id}
                                content={content}
                                slug={slug}
                                sectionId={section.id}
                                hidden={selectedId !== section.id}
                                selectedType={section.type}
                            />
                        ))}

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
                    <SearchSelect
                        value={newSectionType}
                        onChange={(value) => setNewSectionType(value as SectionType | "")}
                        placeholder="-- Select type --"
                        searchPlaceholder="Search section type..."
                        options={availableTypes.map((type) => ({
                            value: type,
                            label: SECTION_LABELS[type],
                        }))}
                    />
                </Field>
            </Modal>
        </div>
    );
}
