export interface ImgCardItem {
    imgPath: string;
    caption: string;
    rotateAngle: number;
}

export type SectionType =
    | "scratchCard"
    | "scratchCardYoutube"
    | "birthGift"
    | "cake"
    | "scratchCardVdo"
    | "releaseBalloon"
    | "scratchCardImg"
    | "typingText"
    | "flipPhotoCard"
    | "dateOfBirth"
    | "slideInIcon"
    | "popTheBalloon"
    | "memoryMatching"
    | "catchTheGift"
    | "heartCollector"
    | "findTheHiddenGift"
    | "whackAMoleBirthday"
    | "cinematicBirthdayBear"
    | "cinematicCat"
    | "cinematicDog";

export const SECTION_TYPES: SectionType[] = [
    "scratchCard",
    "scratchCardYoutube",
    "birthGift",
    "cake",
    "scratchCardVdo",
    "releaseBalloon",
    "scratchCardImg",
    "typingText",
    "flipPhotoCard",
    "dateOfBirth",
    "slideInIcon",
    "popTheBalloon",
    "memoryMatching",
    "catchTheGift",
    "heartCollector",
    "findTheHiddenGift",
    "whackAMoleBirthday",
    "cinematicBirthdayBear",
    "cinematicCat",
    "cinematicDog",
];

export const SECTION_LABELS: Record<SectionType, string> = {
    scratchCard: "Scratch Card",
    scratchCardYoutube: "Scratch Card (YouTube)",
    birthGift: "Gift Box",
    cake: "Birthday Cake",
    scratchCardVdo: "Scratch Card (Video)",
    releaseBalloon: "Release Balloon",
    scratchCardImg: "Scratch Card (Image)",
    typingText: "Typing Text",
    flipPhotoCard: "Flip Photo Card",
    dateOfBirth: "Birthday Code",
    slideInIcon: "Slide-In Icon",
    popTheBalloon: "Mini Game: Pop Balloon",
    memoryMatching: "Mini Game: Memory Match",
    catchTheGift: "Mini Game: Catch the Gift",
    heartCollector: "Mini Game: Heart Collector",
    findTheHiddenGift: "Mini Game: Find the Gift",
    whackAMoleBirthday: "Mini Game: Whack-a-Mole",
    cinematicBirthdayBear: "Cinematic Bear",
    cinematicCat: "Cinematic Cat",
    cinematicDog: "Cinematic Dog",
};

export interface SectionInstance {
    id: string;
    type: SectionType;
    enabled: boolean;
    label?: string;
}

export interface HbdContent {
    birthGift: {
        surpriseText: string;
        imgCards: ImgCardItem[];
    };
    cake: {
        wishText: string;
        wishTextAlign: "left" | "center";
    };
    scratchCard: {
        userWidth: number;
        aspectRatio: string;
        brushRadius: number;
        revealThreshold: number;
        maxVdoWidth: number;
        revealType: "youtube" | "video" | "image";
        youtubeUrl: string;
        videoSrc: string;
        imageSrc: string;
        headingText: string;
        subText: string;
        revealedText: string;
    };
    typingText: {
        message: string;
        messageAlign: "left" | "center";
    };
    dateOfBirth: {
        formatPlaceholder: string[];
        correctCode: string;
        emptyDigits: string[];
    };
    releaseBalloon: {
        wishes: string[];
        balloonGradients: string[];
    };
    flipPhotoCard: {
        dogImg: string;
        catImg: string;
        dogEmoji: string;
        catEmoji: string;
    };
    slideInIcon: {
        title: string;
    };
    cinematicBirthdayBear: {
        title: string;
        subtitle: string;
    };
    confettiColors: string[];
    sections: SectionInstance[];
}

export const defaultContent: HbdContent = {
    birthGift: {
        surpriseText: "Happy Birthday! 🎉",
        imgCards: [
            {
                imgPath: "/img/1.jpg",
                caption: "Wishing you the brightest year yet",
                rotateAngle: -3,
            },
            {
                imgPath: "/img/2.jpg",
                caption: "Wishing you the brightest year yet",
                rotateAngle: 3,
            },
            {
                imgPath: "/img/3.jpg",
                caption: "Wishing you the brightest year yet",
                rotateAngle: -3,
            },
            {
                imgPath: "/img/4.jpg",
                caption: "Wishing you the brightest year yet",
                rotateAngle: 3,
            },
        ],
    },
    cake: {
        wishText: "✨ May all your birthday wishes come true",
        wishTextAlign: "center" as const,
    },
    scratchCard: {
        userWidth: 720,
        aspectRatio: "16:9",
        brushRadius: 56,
        revealThreshold: 50,
        maxVdoWidth: 360,
        revealType: "youtube",
        youtubeUrl: "https://www.youtube.com/embed/S43vWT9waGQ",
        videoSrc: "/video/nm-tt.mp4",
        imageSrc: "/img/5.png",
        headingText: "Try scratching the card!",
        subText: "Something is hidden inside...",
        revealedText: "There's more to see 💌",
    },
    typingText: {
        message:
            "Happy birthday! 🎂\nWishing you a warm day filled with smiles and love from everyone around you.\nMay every dream come true, one by one, and may this year be the kindest one yet ✨",
        messageAlign: "left" as const,
    },
    dateOfBirth: {
        formatPlaceholder: ["D", "D", "M", "M", "Y", "Y"],
        correctCode: "181299",
        emptyDigits: ["", "", "", "", "", ""],
    },
    releaseBalloon: {
        wishes: [
            "Wishing you so much happiness",
            "Wishing you good health",
            "May all your dreams come true",
            "May your career thrive and abundance flow",
            "May your smile never fade",
            "May this be your best year yet",
        ],
        balloonGradients: [
            "from-pink-400 to-pink-500",
            "from-blue-300 to-blue-500",
            "from-amber-300 to-orange-400",
            "from-emerald-300 to-green-500",
        ],
    },
    flipPhotoCard: {
        dogImg: "/img/nm_dog.jpg",
        catImg: "/img/nm_cat.jpg",
        dogEmoji: "",
        catEmoji: "",
    },
    slideInIcon: {
        title: "Someone is holding a sign for you...",
    },
    cinematicBirthdayBear: {
        title: "A special surprise is coming your way 🧸",
        subtitle: "When this section slides in, a little bear will appear holding an HBD sign with cute effects",
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
