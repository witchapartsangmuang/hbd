"use client"
import { useEffect, useMemo, useRef, useState } from "react";
type BalloonItem = {
    id: number;
    text: string;
    left: number;
    duration: number;
    styleIndex: number;
};

type ConfettiPiece = {
    id: number;
    left: number;
    top: number;
    x: number;
    y: number;
    rotate: number;
    color: string;
    width: number;
    height: number;
    duration: number;
};

const wishes = [
    "ขอให้มีความสุขมาก ๆ",
    "ขอให้สุขภาพแข็งแรง",
    "ขอให้สมหวังทุกเรื่อง",
    "ขอให้งานปัง เงินเข้าเยอะ ๆ",
    "ขอให้รอยยิ้มไม่หายไปไหน",
    "ขอให้ปีนี้เป็นปีที่ดีที่สุด",
];

const typewriterMessage =
    "สุขสันต์วันเกิดนะ 🎂\nขอให้วันนี้เป็นวันที่อบอุ่น เต็มไปด้วยรอยยิ้ม และความรักจากทุกคนรอบตัว\nขอให้ทุกความตั้งใจของคุณสำเร็จทีละเรื่อง และขอให้ปีนี้เป็นปีที่ใจดีกับคุณมากที่สุด ✨";

const balloonGradients = [
    "from-pink-400 to-pink-500",
    "from-blue-300 to-blue-500",
    "from-amber-300 to-orange-400",
    "from-emerald-300 to-green-500",
];

const confettiColors = [
    "#ff5fa2",
    "#ffcc66",
    "#7a7aff",
    "#67d5b5",
    "#ff8b5c",
    "#f472b6",
    "#60a5fa",
];
export default function BirthGift() {
    const [giftOpened, setGiftOpened] = useState(false);
    const [showSurpriseText, setShowSurpriseText] = useState(false);

    // const [blown, setBlown] = useState(false);
    // const [wishText, setWishText] = useState("");

    // const [balloons, setBalloons] = useState<BalloonItem[]>([]);
    // const balloonIdRef = useRef(1);
    // const balloonZoneRef = useRef<HTMLDivElement | null>(null);

    // const [typedText, setTypedText] = useState("");
    // const [typeStarted, setTypeStarted] = useState(false);
    // const messageRef = useRef<HTMLDivElement | null>(null);

    // const [birthdayInput, setBirthdayInput] = useState("");
    // const [unlockResult, setUnlockResult] = useState("");

    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const confettiIdRef = useRef(1);

    // const [musicPlaying, setMusicPlaying] = useState(false);
    // const audioRef = useRef<HTMLAudioElement | null>(null);

    const sparkles = useMemo(
        () => [
            { emoji: "✨", className: "top-[8%] left-[10%] animate-float" },
            { emoji: "🎈", className: "top-[18%] right-[12%] animate-float-delayed" },
            { emoji: "🎉", className: "top-[52%] left-[6%] animate-float-slow" },
            { emoji: "🎂", className: "bottom-[18%] right-[7%] animate-float" },
        ],
        []
    );

    // useEffect(() => {
    //     if (!giftOpened) return;
    //     const timer = setTimeout(() => setShowSurpriseText(true), 500);
    //     return () => clearTimeout(timer);
    // }, [giftOpened]);

    // useEffect(() => {
    //     if (!typeStarted) return;

    //     let i = 0;
    //     const interval = setInterval(() => {
    //         i += 1;
    //         setTypedText(typewriterMessage.slice(0, i));
    //         if (i >= typewriterMessage.length) {
    //             clearInterval(interval);
    //         }
    //     }, 35);

    //     return () => clearInterval(interval);
    // }, [typeStarted]);

    // useEffect(() => {
    //     if (!messageRef.current) return;

    //     const observer = new IntersectionObserver(
    //         (entries) => {
    //             entries.forEach((entry) => {
    //                 if (entry.isIntersecting) {
    //                     setTypeStarted(true);
    //                 }
    //             });
    //         },
    //         { threshold: 0.35 }
    //     );

    //     observer.observe(messageRef.current);

    //     return () => observer.disconnect();
    // }, []);

    const launchConfetti = () => {
        const centerX =
            typeof window !== "undefined" ? window.innerWidth / 2 : 600;
        const centerY =
            typeof window !== "undefined" ? window.innerHeight / 2 - 80 : 300;

        const pieces: ConfettiPiece[] = Array.from({ length: 120 }).map(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 120 + Math.random() * 260;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance + 150;

            return {
                id: confettiIdRef.current++,
                left: centerX,
                top: centerY,
                x,
                y,
                rotate: Math.random() * 720,
                color:
                    confettiColors[Math.floor(Math.random() * confettiColors.length)],
                width: 6 + Math.random() * 8,
                height: 8 + Math.random() * 12,
                duration: 1200 + Math.random() * 900,
            };
        });

        setConfetti((prev) => [...prev, ...pieces]);

        const maxDuration = Math.max(...pieces.map((p) => p.duration));
        window.setTimeout(() => {
            setConfetti((prev) =>
                prev.filter((item) => !pieces.some((piece) => piece.id === item.id))
            );
        }, maxDuration + 100);
    };

    const handleOpenGift = () => {
        if (giftOpened) return;
        setGiftOpened(true);
        launchConfetti();
    };

    // const handleBlowCandles = () => {
    //     const next = !blown;
    //     setBlown(next);
    //     if (next) {
    //         setWishText("✨ ขอให้พรวันเกิดนี้เป็นจริงทุกข้อเลยนะ");
    //         launchConfetti();
    //     } else {
    //         setWishText("");
    //     }
    // };

    // const handleStartBalloons = () => {
    //     const zoneWidth = balloonZoneRef.current?.clientWidth ?? 900;
    //     const newItems: BalloonItem[] = Array.from({ length: 10 }).map((_, i) => ({
    //         id: balloonIdRef.current++,
    //         text: wishes[i % wishes.length],
    //         left: Math.max(0, Math.random() * (zoneWidth - 100)),
    //         duration: 6 + Math.random() * 4,
    //         styleIndex: Math.floor(Math.random() * balloonGradients.length),
    //     }));

    //     setBalloons((prev) => [...prev, ...newItems]);

    //     window.setTimeout(() => {
    //         setBalloons((prev) =>
    //             prev.filter((item) => !newItems.some((newItem) => newItem.id === item.id))
    //         );
    //     }, 11000);
    // };

    // const handleUnlock = () => {
    //     if (!birthdayInput.trim()) {
    //         setUnlockResult("กรุณากรอกวันเกิดก่อน");
    //         return;
    //     }

    //     if (birthdayInput.trim() === "18/12") {
    //         setUnlockResult(
    //             "🎉 ปลดล็อกสำเร็จ: คุณคือคนพิเศษมาก ๆ และสมควรได้รับสิ่งดี ๆ ที่สุด"
    //         );
    //         launchConfetti();
    //     } else {
    //         setUnlockResult("ยังไม่ถูกน้า ลองอีกครั้ง ✨");
    //     }
    // };

    // const toggleMusic = async () => {
    //     try {
    //         if (!audioRef.current) return;

    //         if (!musicPlaying) {
    //             await audioRef.current.play();
    //             setMusicPlaying(true);
    //         } else {
    //             audioRef.current.pause();
    //             setMusicPlaying(false);
    //         }
    //     } catch {
    //         alert("ยังไม่ได้ใส่ไฟล์เพลงใน audio tag");
    //     }
    // };

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center px-5 py-10 text-center">
            <h1 className="text-4xl font-bold text-pink-600 sm:text-6xl">
                Happy Birthday 🎂
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-rose-900/80 sm:text-lg">
                เว็บอวยพรเล็ก ๆ ที่ตั้งใจทำมาเพื่อวันพิเศษของคุณ
            </p>

            <button
                type="button"
                onClick={handleOpenGift}
                className="group relative mt-8 h-[220px] w-[220px] cursor-pointer transition hover:scale-105"
                aria-label="Open gift box"
            >
                <span
                    className={`absolute left-[-8px] top-[30px] z-20 h-[46px] w-[236px] rounded-xl bg-gradient-to-br from-pink-200 to-pink-400 shadow-xl transition-all duration-700 ${giftOpened
                        ? "left-[-24px] top-0 -translate-x-8 -translate-y-8 -rotate-[28deg]"
                        : ""
                        }`}
                />
                <span className="absolute bottom-0 left-0 h-[150px] w-[220px] rounded-xl bg-gradient-to-br from-pink-300 to-pink-500 shadow-xl" />
                <span className="absolute left-[96px] top-0 z-30 h-[220px] w-7 rounded-lg bg-amber-300" />
                <span className="absolute left-0 top-[46px] z-30 h-6 w-[220px] rounded-lg bg-amber-300" />

                <span className="absolute left-[68px] top-0 z-40 h-[52px] w-[84px]">
                    <span className="absolute left-0 top-1 h-10 w-10 rotate-45 rounded-[50%_50%_50%_0] border-[10px] border-amber-300" />
                    <span className="absolute right-0 top-1 h-10 w-10 scale-x-[-1] rotate-45 rounded-[50%_50%_50%_0] border-[10px] border-amber-300" />
                </span>
            </button>

            <div
                className={`mt-8 transition-all duration-700 ${showSurpriseText
                    ? "translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none translate-y-4 scale-95 opacity-0"
                    }`}
            >
                <h2 className="text-2xl font-bold text-rose-700">🎁 Surprise!</h2>
                <p className="mx-auto mt-2 max-w-xl text-rose-900/80">
                    ขอให้วันนี้เต็มไปด้วยรอยยิ้ม ความสุข และสิ่งดี ๆ ตลอดทั้งปี
                </p>
                <a
                    href="#memories"
                    className="mt-5 inline-flex rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5"
                >
                    ดูความทรงจำต่อ
                </a>
            </div>

            <p className="mt-8 text-sm text-rose-900/70 animate-bounce-hint">
                กดเปิดกล่องของขวัญ
            </p>
        </section>
    )
}