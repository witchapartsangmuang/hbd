"use client";

import { useActionState } from "react";
import { updateUserDatesAction } from "./actions";

const initialState = { error: null as string | null };

function toDateInputValue(value: Date | string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function EditUserDatesForm({
  userId,
  startDate,
  endDate,
}: {
  userId: number;
  startDate: Date | string | null;
  endDate: Date | string | null;
}) {
  const boundAction = updateUserDatesAction.bind(null, userId);
  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    return boundAction(formData);
  }, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input
        type="date"
        name="startDate"
        defaultValue={toDateInputValue(startDate)}
        required
        className="h-9 rounded-xl border border-rose-200 bg-rose-50 px-2 text-xs text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      <input
        type="date"
        name="endDate"
        defaultValue={toDateInputValue(endDate)}
        required
        className="h-9 rounded-xl border border-rose-200 bg-rose-50 px-2 text-xs text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      <button
        type="submit"
        disabled={isPending}
        className="h-9 rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-3 text-xs font-medium text-white shadow disabled:opacity-50"
      >
        {isPending ? "..." : "บันทึก"}
      </button>
      {state.error && <p className="w-full text-xs font-medium text-rose-500">{state.error}</p>}
    </form>
  );
}
