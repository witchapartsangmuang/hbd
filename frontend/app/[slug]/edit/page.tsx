import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getPageBySlug } from "@/lib/pages";
import { getUserById, isUserActiveNow } from "@/lib/users";
import { mergeWithDefaults } from "@/components/sections/utils/content-types";
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

  const content = mergeWithDefaults(page.content);

  return (
    <section className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-100 p-6">
      <div className="mx-auto max-w-5xl">
        <EditContentForm slug={slug} content={content} />
      </div>
    </section>
  );
}
