import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HbdExperience from "@/components/sections/HbdExperience";
import { getPageBySlug, recordPageView } from "@/lib/pages";
import { getCurrentUser } from "@/lib/session";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    if (!page) return {};

    const share = page.content.share;
    const title = share?.title || "Happy Birthday 🎂";
    const description =
        share?.description || "A birthday surprise made just for you — tap to open 🎁";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            ...(share?.imagePath ? { images: [{ url: share.imagePath }] } : {}),
        },
        twitter: {
            card: share?.imagePath ? "summary_large_image" : "summary",
            title,
            description,
            ...(share?.imagePath ? { images: [share.imagePath] } : {}),
        },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    if (!page) notFound();

    // Owner/admin visits (e.g. previewing from the editor) shouldn't inflate stats.
    const currentUser = await getCurrentUser();
    const isOwnerView =
        !!currentUser && (currentUser.isAdmin || currentUser.userId === page.user_id);
    if (!isOwnerView) await recordPageView(page.id);

    return <HbdExperience content={page.content} />;
}
