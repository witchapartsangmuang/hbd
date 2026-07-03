import { ComponentType } from "react";
import { SectionType, SECTION_LABELS, HbdContent } from "@/components/sections/utils/content-types";
import ScratchCard from "./editors/ScratchCard";
import ScratchCardYoutube from "./editors/ScratchCardYouTube";
import BirthGift from "./editors/BirthGift";
import Cake from "./editors/Cake";
import ScratchCardVdo from "./editors/ScratchCardVdo";
import ReleaseBalloon from "./editors/ReleaseBalloon";
import ScratchCardImg from "./editors/ScratchCardImg";
import TypingText from "./editors/TypingText";
import FlipPhotoCard from "./editors/FlipPhotoCard";
import DateOfBirth from "./editors/DateOfBirth";
import SlideInIcon from "./editors/SlideInIcon";
import PopTheBalloon from "./editors/PopTheBalloon";
import MemoryMatching from "./editors/MemoryMatching";
import CatchTheGift from "./editors/CatchTheGift";
import HeartCollector from "./editors/HeartCollector";
import FindTheHiddenGift from "./editors/FindTheHiddenGift";
import WhackAMoleBirthday from "./editors/WhackAMoleBirthday";
import CinematicBirthdayBear from "./editors/CinematicBirthdayBear";
import CinematicCat from "./editors/CinematicCat";
import CinematicDog from "./editors/CinematicDog";
import SpinTheWheel from "./editors/SpinTheWheel";
import JigsawPhotoPuzzle from "./editors/JigsawPhotoPuzzle";
import QuizAboutYou from "./editors/QuizAboutYou";
import CandleBlow from "./editors/CandleBlow";
import GiftBoxUnwrap from "./editors/GiftBoxUnwrap";
import EnvelopeOpen from "./editors/EnvelopeOpen";
import PolaroidShake from "./editors/PolaroidShake";
import CountdownToNextBirthday from "./editors/CountdownToNextBirthday";
import MemoryTimeline from "./editors/MemoryTimeline";
import VoiceMessage from "./editors/VoiceMessage";
import ZodiacReveal from "./editors/ZodiacReveal";
import GuestbookWall from "./editors/GuestbookWall";
import DigitalSignature from "./editors/DigitalSignature";
import BackgroundMusicPlayer from "./editors/BackgroundMusicPlayer";
import CinematicRabbit from "./editors/CinematicRabbit";
import CinematicPanda from "./editors/CinematicPanda";
import FireworksFinale from "./editors/FireworksFinale";

export interface SectionComponentProps {
    nextStep: () => void;
    content: HbdContent;
}

export const SECTION_REGISTRY: Record<
    SectionType,
    { label: string; component: ComponentType<SectionComponentProps> }
> = {
    scratchCard: { label: SECTION_LABELS.scratchCard, component: ScratchCard },
    scratchCardYoutube: { label: SECTION_LABELS.scratchCardYoutube, component: ScratchCardYoutube },
    birthGift: { label: SECTION_LABELS.birthGift, component: BirthGift },
    cake: { label: SECTION_LABELS.cake, component: Cake },
    scratchCardVdo: { label: SECTION_LABELS.scratchCardVdo, component: ScratchCardVdo },
    releaseBalloon: { label: SECTION_LABELS.releaseBalloon, component: ReleaseBalloon },
    scratchCardImg: { label: SECTION_LABELS.scratchCardImg, component: ScratchCardImg },
    typingText: { label: SECTION_LABELS.typingText, component: TypingText },
    flipPhotoCard: { label: SECTION_LABELS.flipPhotoCard, component: FlipPhotoCard },
    dateOfBirth: { label: SECTION_LABELS.dateOfBirth, component: DateOfBirth },
    slideInIcon: { label: SECTION_LABELS.slideInIcon, component: SlideInIcon },
    popTheBalloon: { label: SECTION_LABELS.popTheBalloon, component: PopTheBalloon },
    memoryMatching: { label: SECTION_LABELS.memoryMatching, component: MemoryMatching },
    catchTheGift: { label: SECTION_LABELS.catchTheGift, component: CatchTheGift },
    heartCollector: { label: SECTION_LABELS.heartCollector, component: HeartCollector },
    findTheHiddenGift: { label: SECTION_LABELS.findTheHiddenGift, component: FindTheHiddenGift },
    whackAMoleBirthday: { label: SECTION_LABELS.whackAMoleBirthday, component: WhackAMoleBirthday },
    cinematicBirthdayBear: {
        label: SECTION_LABELS.cinematicBirthdayBear,
        component: CinematicBirthdayBear,
    },
    cinematicCat: { label: SECTION_LABELS.cinematicCat, component: CinematicCat },
    cinematicDog: { label: SECTION_LABELS.cinematicDog, component: CinematicDog },
    spinTheWheel: { label: SECTION_LABELS.spinTheWheel, component: SpinTheWheel },
    jigsawPhotoPuzzle: { label: SECTION_LABELS.jigsawPhotoPuzzle, component: JigsawPhotoPuzzle },
    quizAboutYou: { label: SECTION_LABELS.quizAboutYou, component: QuizAboutYou },
    candleBlow: { label: SECTION_LABELS.candleBlow, component: CandleBlow },
    giftBoxUnwrap: { label: SECTION_LABELS.giftBoxUnwrap, component: GiftBoxUnwrap },
    envelopeOpen: { label: SECTION_LABELS.envelopeOpen, component: EnvelopeOpen },
    polaroidShake: { label: SECTION_LABELS.polaroidShake, component: PolaroidShake },
    countdownToNextBirthday: {
        label: SECTION_LABELS.countdownToNextBirthday,
        component: CountdownToNextBirthday,
    },
    memoryTimeline: { label: SECTION_LABELS.memoryTimeline, component: MemoryTimeline },
    voiceMessage: { label: SECTION_LABELS.voiceMessage, component: VoiceMessage },
    zodiacReveal: { label: SECTION_LABELS.zodiacReveal, component: ZodiacReveal },
    guestbookWall: { label: SECTION_LABELS.guestbookWall, component: GuestbookWall },
    digitalSignature: { label: SECTION_LABELS.digitalSignature, component: DigitalSignature },
    backgroundMusicPlayer: {
        label: SECTION_LABELS.backgroundMusicPlayer,
        component: BackgroundMusicPlayer,
    },
    cinematicRabbit: { label: SECTION_LABELS.cinematicRabbit, component: CinematicRabbit },
    cinematicPanda: { label: SECTION_LABELS.cinematicPanda, component: CinematicPanda },
    fireworksFinale: { label: SECTION_LABELS.fireworksFinale, component: FireworksFinale },
};
