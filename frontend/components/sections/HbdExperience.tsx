"use client";
import { useEffect, useMemo, useState } from "react";
import { HbdContent } from "./utils/content-types";
import { SECTION_REGISTRY } from "@/components/sections/_sections";
import { buildThemeTokens, themeTokensToCssVars } from "@/components/sections/utils/theme";

export default function HbdExperience({ content }: { content: HbdContent }) {
    const sections = content.sections ?? [];
    const baseColor = content.theme?.baseColor ?? "#f43f5e";
    const activeSections = useMemo(() => sections.filter((s) => s.enabled), [sections]);
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
            <div
                className="grid grid-cols-12"
                style={{ ...themeStyle, backgroundImage: gradient }}
            >
                {activeSections.map((section, i) => {
                    const entry = SECTION_REGISTRY[section.type];
                    const Component = entry.component;
                    const visible = i < unlockedCount;
                    return (
                        <div
                            key={section.id}
                            className={`col-span-12 min-h-screen ${visible ? "block" : "hidden"}`}
                        >
                            <Component
                                content={content}
                                sectionId={section.id}
                                nextStep={() => setUnlockedCount((c) => Math.max(c, i + 2))}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
