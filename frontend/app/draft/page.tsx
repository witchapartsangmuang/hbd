"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import BirthGift from "./components/BirthGift";
import TypingText from "./components/TypingText";
import { birthGiftState } from "./utils/hooks";

import Cake from "./components/Cake";
import DateOfBirth from "./components/DateOfBirth";
import SlideInIcon from "./components/SlideInIcon";
import PopTheBalloon from "./components/PopTheBalloon";
import MemoryMatching from "./components/MemoryMatching";
import CatchTheGift from "./components/CatchTheGift";
import HeartCollector from "./components/HeartCollector";
import FindTheHiddenGift from "./components/FindTheHiddenGift";
import WhackAMoleBirthday from "./components/WhackAMoleBirthday";
import ScratchCard from "./components/ScratchCard";
import FlipPhotoCard from "./components/FlipPhotoCard.tsx";
export default function Page() {
    const [stepOne, setstepOne] = useState<boolean>(false)
    const [stepTwo, setstepTwo] = useState<boolean>(false)
    const [stepThree, setstepThree] = useState<boolean>(false)
    const sparkles = useMemo(
        () => [
            { emoji: "✨", className: "top-[15%] left-[10%] animate-float" },
            { emoji: "🎈", className: "top-[18%] right-[12%] animate-float-delayed" },
            { emoji: "🎉", className: "top-[52%] left-[6%] animate-float-slow" },
            { emoji: "🎂", className: "bottom-[45%] right-[8%] animate-float" },
        ],
        []
    );
    return (
        <>
            {sparkles.map((item, index) => (
                <div
                    key={index}
                    className={`pointer-events-none absolute z-10 text-xl opacity-70 ${item.className}`}
                >
                    {item.emoji}
                </div>
            ))}
            <div className="grid grid-cols-12 bg-[#FFFAFD]">
                {/* <div className="col-span-12">
                    <BirthGift nextStep={() => { setstepOne(true) }} />
                </div>
                <div className={`col-span-12 ${stepOne ? "block" : "hidden"}`}>
                    <Cake nextStep={() => { setstepTwo(true) }} />
                </div> */}
                <div className={`col-span-12 ${!stepTwo ? "block" : "hidden"}`}>
                    <ScratchCard nextStep={() => { setstepThree(true) }} />
                </div>

                {/* <div className={`col-span-12 ${stepTwo ? "block" :"hidden"}`}>
                    <SlideInIcon />
                </div> */}


                {/* <div className="col-span-12">
                    <PopTheBalloon />
                </div>
                <div className="col-span-12">
                    <MemoryMatching />
                </div>
                <div className="col-span-12">
                    <CatchTheGift />
                </div>
                <div className="col-span-12">
                    <HeartCollector />
                </div>
                <div className="col-span-12">
                    <FindTheHiddenGift />
                </div>
                <div className="col-span-12">
                    <WhackAMoleBirthday />
                </div>
                <div className="col-span-12">
                    <ScratchCard />
                </div>
                <div className="col-span-12">
                    <FlipPhotoCard imageSrc={'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80'} />
                </div>
                <div className="col-span-12">
                    <DateOfBirth correctCode="181299"
                        onSuccess={() => {
                            console.log("unlock success");
                        }} />
                </div>
                <div className="col-span-12">
                    <TypingText />
                </div> */}
            </div>

        </>
    )
}