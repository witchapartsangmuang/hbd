import { ComponentType } from "react";
import { SectionType, SECTION_LABELS, HbdContent } from "../utils/content-types";
import ScratchCardYoutube from "./ScratchCardYouTube";
import BirthGift from "./BirthGift";
import Cake from "./Cake";
import ScratchCardVdo from "./ScratchCardVdo";
import ReleaseBalloon from "./ReleaseBalloon";
import ScratchCardImg from "./ScratchCardImg";
import TypingText from "./TypingText";
import FlipPhotoCard from "./FlipPhotoCard.tsx";
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

export interface SectionComponentProps {
  nextStep: () => void;
  content: HbdContent;
}

export const SECTION_REGISTRY: Record<
  SectionType,
  { label: string; component: ComponentType<SectionComponentProps> }
> = {
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
  cinematicBirthdayBear: { label: SECTION_LABELS.cinematicBirthdayBear, component: CinematicBirthdayBear },
  cinematicCat: { label: SECTION_LABELS.cinematicCat, component: CinematicCat },
  cinematicDog: { label: SECTION_LABELS.cinematicDog, component: CinematicDog },
};
