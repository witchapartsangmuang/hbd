"use client";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { QuizQuestion } from "@/components/sections/utils/content-types";
import { panelClass, SectionEditorProps } from "./_shared";
import { Trash } from "@/icons/icons";

export default function QuizAboutYouEditor({ content, hidden, sectionId }: SectionEditorProps) {
    const [questions, setQuestions] = useState<QuizQuestion[]>(
        content.quizAboutYou?.[sectionId]?.questions ?? []
    );

    const updateQuestion = (index: number, value: string) => {
        setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, question: value } : q)));
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === qIndex
                    ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) }
                    : q
            )
        );
    };

    const setCorrect = (qIndex: number, oIndex: number) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === qIndex ? { ...q, correctIndex: oIndex } : q))
        );
    };

    const addOption = (qIndex: number) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ""] } : q))
        );
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        setQuestions((prev) =>
            prev.map((q, i) => {
                if (i !== qIndex) return q;
                const options = q.options.filter((_, j) => j !== oIndex);
                const correctIndex =
                    oIndex === q.correctIndex
                        ? 0
                        : oIndex < q.correctIndex
                          ? q.correctIndex - 1
                          : q.correctIndex;
                return { ...q, options, correctIndex };
            })
        );
    };

    const addQuestion = () => {
        setQuestions((prev) => [...prev, { question: "", options: ["", ""], correctIndex: 0 }]);
    };

    const removeQuestion = (index: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">
                    How Well Do You Know Me
                </h2>
                <div className="flex flex-col gap-3">
                    {questions.length === 0 && (
                        <p className="text-sm text-(--theme-primary-dark)/50">No questions yet</p>
                    )}
                    {questions.map((q, qIndex) => (
                        <div
                            key={qIndex}
                            className="flex flex-col gap-2 rounded-xl border border-(--theme-border) p-3"
                        >
                            <div className="flex items-start gap-2">
                                <div className="flex-1">
                                    <Field label={`Question ${qIndex + 1}`}>
                                        <Input
                                            value={q.question}
                                            onChange={(e) => updateQuestion(qIndex, e.target.value)}
                                            placeholder="e.g. What's my favorite food?"
                                        />
                                    </Field>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="mt-6 shrink-0"
                                    onClick={() => removeQuestion(qIndex)}
                                    title="Remove question"
                                >
                                    <Trash />
                                </Button>
                            </div>
                            <p className="text-xs text-(--theme-primary-dark)/60">
                                Options — pick the radio of the correct answer
                            </p>
                            {q.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked={q.correctIndex === oIndex}
                                        onChange={() => setCorrect(qIndex, oIndex)}
                                        className="size-4 shrink-0 accent-(--theme-primary)"
                                        title="Correct answer"
                                    />
                                    <Input
                                        value={option}
                                        onChange={(e) =>
                                            updateOption(qIndex, oIndex, e.target.value)
                                        }
                                        placeholder={`Option ${oIndex + 1}`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="shrink-0"
                                        onClick={() => removeOption(qIndex, oIndex)}
                                        title="Remove option"
                                        disabled={q.options.length <= 2}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => addOption(qIndex)}
                            >
                                + Add Option
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" onClick={addQuestion} className="mt-3 w-full">
                    + Add Question
                </Button>
                <input
                    type="hidden"
                    name={`quizAboutYou.${sectionId}.questionsJson`}
                    value={JSON.stringify(questions)}
                />
            </div>
        </div>
    );
}
