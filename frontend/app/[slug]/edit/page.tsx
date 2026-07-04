import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getPageBySlug } from "@/lib/pages";
import { getUserById, isUserActiveNow } from "@/lib/users";
import EditContentForm from "./EditContentForm";

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        redirect("/login");
    }

    const page = await getPageBySlug(slug);
    if (!page) {
        notFound();
    }

    if (!currentUser.isAdmin && page.user_id !== currentUser.userId) {
        redirect("/login");
    }

    if (!currentUser.isAdmin) {
        const freshUser = await getUserById(currentUser.userId);
        if (!freshUser || !isUserActiveNow(freshUser)) {
            redirect("/logout");
        }
    }

    return (
        <section className="mx-auto min-h-screen max-w-5xl p-6">
            <EditContentForm slug={slug} content={page.content} />
        </section>
    );
}
