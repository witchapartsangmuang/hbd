"use client";
import ImgCard from "@/components/ImgCard";
import { useEffect, useMemo, useRef, useState } from "react";
import BirthGift from "./components/BirthGift";
import TypingText from "./components/TypingText";
import { birthGiftState } from "./utils/hooks";
import { imgCard } from "./utils/data";
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
    const { isOpenGift, setisOpenGift, isPressing, setisPressing, isOpenDisplayImgArea, setisOpenDisplayImgArea } = birthGiftState()
    const sparkles = useMemo(
        () => [
            { emoji: "✨", className: "top-[8%] left-[10%] animate-float" },
            { emoji: "🎈", className: "top-[18%] right-[12%] animate-float-delayed" },
            { emoji: "🎉", className: "top-[52%] left-[6%] animate-float-slow" },
            { emoji: "🎂", className: "bottom-[18%] right-[7%] animate-float" },
        ],
        []
    );
    useEffect(() => {
        console.log("isOpenGift", isOpenGift);
    }, [isOpenGift])
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
                <div className="col-span-12 p-5">
                    <BirthGift
                        isOpenGift={isOpenGift}
                        setisOpenGift={setisOpenGift}
                        setisOpenDisplayImgArea={setisOpenDisplayImgArea} />
                    {
                        isOpenDisplayImgArea &&
                        <div className="grid grid-cols-12">
                            {imgCard.map((img, i) => (
                                <div
                                    key={`${img.imgPath}-${i}`}
                                    className={`p-5 col-span-12 md:col-span-6 lg:col-span-3 transition-all duration-1000 ease-out ${isOpenGift
                                        ? "translate-y-0 scale-100 opacity-100"
                                        : "-translate-y-60 scale-75 opacity-0 pointer-events-none"
                                        }`}
                                    style={{
                                        transitionDelay: `${i * 180}ms`,
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
                </div>
                <div className="col-span-12 p-5">
                    <Cake />
                </div>
                <div className="col-span-12 p-5">
                    <SlideInIcon />
                </div>
                <div className="col-span-12 p-5">
                    <PopTheBalloon />
                </div>
                <div className="col-span-12 p-5">
                    <MemoryMatching />
                </div>
                <div className="col-span-12 p-5">
                    <CatchTheGift />
                </div>
                <div className="col-span-12 p-5">
                    <HeartCollector />
                </div>
                <div className="col-span-12 p-5">
                    <FindTheHiddenGift />
                </div>
                <div className="col-span-12 p-5">
                    <WhackAMoleBirthday />
                </div>
                <div className="col-span-12 p-5">
                    <ScratchCard />
                </div>
                <div className="col-span-12 p-5">
                    <FlipPhotoCard imageSrc={'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80'} />
                </div>
                <div className="col-span-12 p-5">
                    <DateOfBirth correctCode="181299"
                        onSuccess={() => {
                            console.log("unlock success");
                            // set state เปิดรูปเพิ่ม / เปิดคำอวยพรเพิ่ม / เปิด section ลับ
                        }} />
                </div>
                <div className="col-span-12 p-5">
                    <TypingText />
                </div>
            </div>

        </>
    )
}