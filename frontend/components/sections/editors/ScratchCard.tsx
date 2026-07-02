"use client";

import { HbdContent } from "@/components/sections/utils/content-types";
import ScratchCardYoutube from "./ScratchCardYouTube";
import ScratchCardVdo from "./ScratchCardVdo";
import ScratchCardImg from "./ScratchCardImg";

export default function ScratchCard({
    nextStep,
    content,
}: {
    nextStep: () => void;
    content: HbdContent;
}) {
    const revealType = content.scratchCard.revealType ?? "youtube";
    if (revealType === "video") return <ScratchCardVdo nextStep={nextStep} content={content} />;
    if (revealType === "image") return <ScratchCardImg nextStep={nextStep} content={content} />;
    return <ScratchCardYoutube nextStep={nextStep} content={content} />;
}
