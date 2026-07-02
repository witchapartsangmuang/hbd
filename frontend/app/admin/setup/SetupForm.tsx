"use client";

import { useActionState } from "react";
import { setupAdminAction } from "./actions";

const initialState = { error: "" };

export default function SetupForm() {
  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await setupAdminAction(formData);
    return result ?? initialState;
  }, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input
        type="text"
        name="username"
        placeholder="Admin username"
        autoComplete="username"
        required
        className="h-11 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      <input
        type="password"
        name="password"
        placeholder="Password (อย่างน้อย 8 ตัวอักษร)"
        autoComplete="new-password"
        required
        minLength={8}
        className="h-11 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
      />
      {state.error && <p className="text-sm font-medium text-rose-500">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 rounded-full bg-linear-to-r from-pink-500 to-rose-500 font-medium text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isPending ? "กำลังสร้าง..." : "สร้างบัญชี admin"}
      </button>
    </form>
  );
}
