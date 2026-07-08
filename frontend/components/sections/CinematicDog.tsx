"use client";

import { useEffect, useRef, useState } from "react";
import NextStepButton from "@/components/NextStepButton";
import { HbdContent } from "@/components/sections/utils/content-types";

export default function CinematicDog({ nextStep }: { nextStep: () => void; content: HbdContent }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShow(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.35 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={ref}
            className="relative mx-auto my-24 flex min-h-[350px] max-w-5xl items-center justify-between overflow-hidden rounded-3xl bg-(--theme-softer) p-10"
        >
            <div className="max-w-lg">
                <h2 className="text-3xl font-bold text-slate-900">
                    A little dog has come for you 🐶
                </h2>
                <p className="mt-3 text-slate-600">This dog is carrying a surprise sign!</p>
            </div>

            <div className="relative h-40 w-40">
                <div
                    className={`absolute top-1/2 -translate-y-1/2 transition-all duration-[5500ms] ease-out ${
                        show
                            ? "right-0 opacity-100 translate-x-0"
                            : "-right-52 opacity-0 translate-x-20"
                    }`}
                >
                    <div className="relative flex flex-col items-center">
                        <div className="mb-3 rounded-xl bg-yellow-500 px-4 py-2 text-white font-bold shadow">
                            Woof! 🎂
                        </div>

                        <div className="relative h-28 w-28 rounded-full bg-amber-400">
                            {/* ears */}
                            <div className="absolute -left-3 top-5 h-10 w-6 rounded-full bg-amber-500"></div>
                            <div className="absolute -right-3 top-5 h-10 w-6 rounded-full bg-amber-500"></div>

                            {/* eyes */}
                            <div className="absolute left-7 top-10 h-2 w-2 rounded-full bg-black"></div>
                            <div className="absolute right-7 top-10 h-2 w-2 rounded-full bg-black"></div>

                            {/* nose */}
                            <div className="absolute left-1/2 top-14 h-3 w-4 -translate-x-1/2 rounded-full bg-black"></div>

                            {/* mouth */}
                            <div className="absolute left-1/2 top-[68px] h-2 w-6 -translate-x-1/2 border-b-2 border-black rounded-b-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {show && (
                <NextStepButton
                    nextStep={nextStep}
                    className="absolute bottom-4 right-4 rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5"
                    arrowClassName="absolute bottom-4 right-4"
                />
            )}
        </section>
    );
}
