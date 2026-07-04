import { ComponentType } from "react";
import { SectionType, SECTION_LABELS, HbdContent } from "@/components/sections/utils/content-types";
import ScratchCard from "./ScratchCard";
import ScratchCardYoutube from "./ScratchCardYouTube";
import BirthGift from "./BirthGift";
import Cake from "./Cake";
import ScratchCardVdo from "./ScratchCardVdo";
import ReleaseBalloon from "./ReleaseBalloon";
import ScratchCardImg from "./ScratchCardImg";
import TypingText from "./TypingText";
import FlipPhotoCard from "./FlipPhotoCard";
import DateOfBirth from "./DateOfBirth";
import SlideInIcon from "./SlideInIcon";
import PopTheBalloon from "./PopTheBalloon";
import MemoryMatching from "./MemoryMatching";
import CatchTheGift from "./CatchTheGift";
import HeartCollector from "./HeartCollector";
import FindTheHiddenGift from "./FindTheHiddenGift";
import WhackAMoleBirthday from "./WhackAMoleBirthday";
import CinematicBirthdayBear from "./CinematicBirthdayBear";
import CinematicCat from "./CinematicCat";
import CinematicDog from "./CinematicDog";
import SpinTheWheel from "./SpinTheWheel";
import JigsawPhotoPuzzle from "./JigsawPhotoPuzzle";
import QuizAboutYou from "./QuizAboutYou";
import CandleBlow from "./CandleBlow";
import GiftBoxUnwrap from "./GiftBoxUnwrap";
import EnvelopeOpen from "./EnvelopeOpen";
import PolaroidShake from "./PolaroidShake";
import CountdownToNextBirthday from "./CountdownToNextBirthday";
import MemoryTimeline from "./MemoryTimeline";
import VoiceMessage from "./VoiceMessage";
import ZodiacReveal from "./ZodiacReveal";
import GuestbookWall from "./GuestbookWall";
import DigitalSignature from "./DigitalSignature";
import BackgroundMusicPlayer from "./BackgroundMusicPlayer";
import CinematicRabbit from "./CinematicRabbit";
import CinematicPanda from "./CinematicPanda";
import FireworksFinale from "./FireworksFinale";

export interface SectionComponentProps {
    nextStep: () => void;
    content: HbdContent;
    sectionId: string;
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
