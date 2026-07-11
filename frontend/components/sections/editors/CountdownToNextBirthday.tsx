"use client";

import { useEffect, useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { panelClass, SectionEditorProps } from "./_shared";

const pad = (n: number) => String(n).padStart(2, "0");

export default function CountdownToNextBirthdayEditor({
    content,
    hidden,
    sectionId,
}: SectionEditorProps) {
    const saved = content.countdownToNextBirthday?.[sectionId];
    const [dateStr, setDateStr] = useState("");

    // Default to today for a brand-new section (set in an effect so the server
    // and first client render agree — avoids a hydration mismatch on new Date()).
    useEffect(() => {
        if (saved?.birthdayYear && saved?.birthdayMonth && saved?.birthdayDay) {
            setDateStr(
                `${saved.birthdayYear}-${pad(saved.birthdayMonth)}-${pad(saved.birthdayDay)}`
            );
        } else {
            const t = new Date();
            setDateStr(`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [yyyy, mm, dd] = dateStr.split("-");
    const year = Number(yyyy) || saved?.birthdayYear || new Date().getFullYear();
    const month = Number(mm) || saved?.birthdayMonth || 12;
    const day = Number(dd) || saved?.birthdayDay || 18;

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Countdown to Next Birthday
                </h2>
                <Field label="วันที่นับถอยหลัง (รวมปี)">
                    <Input
                        type="date"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                    />
                </Field>
                {/* Data model stays year + month + day, derived from the picked date. */}
                <input
                    type="hidden"
                    name={`countdownToNextBirthday.${sectionId}.birthdayYear`}
                    value={year}
                />
                <input
                    type="hidden"
                    name={`countdownToNextBirthday.${sectionId}.birthdayMonth`}
                    value={month}
                />
                <input
                    type="hidden"
                    name={`countdownToNextBirthday.${sectionId}.birthdayDay`}
                    value={day}
                />
                <div className="mt-3">
                    <Field label="Message">
                        <Textarea
                            name={`countdownToNextBirthday.${sectionId}.message`}
                            defaultValue={saved?.message ?? ""}
                            rows={3}
                            resize
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
