"use client";

import { useEffect, useRef, useState } from "react";

type SlideInIconProps = {
  title?: string;
};

export default function SlideInIcon({
  title = "มีใครบางคนถือป้ายมาหาเธอ...",
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
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-pink-600">
          Birthday Surprise
        </p>

        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

        <p className="mt-3 text-slate-600">
          มีตุ๊กตาหมีตัวหนึ่งถือป้ายบางอย่างมาหาเธอ...
        </p>
      </div>

      {/* BEAR */}
      <div className="relative h-40 w-40 shrink-0">

        <div
          className={`
            absolute top-1/2 -translate-y-1/2 transform transition-all duration-1000 ease-out
            ${
              isVisible
                ? "right-0 opacity-100 translate-x-0"
                : "-right-52 opacity-0 translate-x-20"
            }
          `}
        >
          <div className="relative flex flex-col items-center">

            {/* SIGN */}
            <div className="mb-2 rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white shadow-md animate-bounce">
              HBD 🎉
            </div>

            {/* BEAR FACE */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-amber-300 shadow-lg">

              {/* ears */}
              <div className="absolute -left-3 -top-3 h-8 w-8 rounded-full bg-amber-300"></div>
              <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-amber-300"></div>

              {/* eyes */}
              <div className="absolute left-7 top-10 h-2 w-2 rounded-full bg-black"></div>
              <div className="absolute right-7 top-10 h-2 w-2 rounded-full bg-black"></div>

              {/* nose */}
              <div className="absolute top-14 h-3 w-4 rounded-full bg-amber-800"></div>

              {/* mouth */}
              <div className="absolute top-[68px] h-2 w-6 rounded-b-full border-b-2 border-amber-900"></div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}