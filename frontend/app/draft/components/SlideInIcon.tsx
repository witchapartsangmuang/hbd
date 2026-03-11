"use client";

import { useEffect, useRef, useState } from "react";

type SlideInIconProps = {
  title?: string;
};

export default function SlideInIcon({
  title = "เมื่อ component นี้เข้าจอ icon จะเลื่อนเข้ามา",
}: SlideInIconProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // ถ้าต้องการให้ animation เล่นแค่ครั้งเดียว
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative mx-auto my-24 flex min-h-[280px] max-w-4xl items-center justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
    >
      <div className="max-w-xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Scroll Trigger Animation
        </p>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-3 text-slate-600">
          พอ section นี้โผล่เข้ามาในหน้าจอ icon ทางขวาจะเลื่อนจากนอกจอเข้ามา
        </p>
      </div>

      <div className="relative h-32 w-32 shrink-0">
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 transform transition-all duration-1000 ease-out
            ${
              isVisible
                ? "right-0 opacity-100 translate-x-0"
                : "-right-40 opacity-0 translate-x-16"
            }
          `}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 shadow-lg">
            <div className="h-10 w-10 " >aaa</div>
          </div>
        </div>
      </div>
    </section>
  );
}