"use client";
import { useEffect, useRef } from "react";
import { confettiState, birthGiftState } from "../utils/hooks";
import { launchConfetti } from "../utils/functions";
import ImgCard from "@/components/ImgCard";
import { imgCard } from "../utils/data";
import { giftSurpriseText } from "../utils/data";
export default function BirthGift({ nextStep }: { nextStep: () => void }) {
    const { isOpenGift, setisOpenGift, isPressing, setisPressing, isShaking, setisShaking, isOpenDisplayImgArea, setisOpenDisplayImgArea, showSurpriseText, setshowSurpriseText } = birthGiftState()
    const { confetti, setConfetti } = confettiState()
    const confettiIdRef = useRef(1);
    useEffect(() => {
        if (!isOpenGift) return;
        const timer = setTimeout(() => setshowSurpriseText(true), 500);
        return () => clearTimeout(timer);
    }, [isOpenGift]);

    const handleMouseDown = () => {
        if (isOpenGift) return;
        setisPressing(true);
    };

    const handleMouseUp = () => {
        if (isOpenGift || !isPressing) return;
        setisOpenDisplayImgArea(true)
        setisPressing(false);
        setisShaking(true);
        window.setTimeout(() => {
            setisShaking(false);
            setisOpenGift(true);
            launchConfetti(confettiIdRef, setConfetti);
        }, 420);
    };

    const handleMouseLeave = () => {
        if (isOpenGift) return;
        setisPressing(false);
    };

    return (
        <>
            <section className="relative flex flex-col items-center min-h-screen p-5">
                <p className="mt-6 text-4xl font-bold text-pink-600">
                    Happy Birthday 🎂
                </p>
                <p className="mt-3 text-center text-rose-900/80">
                    ลองเปิดกล่องของขวัญดูสิ
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
                <button
                    type="button"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onClick={nextStep}
                    className="group relative mt-8 h-55 w-55 cursor-pointer transition hover:scale-105"
                >
                    <div
                        className={`relative h-55 w-55 origin-center 
                            ${isPressing ? "scale-95" : "scale-100"}
                            ${isShaking ? "box-shake" : ""} 
                            transition-transform duration-200`
                        }>
                        <span
                            className={`absolute -left-2 top-7.5 z-20 h-11.5 w-59 rounded-xl bg-linear-to-br from-pink-200 to-pink-400 shadow-xl ${isOpenGift ? "lid-open" : ""
                                }`}
                            style={{ transformOrigin: "50% 80%" }}
                        />
                        <span className="absolute bottom-0 left-0 h-37.5 w-55 rounded-xl bg-linear-to-br from-pink-300 to-pink-500 shadow-xl" />
                        <span className="absolute left-24 top-0 z-30 h-55 w-7 rounded-lg bg-amber-300" />
                        <span className="absolute left-0 top-11.5 z-30 h-6 w-55 rounded-lg bg-amber-300" />
                        <span className="absolute left-17 top-0 z-40 h-13 w-21">
                            <span className="absolute left-0 top-1 h-10 w-10 rotate-45 rounded-[50%_50%_50%_0] border-10 border-amber-300" />
                            <span className="absolute right-0 top-1 h-10 w-10 scale-x-[-1] rotate-45 rounded-[50%_50%_50%_0] border-10 border-amber-300" />
                        </span>
                    </div>
                </button>
                <div
                    className={`mt-6 text-lg font-medium text-rose-500 transition-all duration-700 ease-out ${showSurpriseText
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-10 opacity-0"
                        }`}
                >

                    {giftSurpriseText}
                </div>
                {
                    isOpenDisplayImgArea &&
                    <div className="grid grid-cols-12">
                        {imgCard.map((img, i) => (
                            <div
                                key={`${img.imgPath}-${i}`}
                                className={`p-5 col-span-12 md:col-span-6 lg:col-span-3 transition-all duration-500 ease-out ${isOpenGift
                                    ? "translate-y-0 scale-100 opacity-100"
                                    : "-translate-y-60 scale-75 opacity-0 pointer-events-none"
                                    }`}
                                style={{
                                    transitionDelay: `${i * 1000}ms`,
                                }}
                            >
                                <ImgCard
                                    imgPath={img.imgPath}
                                    rotateAngle={img.rotateAngle}
                                    caption={img.caption}
                                />
                            </div>
                        ))}
                    </div>
                }
            </section>
        </>
    );
}