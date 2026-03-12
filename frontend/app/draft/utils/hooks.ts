import { useState, useEffect, useRef } from "react";
import { ConfettiPiece } from "./type";
export function confettiState() {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
    return {
        confetti,
        setConfetti
    }
}
// BirthGift.tsx
export function birthGiftState() {
    const [isOpenGift, setisOpenGift] = useState<boolean>(false);
    const [isPressing, setisPressing] = useState<boolean>(false)
    const [isOpenDisplayImgArea, setisOpenDisplayImgArea] = useState<boolean>(false);
    const [isShaking, setisShaking] = useState<boolean>(false);
    const [showSurpriseText, setshowSurpriseText] = useState<boolean>(false);
    return {
        isOpenGift,
        setisOpenGift,
        isPressing,
        setisPressing,
        isOpenDisplayImgArea,
        setisOpenDisplayImgArea,
        isShaking,
        setisShaking,
        showSurpriseText,
        setshowSurpriseText
    };
}
// Cake.tsx
export function cakeState() {
    const [blown, setblown] = useState<boolean>(false);
    const [wishText, setwishText] = useState<string>("");
    return {
        blown,
        setblown,
        wishText,
        setwishText
    }
}
// ScratchCard.tsx
export function scratchCardState() {
    const [progress, setprogress] = useState(0);
    const [isRevealed, setisRevealed] = useState(false);
    const [cardSize, setCardSize] = useState({ width: window.innerWidth, height: window.innerHeight * 0.4 });
    const [showVideo, setshowVideo] = useState(false);
    return {
        progress,
        setprogress,
        isRevealed,
        setisRevealed,
        cardSize,
        setCardSize,
        showVideo,
        setshowVideo
    }
}

export function dateOfBirthState() {
    const [digits, setdigits] = useState(["", "", "", "", "", ""]);
    const [error, seterror] = useState("");
    return {
        digits, setdigits, error, seterror
    }
}