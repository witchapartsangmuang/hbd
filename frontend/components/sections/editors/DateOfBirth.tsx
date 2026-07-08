"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SectionEditorProps, panelClass } from "./_shared";

export default function DateOfBirthEditor({ content, hidden, sectionId }: SectionEditorProps) {
    const [digitCount, setDigitCount] = useState<4 | 6 | 8>(
        (content.dateOfBirth?.[sectionId]?.digitCount ?? 6) as 4 | 6 | 8
    );
    const [correctCode, setCorrectCode] = useState(
        content.dateOfBirth?.[sectionId]?.correctCode ?? ""
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Birthday Code
                </h2>
                <input
                    type="hidden"
                    name={`dateOfBirth.${sectionId}.digitCount`}
                    value={digitCount}
                />
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
                <Field
                    label={`รหัส ${digitCount} หลัก (${digitCount === 4 ? "DDMM" : digitCount === 8 ? "DDMMYYYY" : "DDMMYY"})`}
                >
                    <Input
                        name={`dateOfBirth.${sectionId}.correctCode`}
                        value={correctCode}
                        onChange={(e) =>
                            setCorrectCode(e.target.value.replace(/\D/g, "").slice(0, digitCount))
                        }
                        maxLength={digitCount}
                        pattern={`\\d{${digitCount}}`}
                        placeholder={
                            digitCount === 4
                                ? "เช่น 1812"
                                : digitCount === 8
                                  ? "เช่น 18121999"
                                  : "เช่น 181299"
                        }
                    />
                </Field>
            </div>
        </div>
    );
}
