"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Textarea } from "@/components/Textarea";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SectionEditorProps, panelClass } from "./_shared";

export default function TypingTextEditor({ content, hidden, sectionId }: SectionEditorProps) {
    const [typingMessage, setTypingMessage] = useState(
        content.typingText?.[sectionId]?.message ?? ""
    );
    const [messageAlign, setMessageAlign] = useState<"left" | "center">(
        content.typingText?.[sectionId]?.messageAlign ?? "left"
    );

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    Typing Text
                </h2>
                <Field label="Message (newlines supported)">
                    <Textarea
                        rows={4}
                        name={`typingText.${sectionId}.message`}
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
                        <input
                            type="hidden"
                            name={`typingText.${sectionId}.messageAlign`}
                            value={messageAlign}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
