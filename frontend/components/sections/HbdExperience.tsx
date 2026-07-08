"use client";
import { useEffect, useMemo, useState } from "react";
import { HbdContent } from "./utils/content-types";
import { SECTION_REGISTRY } from "@/components/sections/_sections";
import { buildThemeTokens, themeTokensToCssVars } from "@/components/sections/utils/theme";

export default function HbdExperience({ content }: { content: HbdContent }) {
    const baseColor = content.theme?.baseColor ?? "#f43f5e";
    const activeSections = useMemo(
        () => (content.sections ?? []).filter((s) => s.enabled),
        [content.sections]
    );
    const themeTokens = useMemo(() => buildThemeTokens(baseColor), [baseColor]);
    const themeStyle = useMemo(() => themeTokensToCssVars(themeTokens), [themeTokens]);
    const gradient = useMemo(
        () =>
            `linear-gradient(to bottom right, ${themeTokens.softer}, ${themeTokens.soft}, ${themeTokens.border})`,
        [themeTokens]
    );
    const [unlockedCount, setUnlockedCount] = useState(1);

    // Applying the exact same gradient string to body and the wrapper (rather
    // than body's own hand-written gradient vs. the wrapper's Tailwind
    // from/via/to utility) keeps both pixel-identical so there's no seam
    // where the wrapper's box ends and body shows through.
    useEffect(() => {
        document.body.style.backgroundImage = gradient;
        return () => {
            document.body.style.backgroundImage = "";
        };
    }, [gradient]);
    // const sparkles = useMemo(
    //     () => [
    //         { emoji: "✨", className: "top-[15%] left-[10%] animate-float" },
    //         { emoji: "🎈", className: "top-[18%] right-[12%] animate-float-delayed" },
    //         { emoji: "🎉", className: "top-[52%] left-[6%] animate-float-slow" },
    //         { emoji: "🎂", className: "bottom-[45%] right-[8%] animate-float" },
    //     ],
    //     []
    // );
    return (
        <>
            {/* {sparkles.map((item, index) => (
                <div
                    key={index}
                    className={`pointer-events-none absolute z-10 text-xl opacity-70 ${item.className}`}
                >
                    {item.emoji}
                </div>
            ))} */}
            {/* Capped at tablet width so desktop gets the same layout as tablet;
                body carries the identical gradient, so the sides blend seamlessly. */}
            <div
                className="mx-auto grid w-full max-w-3xl grid-cols-12"
                style={{ ...themeStyle, backgroundImage: gradient }}
            >
                {activeSections.map((section, i) => {
                    const entry = SECTION_REGISTRY[section.type];
                    const Component = entry.component;
                    const visible = i < unlockedCount;
                    return (
                        <div
                            key={section.id}
                            data-section-wrapper
                            className={`col-span-12 min-h-screen ${visible ? "block" : "hidden"}`}
                        >
                            {/* Mount only once unlocked — sections start timers, games, and
                                animation loops on mount, so mounting while still hidden would
                                run them before the visitor ever reaches the section. */}
                            {visible && (
                                <Component
                                    content={content}
                                    sectionId={section.id}
                                    nextStep={() => setUnlockedCount((c) => Math.max(c, i + 2))}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
