"use client";

import { useEffect, useRef } from "react";
import { brushRadius, revealThreshold, userWidth, userHeight } from "../utils/data";
import { confettiState, scratchCardState } from "../utils/hooks";
import { launchConfetti } from "../utils/functions";

export default function ScratchCardImg({ nextStep }: { nextStep: () => void }) {
	const confettiIdRef = useRef(2)
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const isDrawingRef = useRef(false);
	const revealedRef = useRef(false);
	const { confetti, setConfetti } = confettiState()
	const { mounted, setmouted, progress, setprogress, isRevealed, setisRevealed, isFading, setisFading, cardSize, setCardSize } = scratchCardState()
	useEffect(() => {
		setmouted(true)
	}, [])
	useEffect(() => {
		if (progress === revealThreshold) {
			launchConfetti(confettiIdRef, setConfetti);
		}
	}, [progress])

	const isMobile = cardSize.width < 720;
	const actualBrushRadius = isMobile ? Math.max(26, brushRadius * 0.6) : brushRadius;

	const initCanvas = (renderWidth: number, renderHeight: number) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = Math.floor(renderWidth * dpr);
		canvas.height = Math.floor(renderHeight * dpr);
		console.log("canvas.", canvas.width, canvas.height);
		canvas.style.width = `${renderWidth}px`;
		canvas.style.height = `${renderHeight}px`;
		console.log("canvas.style", canvas.style.width, canvas.style.height);
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
		ctx.textAlign = "center";
		ctx.font = isMobile ? "700 24px sans-serif" : "700 34px sans-serif";
		ctx.fillStyle = "rgba(255,255,255,0.95)";
		ctx.fillText("Scratch Me ✨", renderWidth / 2, renderHeight / 2);
		// ctx.font = isMobile ? "500 13px sans-serif" : "500 16px sans-serif";
		// ctx.fillStyle = "rgba(255,255,255,0.92)";
		// ctx.fillText(
		//     "ลากเพื่อเปิดเซอร์ไพรส์วันเกิด",
		//     renderWidth / 2,
		//     renderHeight / 2 + (isMobile ? 24 : 28)
		// );
		setprogress(0);
		setisRevealed(false);
		revealedRef.current = false;
	};

	useEffect(() => {
		if (typeof window === "undefined") return;
		const updateSize = () => {
			const wrapper = containerRef.current;
			if (!wrapper) return;
			const current = window.innerWidth;
			const aspectRatio = window.innerWidth / window.innerHeight;
			const parentWidth = wrapper.clientWidth;
			const nextWidth = Math.min(current, parentWidth, userWidth);
			const recommendRatio = Math.round(nextWidth / aspectRatio);
			const nextHeight = Math.min(recommendRatio, userHeight);
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
	}, [mounted, setCardSize]);

	useEffect(() => {
		if (!cardSize.width || !cardSize.height) return;
		initCanvas(cardSize.width, cardSize.height);
	}, [cardSize.width, cardSize.height]);

	const getPoint = (e: | React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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
			setisFading(true);
			setTimeout(() => {
				const c = canvasRef.current;
				if (!c) return;
				const clearCtx = c.getContext("2d");
				if (!clearCtx) return;
				clearCtx.clearRect(0, 0, c.width, c.height);
			}, 1000);
			nextStep()
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
		isDrawingRef.current = true;
		const point = getPoint(e);
		if (!point) return;
		scratchAt(point.x, point.y);
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawingRef.current) return;
		const point = getPoint(e);
		if (!point) return;
		scratchAt(point.x, point.y);
	};

	const handleTouchEnd = () => {
		isDrawingRef.current = false;
	};


	return (
		// min-h-screen
		<section className="relative flex flex-col items-center p-5">
			<p className="mt-6 text-3xl font-bold text-pink-600">
				ลองขูดการ์ดดูสิ!
			</p>
			<p className="mt-3 text-center text-rose-900/80">
				ในการ์ดมีอะไรซ่อนอยู่น้าาา
			</p>
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
			<div className="flex w-full p-2 justify-center">
				{
					mounted &&
					<div ref={containerRef} style={{ minWidth: cardSize.width, minHeight: cardSize.height }} className="flex justify-center rounded-3xl border shadow-2xl border-white/70 bg-white/70 p-2">
						<div
							className="flex items-center justify-center relative overflow-hidden rounded-2xl border border-rose-100 bg-linear-to-br from-rose-100 via-pink-50 to-white"
							style={{ width: cardSize.width, height: cardSize.height }}>
							<canvas
								ref={canvasRef}
								className={`absolute z-10 transition-opacity duration-500 touch-none ${isRevealed ? "pointer-events-none" : "cursor-crosshair"
									}`}
								style={{
									opacity: isFading ? 0 : 1
								}}
								onMouseDown={handleMouseDown}
								onMouseMove={handleMouseMove}
								onMouseUp={handleMouseUp}
								onMouseLeave={handleMouseUp}
								onTouchStart={handleTouchStart}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
							/>
							<img className="object-cover w-full h-full" src="/img/5.png" />
						</div>
					</div>
				}
			</div>
			<div className="mt-4 rounded-[18px] bg-white/80 p-4 shadow-sm sm:mt-5 sm:rounded-[20px]">
				<p className="text-sm font-medium text-rose-600">
					{isRevealed
						? "ยังมีอันต่อไปนะ 💌"
						: "ค่อยๆ ขูดนะ✨"}
				</p>
			</div>
		</section>
	);
}