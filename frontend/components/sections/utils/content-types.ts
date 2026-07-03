export interface ImgCardItem {
    imgPath: string;
    caption: string;
    rotateAngle: number;
    aspectRatio: string;
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
        aspectRatio: string;
        brushRadius: number;
        revealThreshold: number;
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
        digitCount: 4 | 6 | 8;
        formatPlaceholder: string[];
        correctCode: string;
        emptyDigits: string[];
    };
    releaseBalloon: {
        wishes: string[];
        balloonGradients: string[];
    };
    flipPhotoCard: {
        aspectRatio: string;
        dogImg: string;
        catImg: string;
        dogEmoji: string;
        catEmoji: string;
        dogLabel: string;
        catLabel: string;
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
