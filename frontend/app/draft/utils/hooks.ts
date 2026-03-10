import { useState, useEffect, useRef } from "react";

export type BalloonItem = {
    id: number;
    text: string;
    left: number;
    duration: number;
    styleIndex: number;
};
export type ConfettiPiece = {
    id: number;
    left: number;
    top: number;
    x: number;
    y: number;
    rotate: number;
    color: string;
    width: number;
    height: number;
    duration: number;
};
export function confettiState() {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
    return {
        confetti,
        setConfetti
    }
}

export function birthGiftState() {
    const [isOpenGift, setisOpenGift] = useState<boolean>(false);
    const [isPressing, setisPressing] = useState<boolean>(false)
    const [isOpenDisplayImgArea, setisOpenDisplayImgArea] = useState<boolean>(false);
    const [isShaking, setisShaking] = useState<boolean>(false);
    return {
        isOpenGift,
        setisOpenGift,
        isPressing,
        setisPressing,
        isOpenDisplayImgArea,
        setisOpenDisplayImgArea,
        isShaking,
        setisShaking
    };
}

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

export function dateOfBirthState() {
    const [digits, setdigits] = useState(["", "", "", "", "", ""]);
    const [error, seterror] = useState("");
    return {
        digits, setdigits, error, seterror
    }
}