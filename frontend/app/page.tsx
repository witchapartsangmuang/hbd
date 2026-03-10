"use client";

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

export default function Page() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [showSurpriseText, setShowSurpriseText] = useState(false);

  const [blown, setBlown] = useState(false);
  const [wishText, setWishText] = useState("");

  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const balloonIdRef = useRef(1);
  const balloonZoneRef = useRef<HTMLDivElement | null>(null);

  const [typedText, setTypedText] = useState("");
  const [typeStarted, setTypeStarted] = useState(false);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const [birthdayInput, setBirthdayInput] = useState("");
  const [unlockResult, setUnlockResult] = useState("");

  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const confettiIdRef = useRef(1);

  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sparkles = useMemo(
    () => [
      { emoji: "✨", className: "top-[8%] left-[10%] animate-float" },
      { emoji: "🎈", className: "top-[18%] right-[12%] animate-float-delayed" },
      { emoji: "🎉", className: "top-[52%] left-[6%] animate-float-slow" },
      { emoji: "🎂", className: "bottom-[18%] right-[7%] animate-float" },
    ],
    []
  );

  useEffect(() => {
    if (!giftOpened) return;
    const timer = setTimeout(() => setShowSurpriseText(true), 500);
    return () => clearTimeout(timer);
  }, [giftOpened]);

  useEffect(() => {
    if (!typeStarted) return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTypedText(typewriterMessage.slice(0, i));
      if (i >= typewriterMessage.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [typeStarted]);

  useEffect(() => {
    if (!messageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTypeStarted(true);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(messageRef.current);

    return () => observer.disconnect();
  }, []);

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

  const handleBlowCandles = () => {
    const next = !blown;
    setBlown(next);
    if (next) {
      setWishText("✨ ขอให้พรวันเกิดนี้เป็นจริงทุกข้อเลยนะ");
      launchConfetti();
    } else {
      setWishText("");
    }
  };

  const handleStartBalloons = () => {
    const zoneWidth = balloonZoneRef.current?.clientWidth ?? 900;
    const newItems: BalloonItem[] = Array.from({ length: 10 }).map((_, i) => ({
      id: balloonIdRef.current++,
      text: wishes[i % wishes.length],
      left: Math.max(0, Math.random() * (zoneWidth - 100)),
      duration: 6 + Math.random() * 4,
      styleIndex: Math.floor(Math.random() * balloonGradients.length),
    }));

    setBalloons((prev) => [...prev, ...newItems]);

    window.setTimeout(() => {
      setBalloons((prev) =>
        prev.filter((item) => !newItems.some((newItem) => newItem.id === item.id))
      );
    }, 11000);
  };

  const handleUnlock = () => {
    if (!birthdayInput.trim()) {
      setUnlockResult("กรุณากรอกวันเกิดก่อน");
      return;
    }

    if (birthdayInput.trim() === "18/12") {
      setUnlockResult(
        "🎉 ปลดล็อกสำเร็จ: คุณคือคนพิเศษมาก ๆ และสมควรได้รับสิ่งดี ๆ ที่สุด"
      );
      launchConfetti();
    } else {
      setUnlockResult("ยังไม่ถูกน้า ลองอีกครั้ง ✨");
    }
  };

  const toggleMusic = async () => {
    try {
      if (!audioRef.current) return;

      if (!musicPlaying) {
        await audioRef.current.play();
        setMusicPlaying(true);
      } else {
        audioRef.current.pause();
        setMusicPlaying(false);
      }
    } catch {
      alert("ยังไม่ได้ใส่ไฟล์เพลงใน audio tag");
    }
  };

  return (
    <main className="relative overflow-x-hidden bg-linear-to-br from-white via-pink-50 to-rose-100 text-rose-950">
      {sparkles.map((item, index) => (
        <div
          key={index}
          className={`pointer-events-none absolute z-10 text-xl opacity-70 ${item.className}`}
        >
          {item.emoji}
        </div>
      ))}

      {confetti.map((piece) => (
        <span
          key={piece.id}
          className="pointer-events-none fixed z-[9999] block rounded-sm"
          style={{
            left: piece.left,
            top: piece.top,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            animation: `confetti-fly ${piece.duration}ms cubic-bezier(.2,.8,.2,1) forwards`,
            transform: `translate(${piece.x}px, ${piece.y}px) rotate(${piece.rotate}deg)`,
          }}
        />
      ))}

      <audio ref={audioRef} loop>
        <source src="/music/happy-birthday.mp3" type="audio/mpeg" />
      </audio>

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
          className="group relative mt-8 h-55 w-55 cursor-pointer transition hover:scale-105"
          aria-label="Open gift box"
        >
          <span
            className={`absolute left-[-8px] top-[30px] z-20 h-[46px] w-[236px] rounded-xl bg-linear-to-br from-pink-200 to-pink-400 shadow-xl transition-all duration-700 ${giftOpened
                ? "left-[-24px] top-0 -translate-x-8 -translate-y-8 -rotate-[28deg]"
                : ""
              }`}
          />
          <span className="absolute bottom-0 left-0 h-[150px] w-55 rounded-xl bg-linear-to-br from-pink-300 to-pink-500 shadow-xl" />
          <span className="absolute left-[96px] top-0 z-30 h-55 w-7 rounded-lg bg-amber-300" />
          <span className="absolute left-0 top-[46px] z-30 h-6 w-55 rounded-lg bg-amber-300" />

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
            className="mt-5 inline-flex rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5"
          >
            ดูความทรงจำต่อ
          </a>
        </div>

        <p className="mt-8 text-sm text-rose-900/70 animate-bounce-hint">
          กดเปิดกล่องของขวัญ
        </p>
      </section>

      <section
        id="memories"
        className="flex min-h-screen flex-col items-center justify-center px-5 py-16"
      >
        <h2 className="text-center text-3xl font-bold text-rose-700">
          📸 Birthday Memory Cards
        </h2>
        <p className="mt-3 max-w-2xl text-center text-rose-900/80">
          รูปการ์ดจะค่อย ๆ ปรากฏขึ้นเมื่อเลื่อนมาถึงส่วนนี้
        </p>

        <div className="mt-10 flex max-w-6xl flex-wrap justify-center gap-6">
          {[
            {
              emoji: "🌸",
              caption: "ขอให้ทุกวันสดใสเหมือนรอยยิ้มของคุณ",
              rotate: "-rotate-6",
            },
            {
              emoji: "🎁",
              caption: "ขอให้มีแต่เซอร์ไพรส์ดี ๆ เข้ามาในชีวิต",
              rotate: "rotate-3",
            },
            {
              emoji: "✨",
              caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
              rotate: "-rotate-3",
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`w-65 rounded-2xl bg-white p-4 pb-5 shadow-xl ${card.rotate} transition duration-300 hover:-translate-y-1`}
            >
              <div className="flex h-[250px] items-center justify-center rounded-xl bg-linear-to-br from-pink-100 via-rose-200 to-amber-100 text-6xl">
                {card.emoji}
              </div>
              <p className="mt-3 text-center font-semibold text-rose-900">
                {card.caption}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
        <h2 className="text-center text-3xl font-bold text-rose-700">
          🎂 Make a Wish
        </h2>
        <p className="mt-3 max-w-2xl text-center text-rose-900/80">
          ลองกดปุ่มเพื่อเป่าเทียน แล้วอธิษฐานในใจได้เลย
        </p>

        <div className="relative mt-8 h-65 w-65">
          <div className="absolute bottom-6.25 left-5 h-4.5 w-55 rounded-full bg-zinc-300" />
          <div className="absolute bottom-10.75 left-10 h-21.25 w-45 rounded-xl bg-linear-to-br from-pink-300 to-pink-500" />
          <div className="absolute bottom-9.5 left-10 h-3.5 w-45 rounded-full bg-rose-50" />
          <div className="absolute bottom-30 left-15.5 h-15 w-34 rounded-xl bg-linear-to-br from-pink-100 to-pink-300" />
          <div className="absolute bottom-28.75 left-15.5 h-3.5 w-34 rounded-full bg-rose-50" />

          {[92, 124, 156].map((left, index) => (
            <div
              key={index}
              className="absolute bottom-44.5 h-11 w-3 rounded-md bg-blue-300"
              style={{ left }}
            >
              <div
                className={`absolute -top-4.5 left-1/2 h-5 w-4 -translate-x-1/2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[radial-gradient(circle_at_50%_30%,#fff6b0,#ffb300_65%,#ff7a00_100%)] shadow-[0_0_18px_rgba(255,170,0,0.65)] transition ${blown ? "scale-0 opacity-0" : "animate-flicker"
                  }`}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleBlowCandles}
          className="mt-6 rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5"
        >
          {blown ? "จุดเทียนอีกครั้ง 🔥" : "เป่าเทียน 🕯️"}
        </button>

        <p className="mt-4 text-center font-semibold text-rose-700">{wishText}</p>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
        <h2 className="text-center text-3xl font-bold text-rose-700">
          🎈 Floating Wishes
        </h2>
        <p className="mt-3 max-w-2xl text-center text-rose-900/80">
          คำอวยพรเล็ก ๆ จะลอยขึ้นไปบนฟ้า
        </p>

        <button
          type="button"
          onClick={handleStartBalloons}
          className="mt-6 rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5"
        >
          ปล่อยบอลลูน
        </button>

        <div
          ref={balloonZoneRef}
          className="relative mt-8 h-[420px] w-full max-w-5xl overflow-hidden"
        >
          {balloons.map((balloon) => (
            <div
              key={balloon.id}
              className={`animate-rise absolute bottom-[-120px] flex h-[110px] w-[90px] items-center justify-center rounded-[50%_50%_45%_45%] bg-linear-to-br ${balloonGradients[balloon.styleIndex]} px-2 text-center text-xs leading-5 text-white shadow-xl`}
              style={{
                left: balloon.left,
                animationDuration: `${balloon.duration}s`,
              }}
            >
              {balloon.text}
              <span className="absolute left-1/2 top-[108px] h-[70px] w-[2px] -translate-x-1/2 bg-zinc-400" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
        <h2 className="text-center text-3xl font-bold text-rose-700">
          💌 A Special Message
        </h2>

        <div className="mt-8 w-full max-w-4xl rounded-3xl border border-white/60 bg-white/70 p-7 shadow-xl backdrop-blur">
          <div
            ref={messageRef}
            className="min-h-[140px] whitespace-pre-line text-lg leading-8 text-rose-900"
          >
            <span className="typewriter-cursor">{typedText}</span>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
        <h2 className="text-center text-3xl font-bold text-rose-700">
          🔐 Secret Birthday Unlock
        </h2>

        <div className="mt-8 w-full max-w-2xl rounded-3xl bg-white p-7 text-center shadow-xl">
          <p className="text-rose-900">
            กรอกวันเกิดของคุณในรูปแบบ <b>DD/MM</b> เพื่อปลดล็อกข้อความพิเศษ
          </p>

          <input
            value={birthdayInput}
            onChange={(e) => setBirthdayInput(e.target.value)}
            placeholder="เช่น 18/12"
            className="mt-4 w-full max-w-xs rounded-2xl border border-rose-200 px-4 py-3 text-center outline-none ring-0 transition focus:border-pink-400"
          />

          <div className="mt-4">
            <button
              type="button"
              onClick={handleUnlock}
              className="rounded-full bg-linear-to-r from-indigo-500 to-blue-600 px-6 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5"
            >
              ปลดล็อก
            </button>
          </div>

          <div className="mt-4 min-h-8 font-bold text-pink-600">{unlockResult}</div>

          <p className="mt-2 text-sm text-rose-900/60">
            ตอนนี้ตั้งค่าให้รหัสตัวอย่างคือ 18/12 แก้ได้ใน JavaScript
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center">
        <h1 className="text-4xl font-bold text-pink-600 sm:text-6xl">
          สุขสันต์วันเกิดนะ 🎉
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-rose-900/80 sm:text-lg">
          ขอให้คุณเจอแต่คนดี ๆ งานดี ๆ โอกาสดี ๆ และมีความสุขมากขึ้นทุกวัน
        </p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="mt-6 inline-flex rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5"
        >
          กลับขึ้นบนสุด
        </a>
      </section>

      <button
        type="button"
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-5 py-3 font-medium text-white shadow-xl transition hover:-translate-y-0.5"
      >
        {musicPlaying ? "⏸ ปิดเพลง" : "🎵 เปิดเพลง"}
      </button>

      <div id="top" />
    </main>
  );
}