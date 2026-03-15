"use client";

import { useEffect } from "react";
import { flipPhotoCardState } from "../utils/hooks";
import { catImg, dogImg } from "../utils/data";

export default function FlipPhotoCard({ nextStep }: { nextStep: () => void }) {
	const { flipped, setflipped, imgSelect, setimgSelect } = flipPhotoCardState();
	useEffect(() => {
		if (imgSelect === "") return;
		setflipped(true);
		nextStep()
	}, [imgSelect, setflipped]);
	return (
		<section className="relative flex flex-col items-center min-h-screen p-5">
			<div className="relative z-10 w-full max-w-md">
				{/* heading */}
				<div className="mb-6 text-center sm:mb-8">
					<h1 className="text-2xl font-extrabold tracking-tight text-rose-600 sm:text-3xl">
						Photo Flip Card
					</h1>
					<p className="mt-2 text-sm text-slate-600 sm:text-base">
						เลือกสิ่งที่ชอบ แล้วการ์ดจะพลิกเผยรูปด้านใน
					</p>
				</div>

				{/* card area */}
				<div
					className="mx-auto"
					style={{
						perspective: "1400px",
					}}
				>
					<div
						className="relative mx-auto transition-transform duration-700 ease-in-out"
						style={{
							width: "min(100%, 340px)",
							aspectRatio: "320 / 420",
							transformStyle: "preserve-3d",
							transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
						}}
					>
						{/* front */}
						<div
							className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-[28px] border border-rose-200 bg-linear-to-br from-rose-400 via-pink-400 to-fuchsia-500 p-6 text-center text-white shadow-[0_20px_60px_rgba(236,72,153,0.28)] sm:p-8"
							style={{ backfaceVisibility: "hidden" }}
						>
							<div className="mb-4 text-5xl drop-shadow sm:text-6xl">🎁</div>
							<p className="mt-3 max-w-55 text-sm leading-relaxed text-white/90 sm:text-base">
								เลือก “หมา 🐶” หรือ “แมว 🐱” ด้านล่างเพื่อเปิดการ์ด
							</p>

							{!imgSelect && (
								<div className="mt-5 rounded-full bg-white/20 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
									ยังไม่ได้เลือกรูป
								</div>
							)}
						</div>

						{/* back */}
						<div
							className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
							style={{
								backfaceVisibility: "hidden",
								transform: "rotateY(180deg)",
							}}
						>
							<div className="relative h-full w-full">
								{imgSelect ? (
									<>
										<img
											src={imgSelect}
											alt="photo card"
											className="h-full w-full object-cover"
										/>
										{/* <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 via-black/10 to-transparent p-4 text-white">
											<p className="text-sm font-medium sm:text-base">
												เปิดการ์ดสำเร็จแล้ว ✨
											</p>
										</div> */}
									</>
								) : (
									<div className="flex h-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 text-slate-500">
										<p className="text-sm sm:text-base">ยังไม่มีรูปที่เลือก</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* action buttons */}
				<div className="mt-3 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-md sm:mt-8 sm:p-5">
					<div className="mb-3 text-center">
						<p className="text-sm font-semibold text-slate-700 sm:text-base">
							ชอบอะไรระหว่าง
						</p>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={() => setimgSelect(dogImg)}
							className="cursor-pointer group flex items-center justify-center gap-3 rounded-2xl border border-sky-200 bg-linear-to-br from-sky-50 to-cyan-100 px-4 py-4 text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
						>
							<span className="text-2xl transition-transform group-hover:scale-110">
								🐶
							</span>
							<span className="font-semibold">หมา</span>
						</button>
						<button
							type="button"
							onClick={() => setimgSelect(catImg)}
							className="cursor-pointer group flex items-center justify-center gap-3 rounded-2xl border border-pink-200 bg-linear-to-br from-pink-50 to-rose-100 px-4 py-4 text-slate-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
						>
							<span className="text-2xl transition-transform group-hover:scale-110">
								🐱
							</span>
							<span className="font-semibold">แมว</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}