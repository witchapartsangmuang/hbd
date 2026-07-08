"use client";

import { useState } from "react";
import NextStepButton from "@/components/NextStepButton";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function QuizAboutYou({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { questions = [] } = content.quizAboutYou?.[sectionId] ?? {};
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [pickedIndex, setPickedIndex] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);

    const current = questions[step];

    if (!current) {
        return (
            <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-6 sm:p-6">
                <p className="text-sm text-slate-500">No quiz questions configured yet.</p>
                <NextStepButton
                    nextStep={nextStep}
                    className="rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2.5 font-semibold text-white transition active:scale-95"
                />
            </section>
        );
    }

    const handlePick = (optionIndex: number) => {
        if (pickedIndex !== null) return;
        setPickedIndex(optionIndex);
        if (optionIndex === current.correctIndex) {
            setScore((s) => s + 1);
        }
        window.setTimeout(() => {
            if (step + 1 < questions.length) {
                setStep((s) => s + 1);
                setPickedIndex(null);
            } else {
                setFinished(true);
            }
        }, 900);
    };

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-6 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Birthday Mini Game
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    How Well Do You Know Me? 🤔
                </h2>
            </div>

            {!finished ? (
                <div className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl sm:p-6">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-(--theme-primary-light)">
                        Question {step + 1} of {questions.length}
                    </p>
                    <h3 className="mb-5 text-lg font-bold text-slate-800">{current.question}</h3>
                    <div className="flex flex-col gap-3">
                        {current.options.map((option, i) => {
                            const isPicked = pickedIndex === i;
                            const isCorrect = pickedIndex !== null && i === current.correctIndex;
                            const isWrongPick = isPicked && i !== current.correctIndex;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handlePick(i)}
                                    disabled={pickedIndex !== null}
                                    className={`rounded-2xl border px-4 py-3 text-left font-medium transition ${
                                        isCorrect
                                            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                                            : isWrongPick
                                              ? "border-(--theme-primary-light) bg-(--theme-softer) text-(--theme-primary-dark)"
                                              : "border-slate-200 text-slate-700 hover:border-(--theme-primary-light) hover:bg-(--theme-softer)"
                                    }`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl sm:p-6">
                    <div className="mb-2 text-4xl">🎉</div>
                    <p className="text-lg font-bold text-slate-800">
                        You scored {score} / {questions.length}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        {score === questions.length ? "You really know me!" : "Thanks for playing!"}
                    </p>
                    <NextStepButton
                        nextStep={nextStep}
                        className="mt-5 rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2.5 font-semibold text-white transition active:scale-95"
                        arrowClassName="mx-auto mt-5"
                    />
                </div>
            )}
        </section>
    );
}
