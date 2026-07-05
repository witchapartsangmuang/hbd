"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { panelClass, SectionEditorProps } from "./_shared";

export default function CountdownToNextBirthdayEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Countdown to Next Birthday
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Birthday month (1-12)">
                        <Input
                            type="number"
                            name={`countdownToNextBirthday.${sectionId}.birthdayMonth`}
                            defaultValue={
                                content.countdownToNextBirthday?.[sectionId]?.birthdayMonth ?? 12
                            }
                            min={1}
                            max={12}
                        />
                    </Field>
                    <Field label="Birthday day">
                        <Input
                            type="number"
                            name={`countdownToNextBirthday.${sectionId}.birthdayDay`}
                            defaultValue={
                                content.countdownToNextBirthday?.[sectionId]?.birthdayDay ?? 18
                            }
                            min={1}
                            max={31}
                        />
                    </Field>
                </div>
                <div className="mt-3">
                    <Field label="Message">
                        <Input
                            name={`countdownToNextBirthday.${sectionId}.message`}
                            defaultValue={content.countdownToNextBirthday?.[sectionId]?.message ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
