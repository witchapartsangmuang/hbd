"use client";
import { useEffect, useRef } from "react";
import { releaseBalloonState } from "@/components/sections/utils/hooks";
import { BalloonItem } from "@/components/sections/utils/type";
import { HbdContent } from "@/components/sections/utils/content-types";

const DEFAULT_BALLOON_GRADIENTS = [
    "from-pink-400 to-rose-500",
    "from-sky-400 to-blue-500",
    "from-amber-300 to-orange-500",
    "from-violet-400 to-purple-500",
    "from-emerald-400 to-teal-500",
    "from-fuchsia-400 to-pink-500",
];

export default function ReleaseBalloon({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const {
        wishes = [],
        balloonGradients: configuredGradients = [],
        balloonCount = 5,
    } = content.releaseBalloon?.[sectionId] ?? {};
    const balloonGradients =
        configuredGradients.length > 0 ? configuredGradients : DEFAULT_BALLOON_GRADIENTS;
    const { balloons, setballoons, release, setrelease } = releaseBalloonState();
    const balloonIdRef = useRef(1);
    const balloonZoneRef = useRef<HTMLDivElement | null>(null);
    const handleStartBalloons = () => {
        const zoneWidth = balloonZoneRef.current?.clientWidth ?? 900;
        const newItems: BalloonItem[] = Array.from({ length: balloonCount }).map((_, i) => ({
            id: balloonIdRef.current++,
            text: wishes.length > 0 ? wishes[i % wishes.length] : "",
            left: Math.max(0, Math.random() * (zoneWidth - 100)),
            duration: 6 + Math.random() * 4,
            styleIndex: Math.floor(Math.random() * balloonGradients.length),
        }));
        setballoons((prev) => [...prev, ...newItems]);
        window.setTimeout(() => {
            setballoons((prev) =>
                prev.filter((item) => !newItems.some((newItem) => newItem.id === item.id))
            );
        }, 11000);
        setrelease((prev) => !prev);
        nextStep();
    };
    useEffect(() => {
        console.log("balloons", balloons);
    }, [balloons]);
    return (
        <section className="relative flex flex-col items-center min-h-screen p-5">
            {/* <h2 className="text-center text-3xl font-bold text-(--theme-primary-dark)">
                🎈 Floating Wishes
            </h2>
            <p className="mt-3 max-w-2xl text-center text-[#3a2433]/80">
                Little wishes floating up to the sky
            </p> */}
            <div ref={balloonZoneRef} className="relative h-[calc(100vh-2.5rem)] w-full">
                {balloons.map((balloon) => (
                    <div
                        key={balloon.id}
                        className={`animate-rise absolute -bottom-56 flex h-28 w-24 items-center justify-center rounded-[50%_50%_45%_45%] bg-linear-to-br ${balloonGradients[balloon.styleIndex] ?? ""} px-2 text-center text-xs leading-5 text-white shadow-xl`}
                        style={{
                            left: balloon.left,
                            animationDuration: `${balloon.duration}s`,
                        }}
                    >
                        {balloon.text}
                        <span className="absolute left-1/2 top-27 h-17.5 w-0.5 -translate-x-1/2 bg-zinc-400" />
                    </div>
                ))}
                <div className="flex w-full h-full items-center justify-center">
                    {!release && (
                        <button
                            type="button"
                            onClick={handleStartBalloons}
                            className="mt-6 rounded-full bg-linear-to-r from-(--theme-gradient-from) to-(--theme-gradient-to) px-6 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5"
                        >
                            Release Balloon
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
