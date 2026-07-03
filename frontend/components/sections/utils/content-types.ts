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
    spinTheWheel: "Mini Game: Spin the Wheel",
    jigsawPhotoPuzzle: "Mini Game: Jigsaw Puzzle",
    quizAboutYou: "Mini Game: How Well Do You Know Me",
    candleBlow: "Blow the Candle",
    giftBoxUnwrap: "Unwrap the Gift Box",
    envelopeOpen: "Open the Envelope",
    polaroidShake: "Shake the Polaroid",
    countdownToNextBirthday: "Countdown to Next Birthday",
    memoryTimeline: "Memory Timeline",
    voiceMessage: "Voice Message",
    zodiacReveal: "Zodiac Reveal",
    guestbookWall: "Guestbook Wall",
    digitalSignature: "Sign the Card",
    backgroundMusicPlayer: "Background Music",
    cinematicRabbit: "Cinematic Rabbit",
    cinematicPanda: "Cinematic Panda",
    fireworksFinale: "Fireworks Finale",
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
    theme: {
        baseColor: string;
    };
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
    spinTheWheel: {
        prizes: string[];
    };
    jigsawPhotoPuzzle: {
        imagePath: string;
        gridSize: number;
    };
    quizAboutYou: {
        questions: QuizQuestion[];
    };
    candleBlow: {
        candleCount: number;
        message: string;
    };
    giftBoxUnwrap: {
        imgPath: string;
        message: string;
    };
    envelopeOpen: {
        senderName: string;
        message: string;
    };
    polaroidShake: {
        imgPath: string;
        caption: string;
    };
    countdownToNextBirthday: {
        birthdayMonth: number;
        birthdayDay: number;
        message: string;
    };
    memoryTimeline: {
        items: MemoryTimelineItem[];
    };
    voiceMessage: {
        audioSrc: string;
        message: string;
    };
    zodiacReveal: {
        customMessage: string;
    };
    guestbookWall: {
        wishes: GuestbookEntry[];
    };
    digitalSignature: {
        promptText: string;
    };
    backgroundMusicPlayer: {
        audioSrc: string;
        label: string;
    };
    cinematicRabbit: {
        title: string;
        subtitle: string;
    };
    cinematicPanda: {
        title: string;
        subtitle: string;
    };
    fireworksFinale: {
        message: string;
    };
    confettiColors: string[];
    sections: SectionInstance[];
}
<<<<<<< HEAD
=======

export const defaultContent: HbdContent = {
    theme: {
        baseColor: "#f43f5e",
    },
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
    spinTheWheel: {
        prizes: [
            "A big hug 🤗",
            "Dinner on me 🍽️",
            "A surprise gift 🎁",
            "A day off together 🌴",
            "A handwritten letter 💌",
            "One free favor 🙌",
        ],
    },
    jigsawPhotoPuzzle: {
        imagePath: "/img/1.jpg",
        gridSize: 3,
    },
    quizAboutYou: {
        questions: [
            {
                question: "What's my favorite color?",
                options: ["Pink", "Blue", "Green"],
                correctIndex: 0,
            },
            {
                question: "Where did we first meet?",
                options: ["School", "Work", "A friend's party"],
                correctIndex: 2,
            },
        ],
    },
    candleBlow: {
        candleCount: 3,
        message: "Make a wish and blow out the candles 🕯️",
    },
    giftBoxUnwrap: {
        imgPath: "/img/5.png",
        message: "Something special is inside 🎁",
    },
    envelopeOpen: {
        senderName: "From someone who cares about you",
        message: "Happy birthday! Open this card whenever you're ready 💌",
    },
    polaroidShake: {
        imgPath: "/img/2.jpg",
        caption: "Shake to develop this memory ✨",
    },
    countdownToNextBirthday: {
        birthdayMonth: 12,
        birthdayDay: 18,
        message: "Counting down to your next birthday 🎂",
    },
    memoryTimeline: {
        items: [
            { year: "2021", imgPath: "/img/1.jpg", caption: "Where it all began" },
            { year: "2022", imgPath: "/img/2.jpg", caption: "So many good memories" },
            { year: "2023", imgPath: "/img/3.jpg", caption: "Still going strong" },
        ],
    },
    voiceMessage: {
        audioSrc: "",
        message: "Press play to hear a birthday message 🎙️",
    },
    zodiacReveal: {
        customMessage: "The stars have something to say about you today ⭐",
    },
    guestbookWall: {
        wishes: [
            { name: "Mom", message: "Happy birthday, my dear! Love you always." },
            { name: "Best friend", message: "Cheers to another amazing year!" },
        ],
    },
    digitalSignature: {
        promptText: "Sign your name below to seal this card with love",
    },
    backgroundMusicPlayer: {
        audioSrc: "",
        label: "Play a little birthday tune 🎵",
    },
    cinematicRabbit: {
        title: "Someone hops in with a surprise 🐰",
        subtitle: "A little rabbit is bringing you a birthday sign with love",
    },
    cinematicPanda: {
        title: "A gentle panda has a gift for you 🐼",
        subtitle: "Watch closely as the panda arrives with a birthday sign",
    },
    fireworksFinale: {
        message: "Happy Birthday! 🎆 Here's to a wonderful year ahead",
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
        theme: { ...defaultContent.theme, ...content?.theme },
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
        spinTheWheel: { ...defaultContent.spinTheWheel, ...content?.spinTheWheel },
        jigsawPhotoPuzzle: { ...defaultContent.jigsawPhotoPuzzle, ...content?.jigsawPhotoPuzzle },
        quizAboutYou: { ...defaultContent.quizAboutYou, ...content?.quizAboutYou },
        candleBlow: { ...defaultContent.candleBlow, ...content?.candleBlow },
        giftBoxUnwrap: { ...defaultContent.giftBoxUnwrap, ...content?.giftBoxUnwrap },
        envelopeOpen: { ...defaultContent.envelopeOpen, ...content?.envelopeOpen },
        polaroidShake: { ...defaultContent.polaroidShake, ...content?.polaroidShake },
        countdownToNextBirthday: {
            ...defaultContent.countdownToNextBirthday,
            ...content?.countdownToNextBirthday,
        },
        memoryTimeline: { ...defaultContent.memoryTimeline, ...content?.memoryTimeline },
        voiceMessage: { ...defaultContent.voiceMessage, ...content?.voiceMessage },
        zodiacReveal: { ...defaultContent.zodiacReveal, ...content?.zodiacReveal },
        guestbookWall: { ...defaultContent.guestbookWall, ...content?.guestbookWall },
        digitalSignature: { ...defaultContent.digitalSignature, ...content?.digitalSignature },
        backgroundMusicPlayer: {
            ...defaultContent.backgroundMusicPlayer,
            ...content?.backgroundMusicPlayer,
        },
        cinematicRabbit: { ...defaultContent.cinematicRabbit, ...content?.cinematicRabbit },
        cinematicPanda: { ...defaultContent.cinematicPanda, ...content?.cinematicPanda },
        fireworksFinale: { ...defaultContent.fireworksFinale, ...content?.fireworksFinale },
        confettiColors: content?.confettiColors ?? defaultContent.confettiColors,
        sections: content?.sections ?? [],
    };
}
>>>>>>> 86186fc85f85b263506d3394eaa423f0576a6c37
