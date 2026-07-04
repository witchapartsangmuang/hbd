"use client";

import { HbdContent } from "@/components/sections/utils/content-types";
import ScratchCardYoutube from "./ScratchCardYouTube";
import ScratchCardVdo from "./ScratchCardVdo";
import ScratchCardImg from "./ScratchCardImg";

export default function ScratchCard({
    nextStep,
    content,
    sectionId,
}: {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
}) {
    const revealType = content.scratchCard?.[sectionId]?.revealType ?? "youtube";
    if (revealType === "video")
        return <ScratchCardVdo nextStep={nextStep} content={content} sectionId={sectionId} />;
    if (revealType === "image")
        return <ScratchCardImg nextStep={nextStep} content={content} sectionId={sectionId} />;
    return <ScratchCardYoutube nextStep={nextStep} content={content} sectionId={sectionId} />;
}
