"use client";
import { useState } from "react";


export default function FlipPhotoCard({ nextStep }: { nextStep: () => void }) {
	const [flipped, setFlipped] = useState(false);
	const frontText = "กดเพื่อเปิดการ์ด"
	const imageSrc = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80"
	const imageAlt = "photo card"
	const width = 320
	const height = 420
	return (
		<button type="button" onClick={() => setFlipped((prev) => !prev)}>
			<div
				className="relative transition-transform duration-700 ease-in-out"
				style={{
					width: `${width}px`,
					height: `${height}px`,
					transformStyle: "preserve-3d",
					transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
			>
				{/* ด้านหน้า */}
				<div
					className="absolute inset-0 flex flex-col items-center justify-center rounded-[28px] border border-rose-200 bg-gradient-to-br from-rose-400 via-pink-400 to-fuchsia-500 p-6 text-white shadow-xl"
					style={{ backfaceVisibility: "hidden" }}
				>
					<div className="mb-4 text-5xl">🎁</div>
					<h2 className="text-2xl font-bold">{frontText}</h2>
					<p className="mt-3 text-sm text-white/90">
						แตะหรือคลิกเพื่อพลิกการ์ด
					</p>
				</div>

				{/* ด้านหลัง */}
				<div
					className="absolute inset-0 overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-xl"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				>
					<div className="relative h-full w-full">
						<img
							src={imageSrc}
							alt={imageAlt}
							className="object-cover"
						/>
					</div>
				</div>
			</div>
		</button>
	);
}