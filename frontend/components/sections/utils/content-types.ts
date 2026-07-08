export interface ImgCardItem {
    imgPath: string;
    caption: string;
    rotateAngle: number;
    aspectRatio: string;
}

export interface GiftBoxImageItem {
    imgPath: string;
    caption: string;
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
    | "cinematicDog"
    | "spinTheWheel"
    | "jigsawPhotoPuzzle"
    | "quizAboutYou"
    | "candleBlow"
    | "giftBoxUnwrap"
    | "envelopeOpen"
    | "polaroidShake"
    | "countdownToNextBirthday"
    | "memoryTimeline"
    | "voiceMessage"
    | "zodiacReveal"
    | "guestbookWall"
    | "digitalSignature"
    | "backgroundMusicPlayer"
    | "cinematicRabbit"
    | "cinematicPanda"
    | "fireworksFinale";

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
    "spinTheWheel",
    "jigsawPhotoPuzzle",
    "quizAboutYou",
    "candleBlow",
    "giftBoxUnwrap",
    "envelopeOpen",
    "polaroidShake",
    "countdownToNextBirthday",
    "memoryTimeline",
    "voiceMessage",
    "zodiacReveal",
    "guestbookWall",
    "digitalSignature",
    "backgroundMusicPlayer",
    "cinematicRabbit",
    "cinematicPanda",
    "fireworksFinale",
];

export const SECTION_LABELS: Record<SectionType, string> = {
    // section ที่ฉันปรับแล้ว
    scratchCard: "Scratch Card",
    scratchCardYoutube: "Scratch Card (YouTube)",
    scratchCardVdo: "Scratch Card (Video)",
    scratchCardImg: "Scratch Card (Image)",
    birthGift: "Gift Box",
    cake: "Birthday Cake",
    releaseBalloon: "Release Balloon",
    typingText: "Typing Text",
    flipPhotoCard: "Flip Photo Card",
    polaroidShake: "Shake the Polaroid",
    digitalSignature: "Sign the Card",
    guestbookWall: "Guestbook Wall",
    backgroundMusicPlayer: "Background Music",
    giftBoxUnwrap: "Unwrap the Gift Box",

    // section ที่ฉันยังไม่ได้ปรับ
    dateOfBirth: "Birthday Code",

    // ไม่เอา
    candleBlow: "Blow the Candle",
    fireworksFinale: "Fireworks Finale",
    zodiacReveal: "Zodiac Reveal",
    // แก้ Open the Envelope
    envelopeOpen: "Open the Envelope",
    countdownToNextBirthday: "Countdown to Next Birthday",
    memoryTimeline: "Memory Timeline",
    voiceMessage: "Voice Message",

    cinematicRabbit: "Cinematic Rabbit",
    cinematicPanda: "Cinematic Panda",
    cinematicBirthdayBear: "Cinematic Bear",
    cinematicCat: "Cinematic Cat",
    cinematicDog: "Cinematic Dog",
    slideInIcon: "Slide-In Icon",
    spinTheWheel: "Mini Game: Spin the Wheel",
    jigsawPhotoPuzzle: "Mini Game: Jigsaw Puzzle",
    quizAboutYou: "Mini Game: How Well Do You Know Me",
    popTheBalloon: "Mini Game: Pop Balloon",
    memoryMatching: "Mini Game: Memory Match",
    catchTheGift: "Mini Game: Catch the Gift",
    heartCollector: "Mini Game: Heart Collector",
    findTheHiddenGift: "Mini Game: Find the Gift",
    whackAMoleBirthday: "Mini Game: Whack-a-Mole",
};

export interface SectionInstance {
    id: string;
    type: SectionType;
    enabled: boolean;
    label?: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

export interface MemoryTimelineItem {
    year: string;
    imgPath: string;
    caption: string;
}

export interface GuestbookEntry {
    name: string;
    message: string;
}

export interface HbdContent {
    theme?: {
        baseColor: string;
    };
    share?: {
        title: string;
        description: string;
        imagePath: string;
    };
    birthGift?: Record<
        string,
        {
            surpriseText: string;
            imgCards: ImgCardItem[];
        }
    >;
    cake?: Record<
        string,
        {
            wishText: string;
            wishTextAlign: "left" | "center";
        }
    >;
    scratchCard?: Record<
        string,
        {
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
        }
    >;
    typingText?: Record<
        string,
        {
            message: string;
            messageAlign: "left" | "center";
        }
    >;
    dateOfBirth?: Record<
        string,
        {
            digitCount: 4 | 6 | 8;
            formatPlaceholder: string[];
            correctCode: string;
            emptyDigits: string[];
        }
    >;
    releaseBalloon?: Record<
        string,
        {
            wishes: string[];
            balloonGradients: string[];
            balloonCount?: number;
        }
    >;
    flipPhotoCard?: Record<
        string,
        {
            aspectRatio: string;
            dogImg: string;
            catImg: string;
            dogEmoji: string;
            catEmoji: string;
            dogLabel: string;
            catLabel: string;
        }
    >;
    slideInIcon?: Record<
        string,
        {
            title: string;
        }
    >;
    cinematicBirthdayBear?: Record<
        string,
        {
            title: string;
            subtitle: string;
        }
    >;
    spinTheWheel?: Record<
        string,
        {
            prizes: string[];
        }
    >;
    jigsawPhotoPuzzle?: Record<
        string,
        {
            imagePath: string;
            gridSize: number;
        }
    >;
    quizAboutYou?: Record<
        string,
        {
            questions: QuizQuestion[];
        }
    >;
    candleBlow?: Record<
        string,
        {
            candleCount: number;
            message: string;
        }
    >;
    giftBoxUnwrap?: Record<
        string,
        {
            images: GiftBoxImageItem[];
            message: string;
        }
    >;
    envelopeOpen?: Record<
        string,
        {
            senderName: string;
            message: string;
        }
    >;
    polaroidShake?: Record<
        string,
        {
            imgPath: string;
            caption: string;
            aspectRatio: string;
            eyebrow: string;
            heading: string;
        }
    >;
    countdownToNextBirthday?: Record<
        string,
        {
            birthdayMonth: number;
            birthdayDay: number;
            message: string;
        }
    >;
    memoryTimeline?: Record<
        string,
        {
            items: MemoryTimelineItem[];
        }
    >;
    voiceMessage?: Record<
        string,
        {
            audioSrc: string;
            message: string;
        }
    >;
    zodiacReveal?: Record<
        string,
        {
            customMessage: string;
        }
    >;
    guestbookWall?: Record<
        string,
        {
            wishes: GuestbookEntry[];
        }
    >;
    digitalSignature?: Record<
        string,
        {
            promptText: string;
            eyebrow?: string;
            heading?: string;
        }
    >;
    backgroundMusicPlayer?: Record<
        string,
        {
            audioSrc: string;
            songName: string;
            singerName: string;
            coverImagePath: string;
            startAtSeconds?: number;
        }
    >;
    cinematicRabbit?: Record<
        string,
        {
            title: string;
            subtitle: string;
        }
    >;
    cinematicPanda?: Record<
        string,
        {
            title: string;
            subtitle: string;
        }
    >;
    fireworksFinale?: Record<
        string,
        {
            message: string;
        }
    >;
    confettiColors?: string[];
    sections?: SectionInstance[];
}
