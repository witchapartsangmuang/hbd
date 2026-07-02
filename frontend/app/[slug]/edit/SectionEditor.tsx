"use client";

import { useRef, useState } from "react";
import {
  SECTION_TYPES,
  SECTION_LABELS,
  SectionInstance,
  SectionType,
  HbdContent,
} from "@/app/hbd/utils/content-types";
import ImageUrlField from "./ImageUrlField";

const inputClass =
  "h-11 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white";
const textareaClass =
  "w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 outline-none focus:border-rose-400 focus:bg-white";
const labelClass = "mb-1 block text-sm font-medium text-rose-700";
const panelClass = "rounded-[24px] border border-rose-100 bg-white/90 p-6 shadow-xl";

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

const SCRATCH_CARD_TYPES: SectionType[] = ["scratchCardYoutube", "scratchCardVdo", "scratchCardImg"];

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
  const dragIndexRef = useRef<number | null>(null);

  const selected = sections.find((s) => s.id === selectedId) ?? null;
  const usedTypes = new Set(sections.map((s) => s.type));
  const availableTypes = SECTION_TYPES.filter((t) => !usedTypes.has(t));

  const move = (index: number, target: number) => {
    setSections((prev) => {
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  };

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
    if (!newSectionType) return;
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

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDrop = (index: number) => {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === index) return;
    move(from, index);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-rose-100 bg-white/90 px-5 py-3 shadow-lg">
        <h1 className="text-lg font-semibold text-rose-700">
          <span className="text-rose-400">[{slug}]</span>{" "}
          <span className="text-rose-300">/</span>{" "}
          {selected ? selected.label || SECTION_LABELS[selected.type] : "เลือก section"}
        </h1>
        <div className="flex items-center gap-2">
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
          >
            Preview
          </a>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {isPending ? "กำลังบันทึก..." : "Save"}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm font-medium text-rose-500">{error}</p>}
      {!error && savedAt && <p className="mb-4 text-sm font-medium text-emerald-600">บันทึกสำเร็จ ✨</p>}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className={selected?.type === "birthGift" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">กล่องของขวัญ</h2>
              <label className={labelClass}>ข้อความเซอร์ไพรส์</label>
              <input className={inputClass} name="birthGift.surpriseText" defaultValue={content.birthGift.surpriseText} />
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {content.birthGift.imgCards.map((card, i) => (
                  <div key={i} className="rounded-xl border border-rose-100 p-3">
                    <ImageUrlField
                      name={`imgCard.${i}.imgPath`}
                      defaultValue={card.imgPath}
                      label={`รูปที่ ${i + 1}`}
                    />
                    <label className={`${labelClass} mt-2`}>คำบรรยาย</label>
                    <input className={inputClass} name={`imgCard.${i}.caption`} defaultValue={card.caption} />
                    <label className={`${labelClass} mt-2`}>องศาเอียง</label>
                    <input
                      className={inputClass}
                      type="number"
                      name={`imgCard.${i}.rotateAngle`}
                      defaultValue={card.rotateAngle}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={selected?.type === "cake" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">เค้ก</h2>
              <label className={labelClass}>คำอวยพร</label>
              <input className={inputClass} name="cake.wishText" defaultValue={content.cake.wishText} />
            </div>
          </div>

          <div className={selected?.type === "typingText" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">ข้อความพิมพ์ดีด</h2>
              <label className={labelClass}>ข้อความ (ขึ้นบรรทัดใหม่ได้)</label>
              <textarea
                className={textareaClass}
                rows={4}
                name="typingText.message"
                defaultValue={content.typingText.message}
              />
            </div>
          </div>

          <div className={selected?.type === "dateOfBirth" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">รหัสวันเกิด</h2>
              <label className={labelClass}>รหัส 6 หลัก (DDMMYY)</label>
              <input
                className={inputClass}
                name="dateOfBirth.correctCode"
                defaultValue={content.dateOfBirth.correctCode}
                maxLength={6}
                pattern="\d{6}"
              />
            </div>
          </div>

          <div className={selected?.type === "releaseBalloon" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">คำอวยพรลูกโป่ง</h2>
              <label className={labelClass}>คำอวยพร (บรรทัดละ 1 ข้อความ)</label>
              <textarea
                className={textareaClass}
                rows={6}
                name="releaseBalloon.wishes"
                defaultValue={content.releaseBalloon.wishes.join("\n")}
              />
            </div>
          </div>

          <div className={selected?.type === "flipPhotoCard" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">การ์ดพลิกรูป</h2>
              <ImageUrlField name="flipPhotoCard.dogImg" defaultValue={content.flipPhotoCard.dogImg} label="รูปหมา" />
              <div className="mt-3">
                <ImageUrlField name="flipPhotoCard.catImg" defaultValue={content.flipPhotoCard.catImg} label="รูปแมว" />
              </div>
            </div>
          </div>

          <div className={selected?.type === "slideInIcon" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">ไอคอนเลื่อนเข้า</h2>
              <label className={labelClass}>หัวข้อ</label>
              <input className={inputClass} name="slideInIcon.title" defaultValue={content.slideInIcon.title} />
            </div>
          </div>

          <div className={selected?.type === "cinematicBirthdayBear" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">ซีนหมีวันเกิด</h2>
              <label className={labelClass}>หัวข้อ</label>
              <input
                className={inputClass}
                name="cinematicBirthdayBear.title"
                defaultValue={content.cinematicBirthdayBear.title}
              />
              <label className={`${labelClass} mt-3`}>คำบรรยาย</label>
              <input
                className={inputClass}
                name="cinematicBirthdayBear.subtitle"
                defaultValue={content.cinematicBirthdayBear.subtitle}
              />
            </div>
          </div>

          <div className={selected && SCRATCH_CARD_TYPES.includes(selected.type) ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-2 text-lg font-semibold text-rose-700">ปรับแต่งการ์ดขูด</h2>
              <p className="mb-4 text-sm text-rose-900/70">
                การตั้งค่านี้ใช้ร่วมกันทั้ง 3 การ์ดขูด (YouTube / วิดีโอ / รูปภาพ)
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>ความกว้าง</label>
                  <input
                    className={inputClass}
                    type="number"
                    name="scratchCard.userWidth"
                    defaultValue={content.scratchCard.userWidth}
                  />
                </div>
                <div>
                  <label className={labelClass}>ความสูง</label>
                  <input
                    className={inputClass}
                    type="number"
                    name="scratchCard.userHeight"
                    defaultValue={content.scratchCard.userHeight}
                  />
                </div>
                <div>
                  <label className={labelClass}>ขนาดแปรง</label>
                  <input
                    className={inputClass}
                    type="number"
                    name="scratchCard.brushRadius"
                    defaultValue={content.scratchCard.brushRadius}
                  />
                </div>
                <div>
                  <label className={labelClass}>% ขูดถึงเผย</label>
                  <input
                    className={inputClass}
                    type="number"
                    name="scratchCard.revealThreshold"
                    defaultValue={content.scratchCard.revealThreshold}
                  />
                </div>
                <div>
                  <label className={labelClass}>ความกว้างวิดีโอสูงสุด</label>
                  <input
                    className={inputClass}
                    type="number"
                    name="scratchCard.maxVdoWidth"
                    defaultValue={content.scratchCard.maxVdoWidth}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={selected && NO_CONFIG_TYPES.includes(selected.type) ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-2 text-lg font-semibold text-rose-700">
                {selected ? selected.label || SECTION_LABELS[selected.type] : ""}
              </h2>
              <p className="text-sm text-rose-900/60">section นี้ยังไม่มีการตั้งค่าเพิ่มเติม</p>
            </div>
          </div>

          {!selected && (
            <div className={panelClass}>
              <p className="text-sm text-rose-900/60">เลือก section จากรายการด้านขวาเพื่อแก้ไข</p>
            </div>
          )}
        </div>

        <div className="shrink-0 lg:w-72">
          <div className="rounded-[24px] border border-rose-100 bg-white/90 p-4 shadow-xl">
            <div className="flex flex-col gap-1">
              {sections.map((section, i) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  onClick={() => setSelectedId(section.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${
                    selectedId === section.id
                      ? "border-rose-400 bg-rose-50"
                      : "border-transparent hover:bg-rose-50/60"
                  } ${!section.enabled ? "opacity-40" : ""}`}
                >
                  <span className="cursor-grab select-none text-rose-300">⣿</span>
                  <span className="flex-1 truncate text-sm font-medium text-rose-800">
                    {section.label || SECTION_LABELS[section.type]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      move(i, i - 1);
                    }}
                    disabled={i === 0}
                    className="text-rose-300 hover:text-rose-500 disabled:opacity-20"
                    title="ขึ้น"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      move(i, i + 1);
                    }}
                    disabled={i === sections.length - 1}
                    className="text-rose-300 hover:text-rose-500 disabled:opacity-20"
                    title="ลง"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEnabled(section.id);
                    }}
                    className="text-rose-400 hover:text-rose-600"
                    title={section.enabled ? "ซ่อน" : "แสดง"}
                  >
                    {section.enabled ? "👁" : "🚫"}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(section.id);
                    }}
                    className="text-rose-400 hover:text-rose-600"
                    title="ลบ"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {sections.length === 0 && <p className="px-1 py-2 text-sm text-rose-400">ยังไม่มี section</p>}
            </div>

            <div className="mt-3 border-t border-rose-100 pt-3">
              <button
                type="button"
                onClick={openAddModal}
                className="h-10 w-full rounded-xl bg-linear-to-r from-pink-500 to-rose-500 text-sm font-medium text-white shadow"
              >
                + Add Section
              </button>
            </div>
          </div>
        </div>
      </div>

      <input type="hidden" name="sections" value={JSON.stringify(sections)} />

      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold text-rose-700">เพิ่ม Section ใหม่</h2>

            <label className={labelClass}>Section Name</label>
            <input
              className={inputClass}
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="เช่น ของขวัญวันเกิด"
            />

            <label className={`${labelClass} mt-3`}>Section Type</label>
            <select
              value={newSectionType}
              onChange={(e) => setNewSectionType(e.target.value as SectionType | "")}
              className="h-11 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
            >
              <option value="">-- เลือกประเภท --</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {SECTION_LABELS[type]}
                </option>
              ))}
            </select>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={confirmAddSection}
                disabled={!newSectionType}
                className="rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-5 py-2 text-sm font-medium text-white shadow disabled:opacity-50"
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
