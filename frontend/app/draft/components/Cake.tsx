"use client";
import { useRef } from "react";
import { launchConfetti } from "../utils/functions";
import { cakeState, confettiState } from "../utils/hooks";
import { cakeWishText } from "../utils/data";
export default function Cake({ nextStep }: { nextStep: () => void }) {
    const confettiIdRef = useRef(2)
    const { confetti, setConfetti } = confettiState()
    const { blown, setblown } = cakeState()
    const handleBlowCandles = () => {
        launchConfetti(confettiIdRef, setConfetti);
        setblown(prev => !prev);
        nextStep()
    };
    return (
        <>
            <section className="relative flex flex-col items-center min-h-screen p-5">
                <p className="mt-6 text-3xl font-bold text-pink-600">
                    🎂 Make a Wish
                </p>
                <p className="mt-3 text-center text-rose-900/80">
                    อธิษฐานในใจ แล้วค่อยเป่าเทียนนะ
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
                                className={`absolute -top-4.5 left-1/2 h-5 w-4 
                                    -translate-x-1/2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] 
                                    bg-[radial-gradient(circle_at_50%_30%,#fff6b0,#ffb300_65%,#ff7a00_100%)] 
                                    shadow-[0_0_18px_rgba(255,170,0,0.65)] transition 
                                    ${blown ? "scale-0 opacity-0" : "animate-flicker"}`}
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={handleBlowCandles}
                    className={`mt-3 rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 
                    font-medium text-white shadow-lg transition hover:-translate-y-0.5 ${blown && "hidden"}`}
                >
                    เป่าเทียน 🕯️
                </button>
                <p className={`mt-4 text-center font-semibold text-rose-700 ${blown ? "opacity-100" : "opacity-0"}`}>{cakeWishText}</p>
            </section>
        </>
    );
}