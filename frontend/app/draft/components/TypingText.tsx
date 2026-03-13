"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { typingTextState } from "../utils/hooks";
import { typewriterMessage } from "../utils/data";

export default function TypingText() {
	const { typedText, settypedText, typeStarted, settypeStarted } = typingTextState()
	const messageRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!typeStarted) return;
		let i = 0;
		const interval = setInterval(() => {
			i += 1;
			settypedText(typewriterMessage.slice(0, i));
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
						settypeStarted(true);
					}
				});
			},
			{ threshold: 0.35 }
		);
		observer.observe(messageRef.current);
		return () => observer.disconnect();
	}, []);


	return (
		<section className="relative flex flex-col items-center min-h-screen p-5">
			<h2 className="text-center text-3xl font-bold text-rose-700">
				💌 A Special Message
			</h2>
			<div className="mt-8 w-full rounded-3xl border border-white/60 bg-white/70 p-7 shadow-xl backdrop-blur">
				<div
					ref={messageRef}
					className="min-h-35 whitespace-pre-line text-lg leading-8 text-rose-900"
				>
					<span className="typewriter-cursor">{typedText}</span>
				</div>
			</div>
		</section>
	);
}