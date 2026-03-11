"use client"
import { useEffect, useMemo, useRef, useState } from "react";

const typewriterMessage =
  "สุขสันต์วันเกิดนะ 🎂\nขอให้วันนี้เป็นวันที่อบอุ่น เต็มไปด้วยรอยยิ้ม และความรักจากทุกคนรอบตัว\nขอให้ทุกความตั้งใจของคุณสำเร็จทีละเรื่อง และขอให้ปีนี้เป็นปีที่ใจดีกับคุณมากที่สุด ✨";


export default function TypingText() {


  const [typedText, setTypedText] = useState("");
  const [typeStarted, setTypeStarted] = useState(false);
  const messageRef = useRef<HTMLDivElement | null>(null);



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


  return (
    <main className="relative overflow-x-hidden bg-linear-to-br from-white via-pink-50 to-rose-100 text-rose-950">
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
    </main>
  );
}