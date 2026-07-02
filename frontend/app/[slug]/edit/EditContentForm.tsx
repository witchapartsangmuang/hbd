"use client";

import { useActionState } from "react";
import { saveContentAction } from "./actions";
import { HbdContent } from "@/app/hbd/utils/content-types";
import SectionEditor from "./SectionEditor";

const initialState = { error: null as string | null, savedAt: null as number | null };

export default function EditContentForm({ slug, content }: { slug: string; content: HbdContent }) {
  const boundAction = saveContentAction.bind(null, slug);
  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    return boundAction(formData);
  }, initialState);

  return (
    <form action={formAction}>
      <SectionEditor slug={slug} content={content} error={state.error} savedAt={state.savedAt} isPending={isPending} />
    </form>
  );
}
