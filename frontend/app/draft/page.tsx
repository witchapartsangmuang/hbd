"use client";
import ImgCard from "@/components/ImgCard";
import { useEffect, useMemo, useRef, useState } from "react";
import BirthGift from "./components/BirthGift";
import TypingText from "./components/TypingText";
import { giftState, giftEffect } from "./utils/hooks";
import { giftFunction } from "./utils/functions";
export default function Page() {
    const { isOpenGift, setisOpenGift } = giftState()
    const { isPressing, setisPressing } = giftState()
    const { isOpenDisplayImgArea, setisOpenDisplayImgArea } = giftState()
    const imgCard = [{
        imgPath: "/img/1.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: -3,
    }, {
        imgPath: "/img/2.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: 3,
    },
    {
        imgPath: "/img/3.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: -3,
    }, {
        imgPath: "/img/4.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: 3,
    }]
    useEffect(() => {
        console.log("isOpenGift", isOpenGift);
    }, [isOpenGift])
    return (
        <>
            <div className="grid grid-cols-12 bg-[#FFFAFD]">
                <div className="col-span-12 p-5">
                    <div className="relative">
                        <BirthGift
                            isOpenGift={isOpenGift}
                            setisOpenGift={setisOpenGift}
                            // isPressing={isPressing}
                            // setisPressing={setisPressing}
                            setisOpenDisplayImgArea={setisOpenDisplayImgArea} />
                        {
                            isOpenDisplayImgArea &&
                            <div className="grid grid-cols-12">
                                {imgCard.map((img, i) => (
                                    <div
                                        key={`${img.imgPath}-${i}`}
                                        className={`col-span-12 p-5 md:col-span-6 lg:col-span-3 transition-all duration-1000 ease-out ${isOpenGift
                                            ? "translate-y-0 scale-100 opacity-100"
                                            : "-translate-y-[240px] scale-75 opacity-0 pointer-events-none"
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
                </div>
                <div className="col-span-12 p-5">
                    ปล่อยลูกโป่ง
                </div>
                <div className="col-span-12 p-5">
                    ใส่รหัสวันเกิด
                </div>
                <div className="col-span-12 p-5">
                    <TypingText />
                </div>
            </div>

        </>
    )
}