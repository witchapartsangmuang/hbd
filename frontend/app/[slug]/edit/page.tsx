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

    const lastViewedLabel = page.last_viewed_at
        ? new Date(page.last_viewed_at).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

    return (
        <section className="mx-auto min-h-screen max-w-5xl p-6">
            <p className="mb-3 text-sm text-gray-600">
                👀 Viewed {page.view_count ?? 0} {(page.view_count ?? 0) === 1 ? "time" : "times"}
                {lastViewedLabel && ` · last viewed ${lastViewedLabel}`}
            </p>
            <EditContentForm slug={slug} content={page.content} isAdmin={currentUser.isAdmin} />
        </section>
    );
}
