"use client";

import { useEffect, useMemo, useState } from "react";
import NextStepButton from "@/components/NextStepButton";
import { HbdContent } from "@/components/sections/utils/content-types";

function shuffledOrder(count: number): number[] {
    const arr = Array.from({ length: count }, (_, i) => i);
    do {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    } while (arr.every((v, i) => v === i));
    return arr;
}

export default function JigsawPhotoPuzzle({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const { imagePath = "", gridSize = 3 } = content.jigsawPhotoPuzzle?.[sectionId] ?? {};
    const pieceCount = gridSize * gridSize;

    const [order, setOrder] = useState<number[]>(() => shuffledOrder(pieceCount));
    const [selected, setSelected] = useState<number | null>(null);
    const [moves, setMoves] = useState(0);
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        setOrder(shuffledOrder(pieceCount));
        setSolved(false);
        setMoves(0);
    }, [pieceCount]);

    const isSolved = useMemo(() => order.every((v, i) => v === i), [order]);

    useEffect(() => {
        if (isSolved && !solved) {
            setSolved(true);
        }
    }, [isSolved, solved]);

    const handlePieceClick = (index: number) => {
        if (solved) return;
        if (selected === null) {
            setSelected(index);
            return;
        }
        if (selected === index) {
            setSelected(null);
            return;
        }
        setOrder((prev) => {
            const next = [...prev];
            [next[selected], next[index]] = [next[index], next[selected]];
            return next;
        });
        setMoves((m) => m + 1);
        setSelected(null);
    };

    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-b from-(--theme-softer) via-(--theme-softer) to-(--theme-soft) p-4 sm:gap-6 sm:p-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--theme-primary)">
                    Birthday Mini Game
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
                    Piece It Together 🧩
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                    Tap two pieces to swap them until the photo is complete
                </p>
            </div>

            <div
                className="grid aspect-square w-full max-w-sm gap-1 overflow-hidden rounded-2xl border-4 border-white bg-slate-200 shadow-2xl sm:max-w-md"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
                {order.map((pieceIndex, slot) => {
                    const row = Math.floor(pieceIndex / gridSize);
                    const col = pieceIndex % gridSize;
                    return (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => handlePieceClick(slot)}
                            className={`relative aspect-square overflow-hidden transition ${
                                selected === slot ? "ring-4 ring-(--theme-primary) ring-inset" : ""
                            }`}
                            style={{
                                backgroundImage: `url(${imagePath})`,
                                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                                backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
                            }}
                            aria-label={`puzzle piece ${slot + 1}`}
                        />
                    );
                })}
            </div>

            <p className="text-sm text-slate-500">Moves: {moves}</p>

            {solved && (
                <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-xl sm:p-6">
                    <div className="mb-2 text-4xl">🎉</div>
                    <p className="text-lg font-bold text-slate-800">You solved it!</p>
                    <NextStepButton
                        nextStep={nextStep}
                        className="mt-4 rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-2.5 font-semibold text-white transition active:scale-95"
                        arrowClassName="mx-auto mt-4"
                    />
                </div>
            )}
        </section>
    );
}
