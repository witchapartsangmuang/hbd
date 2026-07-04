import { notFound } from "next/navigation";
import HbdExperience from "@/components/sections/HbdExperience";
import { getPageBySlug } from "@/lib/pages";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    if (!page) notFound();

    return <HbdExperience content={page.content} />;
}
