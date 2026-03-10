import { useState, useEffect } from "react";

export function giftState() {
    const [isOpenGift, setisOpenGift] = useState(false);
    const [isPressing, setisPressing] = useState(false)
    const [isOpenDisplayImgArea, setisOpenDisplayImgArea] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    return {
        isOpenGift,
        setisOpenGift,
        isPressing,
        setisPressing,
        isOpenDisplayImgArea,
        setisOpenDisplayImgArea,
    };
}

export function giftEffect() {
    useEffect(() => {
        console.log("Gift opened");
        return () => {
            console.log("cleanup");
        };
    }, []);
}