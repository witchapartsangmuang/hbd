"use client";

import { Field } from "@/components/Field";
import { Textarea } from "@/components/Textarea";
import { panelClass, SectionEditorProps } from "./_shared";

export default function QuizAboutYouEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    How Well Do You Know Me
                </h2>
                <Field label="Questions (JSON)">
                    <Textarea
                        rows={10}
                        name={`quizAboutYou.${sectionId}.questionsJson`}
                        defaultValue={JSON.stringify(
                            content.quizAboutYou?.[sectionId]?.questions ?? [],
                            null,
                            2
                        )}
                        resize
                    />
                </Field>
                <p className="mt-2 text-xs text-(--theme-primary-dark)/50">
                    Array of {"{ question, options[], correctIndex }"}
                </p>
            </div>
        </div>
    );
}
