import { HbdContent } from "@/components/sections/utils/content-types";

export const panelClass = "rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-xl";

export interface SectionEditorProps {
    content: HbdContent;
    slug: string;
    hidden: boolean;
    sectionId: string;
}
