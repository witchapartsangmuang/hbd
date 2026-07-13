"use client";

import { useEffect, useState } from "react";
import ScrollDownButton from "@/components/ScrollDownButton";
import { HbdContent } from "@/components/sections/utils/content-types";

const isUrl = (value: string) =>
    value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/");

export default function FlipPhotoCard({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const {
        catImg = "",
        dogImg = "",
        dogEmoji = "",
        catEmoji = "",
        dogLabel = "",
        catLabel = "",
        aspectRatio = "3:4",
        subtitle = "",
        frontText = "",
    } = content.flipPhotoCard?.[sectionId] ?? {};
    const [aw, ah] = aspectRatio.split(":").map(Number);
    const [flipped, setflipped] = useState(false);
    const [imgSelect, setimgSelect] = useState<string>("");
    useEffect(() => {
        if (imgSelect === "") return;
        setflipped(true);
        nextStep();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imgSelect, setflipped]);

    return (
        <section className="relative flex flex-col items-center min-h-screen p-5">
            <div className="relative z-10 w-full max-w-md">
                {/* heading */}
                <div className="mb-6 text-center sm:mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight text-(--theme-primary-dark) sm:text-3xl">
                        Photo Flip Card
                    </h1>
                    <p className="mt-2 whitespace-pre-line text-sm text-slate-600 sm:text-base">
                        {subtitle ||
                            "Choose your favorite, and the card will flip to reveal the photo inside"}
                    </p>
                </div>

                {/* card area */}
                <div className="mx-auto" style={{ perspective: "1400px" }}>
                    <div
                        className="relative mx-auto transition-transform duration-700 ease-in-out"
                        style={{
                            width: "min(100%, 340px)",
                            aspectRatio: `${aw}/${ah}`,
                            transformStyle: "preserve-3d",
                            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                    >
                        {/* front */}
                        <div
                            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-[28px] border border-(--theme-border) bg-linear-to-br from-(--theme-primary-light) via-(--theme-primary-light) to-(--theme-gradient-to) p-6 text-center text-white shadow-[0_20px_60px_rgba(236,72,153,0.28)] sm:p-8"
                            style={{ backfaceVisibility: "hidden" }}
                        >
                            <div className="mb-4 text-5xl drop-shadow sm:text-6xl">🎁</div>
                            <p className="mt-3 max-w-55 whitespace-pre-line text-sm leading-relaxed text-white/90 sm:text-base">
                                {frontText ||
                                    `Choose "${dogLabel || "Dog"}" or "${catLabel || "Cat"}" below to open the card`}
                            </p>
                            {!imgSelect && (
                                <div className="mt-5 rounded-full bg-white/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
                                    No photo selected yet
                                </div>
                            )}
                        </div>

                        {/* back */}
                        <div
                            className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                            <div className="relative h-full w-full">
                                {imgSelect ? (
                                    isUrl(imgSelect) ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={imgSelect}
                                            alt="photo card"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-linear-to-br from-(--theme-softer) to-(--theme-soft)">
                                            <span className="select-none text-[96px] leading-none drop-shadow-md sm:text-[120px]">
                                                {imgSelect}
                                            </span>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 text-slate-500">
                                        <p className="text-sm sm:text-base">No photo selected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* action buttons */}
                <div className="mt-3 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-md sm:mt-8 sm:p-5">
                    <div className="mb-3 text-center">
                        <p className="text-sm font-semibold text-slate-700 sm:text-base">
                            Which do you prefer?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setimgSelect(dogImg || dogEmoji)}
                            className="cursor-pointer group flex items-center justify-center gap-3 rounded-2xl border border-sky-200 bg-linear-to-br from-sky-50 to-cyan-100 px-4 py-4 text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                        >
                            <span className="text-2xl transition-transform group-hover:scale-110">
                                {dogEmoji || "🐶"}
                            </span>
                            <span className="font-semibold">{dogLabel || "Dog"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setimgSelect(catImg || catEmoji)}
                            className="cursor-pointer group flex items-center justify-center gap-3 rounded-2xl border border-(--theme-border) bg-linear-to-br from-(--theme-softer) to-(--theme-soft) px-4 py-4 text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                        >
                            <span className="text-2xl transition-transform group-hover:scale-110">
                                {catEmoji || "🐱"}
                            </span>
                            <span className="font-semibold">{catLabel || "Cat"}</span>
                        </button>
                    </div>
                </div>

                {flipped && (
                    <div className="mt-6 flex justify-center">
                        <ScrollDownButton />
                    </div>
                )}
            </div>
        </section>
    );
}
