export interface ImgCardItem {
  imgPath: string;
  caption: string;
  rotateAngle: number;
}

export type SectionType =
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
  scratchCardYoutube: "ขูดการ์ด YouTube",
  birthGift: "กล่องของขวัญ",
  cake: "เค้กวันเกิด",
  scratchCardVdo: "ขูดการ์ดวิดีโอ",
  releaseBalloon: "ปล่อยลูกโป่งอวยพร",
  scratchCardImg: "ขูดการ์ดรูปภาพ",
  typingText: "ข้อความพิมพ์ดีด",
  flipPhotoCard: "การ์ดพลิกรูป",
  dateOfBirth: "ใส่รหัสวันเกิด",
  slideInIcon: "ไอคอนเลื่อนเข้า",
  popTheBalloon: "มินิเกม: แตะลูกโป่ง",
  memoryMatching: "มินิเกม: จับคู่ความจำ",
  catchTheGift: "มินิเกม: รับของขวัญ",
  heartCollector: "มินิเกม: เก็บหัวใจ",
  findTheHiddenGift: "มินิเกม: ซ่อนหา",
  whackAMoleBirthday: "มินิเกม: ตีตัวตุ่น",
  cinematicBirthdayBear: "ซีนหมีวันเกิด",
  cinematicCat: "ซีนแมวน้อย",
  cinematicDog: "ซีนหมาน้อย",
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
  };
  scratchCard: {
    userWidth: number;
    userHeight: number;
    brushRadius: number;
    revealThreshold: number;
    maxVdoWidth: number;
  };
  typingText: {
    message: string;
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
    surpriseText: "สุขสันต์วันเกิดน้าาา 🎉",
    imgCards: [
      {
        imgPath: "/img/1.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: -3,
      },
      {
        imgPath: "/img/2.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: 3,
      },
      {
        imgPath: "/img/3.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: -3,
      },
      {
        imgPath: "/img/4.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: 3,
      },
    ],
  },
  cake: {
    wishText: "✨ ขอให้พรวันเกิดนี้เป็นจริงทุกข้อเลยนะ",
  },
  scratchCard: {
    userWidth: 720,
    userHeight: 520,
    brushRadius: 56,
    revealThreshold: 50,
    maxVdoWidth: 360,
  },
  typingText: {
    message:
      "สุขสันต์วันเกิดนะ 🎂\nขอให้วันนี้เป็นวันที่อบอุ่น เต็มไปด้วยรอยยิ้ม และความรักจากทุกคนรอบตัว\nขอให้ทุกความตั้งใจของคุณสำเร็จทีละเรื่อง และขอให้ปีนี้เป็นปีที่ใจดีกับคุณมากที่สุด ✨",
  },
  dateOfBirth: {
    formatPlaceholder: ["D", "D", "M", "M", "Y", "Y"],
    correctCode: "181299",
    emptyDigits: ["", "", "", "", "", ""],
  },
  releaseBalloon: {
    wishes: [
      "ขอให้มีความสุขมาก ๆ",
      "ขอให้สุขภาพแข็งแรง",
      "ขอให้สมหวังทุกเรื่อง",
      "ขอให้งานปัง เงินเข้าเยอะ ๆ",
      "ขอให้รอยยิ้มไม่หายไปไหน",
      "ขอให้ปีนี้เป็นปีที่ดีที่สุด",
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
  },
  slideInIcon: {
    title: "มีใครบางคนถือป้ายมาหาเธอ...",
  },
  cinematicBirthdayBear: {
    title: "มีเซอร์ไพรส์พิเศษกำลังมาหาเธอ 🧸",
    subtitle: "พอ section นี้เข้าจอ หมีน้อยจะเลื่อนเข้ามาพร้อมป้าย HBD และเอฟเฟกต์น่ารัก ๆ",
  },
  confettiColors: [
    "#ff5fa2",
    "#ffcc66",
    "#7a7aff",
    "#67d5b5",
    "#ff8b5c",
    "#f472b6",
    "#60a5fa",
  ],
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
    scratchCard: { ...defaultContent.scratchCard, ...content?.scratchCard },
    typingText: { ...defaultContent.typingText, ...content?.typingText },
    dateOfBirth: { ...defaultContent.dateOfBirth, ...content?.dateOfBirth },
    releaseBalloon: { ...defaultContent.releaseBalloon, ...content?.releaseBalloon },
    flipPhotoCard: { ...defaultContent.flipPhotoCard, ...content?.flipPhotoCard },
    slideInIcon: { ...defaultContent.slideInIcon, ...content?.slideInIcon },
    cinematicBirthdayBear: { ...defaultContent.cinematicBirthdayBear, ...content?.cinematicBirthdayBear },
    confettiColors: content?.confettiColors ?? defaultContent.confettiColors,
    sections: content?.sections && content.sections.length > 0 ? content.sections : defaultContent.sections,
  };
}
