"use client";
import ImgCard from "@/components/ImgCard";
import { useEffect, useMemo, useRef, useState } from "react";
import BirthGift from "./components/BirthGift";
export default function Page() {
    const img = 4
    const imgCard = [{
        imgPath: "/img/1.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: -2,
    }, {
        imgPath: "/img/2.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: 4,
    },
    {
        imgPath: "/img/3.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: -2,
    }, {
        imgPath: "/img/4.jpg",
        caption: "ขอให้ปีนี้เป็นปีที่คุณเปล่งประกายที่สุด",
        rotateAngle: 4,
    }]
    return (
        <>
            <p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p><p>a</p>
            <div className="grid grid-cols-12 bg-[#FFFAFD]">
                <div className="col-span-12 p-5">
                    <BirthGift />
                </div>

                {imgCard.map((img, i) => (
                    <div key={`${img}-${i}`} className="col-span-12 md:col-span-6 lg:col-span-3 p-5">
                        <ImgCard imgPath={img.imgPath} rotateAngle={img.rotateAngle} caption={img.caption} />
                    </div>
                ))}
            </div>
        </>
    )
}