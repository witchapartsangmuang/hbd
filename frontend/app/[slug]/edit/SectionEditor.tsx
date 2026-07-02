"use client";

import { useState } from "react";
import {
  SECTION_TYPES,
  SECTION_LABELS,
  SectionInstance,
  SectionType,
  HbdContent,
} from "@/components/sections/utils/content-types";
import ImageUrlField from "./ImageUrlField";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import { SortableList } from "@/components/SortableList";
import { Eye, EyeSlash, Trash } from "@/icons/icons";

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

  const selected = sections.find((s) => s.id === selectedId) ?? null;
  const usedTypes = new Set(sections.map((s) => s.type));
  const availableTypes = SECTION_TYPES.filter((t) => !usedTypes.has(t));

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
            className="flex h-10 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            Preview
          </a>
          <Button type="submit" loading={isPending}>
            Save
          </Button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm font-medium text-rose-500">{error}</p>}
      {!error && savedAt && <p className="mb-4 text-sm font-medium text-emerald-600">บันทึกสำเร็จ ✨</p>}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className={selected?.type === "birthGift" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">กล่องของขวัญ</h2>
              <Field label="ข้อความเซอร์ไพรส์">
                <Input name="birthGift.surpriseText" defaultValue={content.birthGift.surpriseText} />
              </Field>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {content.birthGift.imgCards.map((card, i) => (
                  <div key={i} className="flex flex-col gap-3 rounded-xl border border-rose-100 p-3">
                    <ImageUrlField
                      slug={slug}
                      name={`imgCard.${i}.imgPath`}
                      defaultValue={card.imgPath}
                      label={`รูปที่ ${i + 1}`}
                    />
                    <Field label="คำบรรยาย">
                      <Input name={`imgCard.${i}.caption`} defaultValue={card.caption} />
                    </Field>
                    <Field label="องศาเอียง">
                      <Input type="number" name={`imgCard.${i}.rotateAngle`} defaultValue={card.rotateAngle} />
                    </Field>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={selected?.type === "cake" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">เค้ก</h2>
              <Field label="คำอวยพร">
                <Input name="cake.wishText" defaultValue={content.cake.wishText} />
              </Field>
            </div>
          </div>

          <div className={selected?.type === "typingText" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">ข้อความพิมพ์ดีด</h2>
              <Field label="ข้อความ (ขึ้นบรรทัดใหม่ได้)">
                <Textarea rows={4} name="typingText.message" defaultValue={content.typingText.message} resize />
              </Field>
            </div>
          </div>

          <div className={selected?.type === "dateOfBirth" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">รหัสวันเกิด</h2>
              <Field label="รหัส 6 หลัก (DDMMYY)">
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
              <h2 className="mb-4 text-lg font-semibold text-rose-700">คำอวยพรลูกโป่ง</h2>
              <Field label="คำอวยพร (บรรทัดละ 1 ข้อความ)">
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
              <h2 className="mb-4 text-lg font-semibold text-rose-700">การ์ดพลิกรูป</h2>
              <ImageUrlField
                slug={slug}
                name="flipPhotoCard.dogImg"
                defaultValue={content.flipPhotoCard.dogImg}
                label="รูปหมา"
              />
              <div className="mt-3">
                <ImageUrlField
                  slug={slug}
                  name="flipPhotoCard.catImg"
                  defaultValue={content.flipPhotoCard.catImg}
                  label="รูปแมว"
                />
              </div>
            </div>
          </div>

          <div className={selected?.type === "slideInIcon" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">ไอคอนเลื่อนเข้า</h2>
              <Field label="หัวข้อ">
                <Input name="slideInIcon.title" defaultValue={content.slideInIcon.title} />
              </Field>
            </div>
          </div>

          <div className={selected?.type === "cinematicBirthdayBear" ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-4 text-lg font-semibold text-rose-700">ซีนหมีวันเกิด</h2>
              <Field label="หัวข้อ">
                <Input name="cinematicBirthdayBear.title" defaultValue={content.cinematicBirthdayBear.title} />
              </Field>
              <div className="mt-3">
                <Field label="คำบรรยาย">
                  <Input
                    name="cinematicBirthdayBear.subtitle"
                    defaultValue={content.cinematicBirthdayBear.subtitle}
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className={selected && SCRATCH_CARD_TYPES.includes(selected.type) ? "" : "hidden"}>
            <div className={panelClass}>
              <h2 className="mb-2 text-lg font-semibold text-rose-700">ปรับแต่งการ์ดขูด</h2>
              <p className="mb-4 text-sm text-rose-900/70">
                การตั้งค่านี้ใช้ร่วมกันทั้ง 3 การ์ดขูด (YouTube / วิดีโอ / รูปภาพ)
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field label="ความกว้าง">
                  <Input type="number" name="scratchCard.userWidth" defaultValue={content.scratchCard.userWidth} />
                </Field>
                <Field label="ความสูง">
                  <Input type="number" name="scratchCard.userHeight" defaultValue={content.scratchCard.userHeight} />
                </Field>
                <Field label="ขนาดแปรง">
                  <Input type="number" name="scratchCard.brushRadius" defaultValue={content.scratchCard.brushRadius} />
                </Field>
                <Field label="% ขูดถึงเผย">
                  <Input
                    type="number"
                    name="scratchCard.revealThreshold"
                    defaultValue={content.scratchCard.revealThreshold}
                  />
                </Field>
                <Field label="ความกว้างวิดีโอสูงสุด">
                  <Input type="number" name="scratchCard.maxVdoWidth" defaultValue={content.scratchCard.maxVdoWidth} />
                </Field>
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
              {sections.length === 0 && <p className="px-1 py-2 text-sm text-rose-400">ยังไม่มี section</p>}
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
                      title={section.enabled ? "ซ่อน" : "แสดง"}
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
                      title="ลบ"
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
        title="เพิ่ม Section ใหม่"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="button" onClick={confirmAddSection} disabled={!newSectionType}>
              เพิ่ม
            </Button>
          </>
        }
      >
        <Field label="Section Name">
          <Input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="เช่น ของขวัญวันเกิด"
          />
        </Field>
        <Field label="Section Type" required>
          <Select
            value={newSectionType}
            onChange={(e) => setNewSectionType(e.target.value as SectionType | "")}
            options={[
              { value: "", label: "-- เลือกประเภท --" },
              ...availableTypes.map((type) => ({ value: type, label: SECTION_LABELS[type] })),
            ]}
          />
        </Field>
      </Modal>
    </div>
  );
}
