import type { HbdContent } from "./content-types";

const defaultContent: HbdContent = {
    birthGift: {
        surpriseText: "Happy Birthday! 🎉",
        imgCards: [
            { imgPath: "", caption: "", rotateAngle: 0, aspectRatio: "3:4" },
        ],
    },
    cake: {
        wishText: "",
        wishTextAlign: "center" as const,
    },
    scratchCard: {
        aspectRatio: "16:9",
        brushRadius: 56,
        revealThreshold: 50,
        revealType: "youtube",
        youtubeUrl: "",
        videoSrc: "",
        imageSrc: "",
        headingText: "",
        subText: "",
        revealedText: "",
    },
    typingText: {
        message: "",
        messageAlign: "left" as const,
    },
    dateOfBirth: {
        digitCount: 6 as 4 | 6 | 8,
        formatPlaceholder: ["D", "D", "M", "M", "Y", "Y"],
        correctCode: "",
        emptyDigits: ["", "", "", "", "", ""],
    },
    releaseBalloon: {
        wishes: [],
        balloonGradients: [
            "from-pink-400 to-pink-500",
            "from-blue-300 to-blue-500",
            "from-amber-300 to-orange-400",
            "from-emerald-300 to-green-500",
        ],
    },
    flipPhotoCard: {
        aspectRatio: "3:4",
        dogImg: "",
        catImg: "",
        dogEmoji: "🐶",
        catEmoji: "🐱",
        dogLabel: "Dog",
        catLabel: "Cat",
    },
    slideInIcon: {
        title: "",
    },
    cinematicBirthdayBear: {
        title: "",
        subtitle: "",
    },
    confettiColors: ["#ff5fa2", "#ffcc66", "#7a7aff", "#67d5b5", "#ff8b5c", "#f472b6", "#60a5fa"],
    sections: [
        { id: "default-scratch-youtube", type: "scratchCardYoutube", enabled: true },
        { id: "default-birth-gift", type: "birthGift", enabled: true },
        { id: "default-cake", type: "cake", enabled: true },
        { id: "default-scratch-vdo", type: "scratchCardVdo", enabled: true },
        { id: "default-release-balloon", type: "releaseBalloon", enabled: true },
        { id: "default-scratch-img", type: "scratchCardImg", enabled: true },
        { id: "default-typing-text", type: "typingText", enabled: true },
        { id: "default-flip-photo", type: "flipPhotoCard", enabled: true },
        { id: "default-date-of-birth", type: "dateOfBirth", enabled: true },
    ],
};

export function mergeWithDefaults(content: Partial<HbdContent> | null | undefined): HbdContent {
    return {
        birthGift: { ...defaultContent.birthGift, ...content?.birthGift },
        cake: { ...defaultContent.cake, ...content?.cake },
        scratchCard: {
            ...defaultContent.scratchCard,
            ...content?.scratchCard,
            revealType: content?.scratchCard?.revealType ?? defaultContent.scratchCard.revealType,
        },
        typingText: { ...defaultContent.typingText, ...content?.typingText },
        dateOfBirth: { ...defaultContent.dateOfBirth, ...content?.dateOfBirth },
        releaseBalloon: { ...defaultContent.releaseBalloon, ...content?.releaseBalloon },
        flipPhotoCard: { ...defaultContent.flipPhotoCard, ...content?.flipPhotoCard },
        slideInIcon: { ...defaultContent.slideInIcon, ...content?.slideInIcon },
        cinematicBirthdayBear: {
            ...defaultContent.cinematicBirthdayBear,
            ...content?.cinematicBirthdayBear,
        },
        confettiColors: content?.confettiColors ?? defaultContent.confettiColors,
        sections: content?.sections ?? [],
    };
}
