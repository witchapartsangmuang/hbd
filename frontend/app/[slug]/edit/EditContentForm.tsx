"use client";

import { useActionState } from "react";
import { saveContentAction } from "./actions";
import { HbdContent } from "@/components/sections/utils/content-types";
import SectionEditor from "./SectionEditor";

const initialState = { error: null as string | null, savedAt: null as number | null };

export default function EditContentForm({
    slug,
    content,
    isAdmin,
}: {
    slug: string;
    content: HbdContent;
    isAdmin: boolean;
}) {
    const [state, formAction, isPending] = useActionState(
        saveContentAction.bind(null, slug),
        initialState
    );

    return (
        <form action={formAction}>
            <SectionEditor
                slug={slug}
                content={content}
                error={state.error}
                savedAt={state.savedAt}
                isPending={isPending}
                isAdmin={isAdmin}
            />
        </form>
    );
}
