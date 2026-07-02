"use client";

import { useActionState } from "react";
import { createUserAction } from "./actions";

const initialState = { error: null as string | null };

export default function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    return createUserAction(formData);
  }, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <input
        type="text"
        name="username"
        placeholder="Username"
        required
        className="h-11 flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        minLength={8}
        className="h-11 flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      <input
        type="text"
        name="slug"
        placeholder="slug เช่น alice-bday"
        required
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        className="h-11 flex-1 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      <input
        type="date"
        name="startDate"
        required
        title="วันที่เริ่มใช้งาน"
        className="h-11 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      <input
        type="date"
        name="endDate"
        required
        title="วันหมดอายุ"
        className="h-11 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      <button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-6 font-medium text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isPending ? "กำลังสร้าง..." : "สร้าง"}
      </button>
      {state.error && (
        <p className="w-full text-sm font-medium text-rose-500 sm:basis-full">{state.error}</p>
      )}
    </form>
  );
}
