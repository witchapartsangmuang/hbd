import { ComponentType } from "react";
import { SectionType } from "@/components/sections/utils/content-types";
import { SectionEditorProps } from "./editors/_shared";
import BirthGiftEditor from "./editors/BirthGift";
import CakeEditor from "./editors/Cake";
import TypingTextEditor from "./editors/TypingText";
import DateOfBirthEditor from "./editors/DateOfBirth";
import ReleaseBalloonEditor from "./editors/ReleaseBalloon";
import FlipPhotoCardEditor from "./editors/FlipPhotoCard";
import SlideInIconEditor from "./editors/SlideInIcon";
import CinematicBirthdayBearEditor from "./editors/CinematicBirthdayBear";
import SpinTheWheelEditor from "./editors/SpinTheWheel";
import JigsawPhotoPuzzleEditor from "./editors/JigsawPhotoPuzzle";
import QuizAboutYouEditor from "./editors/QuizAboutYou";
import CandleBlowEditor from "./editors/CandleBlow";
import GiftBoxUnwrapEditor from "./editors/GiftBoxUnwrap";
import EnvelopeOpenEditor from "./editors/EnvelopeOpen";
import PolaroidShakeEditor from "./editors/PolaroidShake";
import CountdownToNextBirthdayEditor from "./editors/CountdownToNextBirthday";
import MemoryTimelineEditor from "./editors/MemoryTimeline";
import VoiceMessageEditor from "./editors/VoiceMessage";
import ZodiacRevealEditor from "./editors/ZodiacReveal";
import GuestbookWallEditor from "./editors/GuestbookWall";
import DigitalSignatureEditor from "./editors/DigitalSignature";
import BackgroundMusicPlayerEditor from "./editors/BackgroundMusicPlayer";
import CinematicRabbitEditor from "./editors/CinematicRabbit";
import CinematicPandaEditor from "./editors/CinematicPanda";
import FireworksFinaleEditor from "./editors/FireworksFinale";

/**
 * Every section type EXCEPT the scratch-card family (handled specially in SectionEditor.tsx
 * since one shared panel covers all 4 scratch-card types) and the no-config mini-games
 * (rendered via a single generic "no settings" panel).
 */
export const SECTION_EDITOR_REGISTRY = {
    birthGift: BirthGiftEditor,
    cake: CakeEditor,
    typingText: TypingTextEditor,
    dateOfBirth: DateOfBirthEditor,
    releaseBalloon: ReleaseBalloonEditor,
    flipPhotoCard: FlipPhotoCardEditor,
    slideInIcon: SlideInIconEditor,
    cinematicBirthdayBear: CinematicBirthdayBearEditor,
    spinTheWheel: SpinTheWheelEditor,
    jigsawPhotoPuzzle: JigsawPhotoPuzzleEditor,
    quizAboutYou: QuizAboutYouEditor,
    candleBlow: CandleBlowEditor,
    giftBoxUnwrap: GiftBoxUnwrapEditor,
    envelopeOpen: EnvelopeOpenEditor,
    polaroidShake: PolaroidShakeEditor,
    countdownToNextBirthday: CountdownToNextBirthdayEditor,
    memoryTimeline: MemoryTimelineEditor,
    voiceMessage: VoiceMessageEditor,
    zodiacReveal: ZodiacRevealEditor,
    guestbookWall: GuestbookWallEditor,
    digitalSignature: DigitalSignatureEditor,
    backgroundMusicPlayer: BackgroundMusicPlayerEditor,
    cinematicRabbit: CinematicRabbitEditor,
    cinematicPanda: CinematicPandaEditor,
    fireworksFinale: FireworksFinaleEditor,
} satisfies Partial<Record<SectionType, ComponentType<SectionEditorProps>>>;
