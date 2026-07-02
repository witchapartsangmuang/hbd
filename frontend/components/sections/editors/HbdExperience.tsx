"use client"
import { useMemo, useState } from "react";
import { HbdContent } from "../utils/content-types";
import { SECTION_REGISTRY } from "@/components/sections/_sections";

export default function HbdExperience({ content }: { content: HbdContent }) {
    const activeSections = useMemo(() => content.sections.filter((s) => s.enabled), [content.sections]);
    const [unlockedCount, setUnlockedCount] = useState(1);
    const sparkles = useMemo(
        () => [
            { emoji: "✨", className: "top-[15%] left-[10%] animate-float" },
            { emoji: "🎈", className: "top-[18%] right-[12%] animate-float-delayed" },
            { emoji: "🎉", className: "top-[52%] left-[6%] animate-float-slow" },
            { emoji: "🎂", className: "bottom-[45%] right-[8%] animate-float" },
        ],
        []
    );
    return (
        <>
            {sparkles.map((item, index) => (
                <div
                    key={index}
                    className={`pointer-events-none absolute z-10 text-xl opacity-70 ${item.className}`}
                >
                    {item.emoji}
                </div>
            ))}
            <div className="grid grid-cols-12 bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-100">
                {activeSections.map((section, i) => {
                    const entry = SECTION_REGISTRY[section.type];
                    const Component = entry.component;
                    const visible = i < unlockedCount;
                    return (
                        <div key={section.id} className={`col-span-12 ${visible ? "block" : "hidden"}`}>
                            <Component
                                content={content}
                                nextStep={() => setUnlockedCount((c) => Math.max(c, i + 2))}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    )
}
