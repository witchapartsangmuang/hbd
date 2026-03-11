"use client";

import { useEffect, useRef, useState } from "react";
import { brushRadius, revealThreshold } from "../utils/data";
import { confettiState, scratchCardState } from "../utils/hooks";
import { launchConfetti } from "../utils/functions";
type ScratchCardProps = {
  maxWidth?: number;
  aspectRatio?: number; // width / height
  onSuccess?: () => void;
  nextStep: () => void;
};

export default function ScratchCard({
  maxWidth = 820,
  aspectRatio = 820 / 420,
  onSuccess,
  nextStep
}: ScratchCardProps) {

  const confettiIdRef = useRef(2)
  const { confetti, setConfetti } = confettiState()



  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const revealedRef = useRef(false);
  const { progress, setprogress, isRevealed, setisRevealed } = scratchCardState()
  const [cardSize, setCardSize] = useState({ width: 320, height: 164 });
  useEffect(() => {
    if (progress === revealThreshold) {
      launchConfetti(confettiIdRef, setConfetti);
    }
  }, [progress])
  const isMobile = cardSize.width < 640;
  const actualBrushRadius = isMobile
    ? Math.max(18, brushRadius * 0.78)
    : brushRadius;

  const initCanvas = (renderWidth: number, renderHeight: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(renderWidth * dpr);
    canvas.height = Math.floor(renderHeight * dpr);
    canvas.style.width = `${renderWidth}px`;
    canvas.style.height = `${renderHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, renderWidth, renderHeight);
    gradient.addColorStop(0, "#f9a8d4");
    gradient.addColorStop(0.5, "#fb7185");
    gradient.addColorStop(1, "#f472b6");

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, renderWidth, renderHeight);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, renderWidth, renderHeight);

    for (let i = 0; i < 36; i++) {
      const x = Math.random() * renderWidth;
      const y = Math.random() * renderHeight;
      const size = 8 + Math.random() * 16;
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.textAlign = "center";

    ctx.font = isMobile ? "700 24px sans-serif" : "700 34px sans-serif";
    ctx.fillText("Scratch Me ✨", renderWidth / 2, renderHeight / 2 - 6);

    ctx.font = isMobile ? "500 13px sans-serif" : "500 16px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillText(
      "ลากเพื่อเปิดเซอร์ไพรส์วันเกิด",
      renderWidth / 2,
      renderHeight / 2 + (isMobile ? 24 : 28)
    );

    setprogress(0);
    setisRevealed(false);
    revealedRef.current = false;
  };

  useEffect(() => {
    const updateSize = () => {
      const wrapper = containerRef.current;
      if (!wrapper) return;

      const parentWidth = wrapper.clientWidth;
      const nextWidth = Math.min(parentWidth, maxWidth);
      const nextHeight = Math.round(nextWidth / aspectRatio);

      setCardSize({
        width: nextWidth,
        height: nextHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [maxWidth, aspectRatio]);

  useEffect(() => {
    if (!cardSize.width || !cardSize.height) return;
    initCanvas(cardSize.width, cardSize.height);
  }, [cardSize.width, cardSize.height]);

  const getPoint = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(x, y, actualBrushRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, actualBrushRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    calculateProgress();
  };

  const calculateProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 20) transparentCount++;
    }

    const percent = Math.round((transparentCount / totalPixels) * 100);
    setprogress(percent);

    if (percent >= revealThreshold && !revealedRef.current) {
      revealedRef.current = true;
      setisRevealed(true);
      onSuccess?.();

      setTimeout(() => {
        const c = canvasRef.current;
        if (!c) return;
        const clearCtx = c.getContext("2d");
        if (!clearCtx) return;
        clearCtx.clearRect(0, 0, c.width, c.height);
      }, 120);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const point = getPoint(e);
    if (!point) return;
    scratchAt(point.x, point.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const point = getPoint(e);
    if (!point) return;
    scratchAt(point.x, point.y);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const point = getPoint(e);
    if (!point) return;
    scratchAt(point.x, point.y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const point = getPoint(e);
    if (!point) return;
    scratchAt(point.x, point.y);
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
  };

  const handleReset = () => {
    initCanvas(cardSize.width, cardSize.height);
  };

  return (
    <section
      className="relative flex flex-col items-center min-h-screen p-5"
    // className="w-full max-w-5xl rounded-[24px] border border-pink-100 bg-gradient-to-br from-white via-rose-50 to-pink-100 p-3 shadow-xl sm:rounded-[32px] sm:p-6"
    >
      <p className="mt-6 text-3xl font-bold text-pink-600">
        ลองขูดการ์ดดูสิ!
      </p>
      <p className="mt-3 text-center text-rose-900/80">
        ในการ์ดมีอะไรซ่อนอยู่น้าาา
      </p>

      {/* <div className="mb-4 flex flex-col gap-4 rounded-[20px] bg-white/85 p-4 shadow-sm sm:mb-5 sm:rounded-[24px] sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500 sm:text-sm">
            Birthday Mini Game
          </p>
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Scratch Card 🎁
          </h2>
          <p className="mt-2 text-xs text-slate-600 sm:text-sm">
            ลากเพื่อขูดการ์ดและเปิดข้อความเซอร์ไพรส์
          </p>
        </div>
      </div> */}
      {/* <div className="grid w-full grid-cols-3 gap-2 md:flex md:w-auto md:flex-wrap md:items-center md:gap-3">
        <div className="rounded-2xl bg-rose-100 px-3 py-3 text-center sm:px-4">
          <p className="text-[10px] text-rose-700 sm:text-xs">Revealed</p>
          <p className="text-xl font-bold text-rose-600 sm:text-2xl">
            {progress}%
          </p>
        </div>
        <div className="rounded-2xl bg-pink-100 px-3 py-3 text-center sm:px-4">
          <p className="text-[10px] text-pink-700 sm:text-xs">Target</p>
          <p className="text-xl font-bold text-pink-600 sm:text-2xl">
            {revealThreshold}%
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-95"
        >
          รีเซ็ต
        </button>
      </div> */}
      <div className="w-full z-1000 h-1">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="confetti-piece pointer-events-none absolute z-9999 block rounded-sm"
            style={
              {
                left: `${piece.left}px`,
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                backgroundColor: piece.color,
                animationDuration: `${piece.duration}ms`,
                ["--tx" as string]: `${piece.x}px`,
                ["--ty" as string]: `${piece.y}px`,
                ["--rot" as string]: `${piece.rotate}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="w-full rounded-3xl border p-2 shadow-2xl border-white/70 bg-white/70"
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-rose-100 bg-linear-to-br from-rose-100 via-pink-50 to-white"
          style={{ width: "100%", height: cardSize.height }}
        // style={{ width: cardSize.width, height: cardSize.height }}
        >

          eee
          {/* <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,#fff1f7,#ffe4ef_55%,#ffd5e6)] px-4 text-center sm:px-6">
            <div className="mb-3 text-4xl sm:mb-4 sm:text-6xl">🎂💖🎉</div>

            <h3 className="text-2xl font-bold text-rose-600 sm:text-3xl">
              สุขสันต์วันเกิดนะ
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700 sm:mt-4 sm:text-base sm:leading-7">
              ขอให้ปีนี้เต็มไปด้วยรอยยิ้ม ความสุข ความสำเร็จ
              และเรื่องดี ๆ ที่เข้ามาแบบไม่ขาดสายเลย ✨
            </p>

            <p className="mt-2 text-xs text-rose-500 sm:mt-3 sm:text-sm">
              ขอให้ทุกวันของคุณน่ารักพอ ๆ กับวันนี้นะ
            </p>

            {isRevealed && (
              <div className="mt-4 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow sm:mt-6 sm:px-5 sm:text-sm">
                เปิดสำเร็จแล้ว 🎁
              </div>
            )}
          </div> */}

          <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-10 touch-none ${isRevealed ? "pointer-events-none" : "cursor-crosshair"
              }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      </div>

      <div className="mt-4 rounded-[18px] bg-white/80 p-4 shadow-sm sm:mt-5 sm:rounded-[20px]">
        <p className="text-sm font-medium text-rose-600">
          {isRevealed
            ? "เปิดการ์ดสำเร็จแล้ว พร้อมไปดูเซอร์ไพรส์ถัดไปได้เลย 💌"
            : "ขูดให้เกินเปอร์เซ็นต์เป้าหมายเพื่อเปิดข้อความลับ ✨"}
        </p>
      </div>
    </section>
  );
}