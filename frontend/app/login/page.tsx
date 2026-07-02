"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await loginAction(formData);
    return result ?? initialState;
  }, initialState);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-100 p-5">
      <div className="w-full max-w-sm rounded-[28px] border border-rose-100 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="mb-6 text-center text-2xl font-bold text-rose-600">เข้าสู่ระบบ</h1>
        <form action={formAction} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="username"
            required
            className="h-11 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            className="h-11 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-800 outline-none focus:border-rose-400 focus:bg-white"
          />
          {state.error && <p className="text-sm font-medium text-rose-500">{state.error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="mt-2 h-11 rounded-full bg-linear-to-r from-pink-500 to-rose-500 font-medium text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </section>
  );
}
