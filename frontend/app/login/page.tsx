"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await loginAction(formData);
    return result ?? initialState;
  }, initialState);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-100 p-5">
      <div className="w-full max-w-sm rounded-[28px] border border-rose-100 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="mb-6 text-center text-2xl font-bold text-rose-600">Log In</h1>
        <form action={formAction} className="flex flex-col gap-4">
          <Input type="text" name="username" placeholder="Username" autoComplete="username" required />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
          {state.error && <p className="text-sm font-medium text-rose-500">{state.error}</p>}
          <Button type="submit" loading={isPending} className="mt-2 w-full">
            Log In
          </Button>
        </form>
      </div>
    </section>
  );
}
