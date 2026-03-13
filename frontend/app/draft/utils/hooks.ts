import { useState } from "react";
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
// ScratchCardImg.tsx + ScratchCardVdo.tsx 
export function scratchCardState() {
    const [mounted, setmouted] = useState(false)
    const [progress, setprogress] = useState(0);
    const [isRevealed, setisRevealed] = useState(false);
    const [cardSize, setCardSize] = useState(() => {
        if (typeof window === "undefined") {
            return { width: 1, height: 1 };
        }
        return {
            width: window.innerWidth,
            height: window.innerHeight * 0.4
        };
    })
    const [showVideo, setshowVideo] = useState(false);
    return {
        mounted, setmouted,
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
// TypingText.tsx
export function typingTextState() {
    const [typedText, settypedText] = useState("");
    const [typeStarted, settypeStarted] = useState(false);
    return {
        typedText,
        settypedText,
        typeStarted,
        settypeStarted
    }
}
// DateOfBirth.tsx
export function dateOfBirthState() {
    const [digits, setdigits] = useState(["", "", "", "", "", ""]);
    const [shake, setshake] = useState(false);
    const [success, setsuccess] = useState(false);
    const [error, seterror] = useState("");
    return {
        digits,
        setdigits,
        shake,
        setshake,
        success,
        setsuccess,
        error,
        seterror
    }
}

