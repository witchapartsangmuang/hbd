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

    // Native smooth scroll can't be slowed down, so animate the scroll
    // ourselves over a fixed duration with easing for a gentle glide.
    const scrollToNextSection = () => {
        const target = buttonRef.current?.closest("[data-section-wrapper]")
            ?.nextElementSibling as HTMLElement | null | undefined;
        if (!target) return;

        const startY = window.scrollY;
        const targetY = target.getBoundingClientRect().top + startY;
        const distance = targetY - startY;
        if (distance === 0) return;

        const duration = 1600; // ms — slow, gentle glide
        const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        let startTime: number | null = null;
        const step = (now: number) => {
            if (startTime === null) startTime = now;
            const progress = Math.min((now - startTime) / duration, 1);
            window.scrollTo(0, startY + distance * easeInOutCubic(progress));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
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
