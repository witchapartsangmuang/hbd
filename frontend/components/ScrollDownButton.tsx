"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "@/icons/icons";

export default function ScrollDownButton({ className = "" }: { className?: string }) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [hasNextSection, setHasNextSection] = useState(false);

    // Each section is wrapped in a [data-section-wrapper] div by
    // HbdExperience, so the next section is that wrapper's next sibling.
    useEffect(() => {
        setHasNextSection(
            !!buttonRef.current?.closest("[data-section-wrapper]")?.nextElementSibling
        );
    }, []);

    const scrollToNextSection = () => {
        buttonRef.current
            ?.closest("[data-section-wrapper]")
            ?.nextElementSibling?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={scrollToNextSection}
            aria-label="Scroll to next section"
            className={`flex size-11 animate-bounce items-center justify-center rounded-full bg-(--theme-primary) text-white shadow-lg transition active:scale-95 ${hasNextSection ? "" : "hidden"} ${className}`}
        >
            <ChevronDown className="size-5" />
        </button>
    );
}
