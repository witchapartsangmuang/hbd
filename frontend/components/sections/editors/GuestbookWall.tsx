"use client";

import { Field } from "@/components/Field";
import { Textarea } from "@/components/Textarea";
import { SectionEditorProps, panelClass } from "./_shared";

export default function GuestbookWallEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Guestbook Wall</h2>
                <Field label="Wishes (JSON)">
                    <Textarea
                        rows={10}
                        name={`guestbookWall.${sectionId}.wishesJson`}
                        defaultValue={JSON.stringify(
                            content.guestbookWall?.[sectionId]?.wishes ?? [],
                            null,
                            2
                        )}
                        resize
                    />
                </Field>
                <p className="mt-2 text-xs text-rose-900/50">Array of {"{ name, message }"}</p>
            </div>
        </div>
    );
}
