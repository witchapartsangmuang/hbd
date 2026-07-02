"use client";

import { useActionState } from "react";
import { setupAdminAction } from "./actions";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

const initialState = { error: "" };

export default function SetupForm() {
    const [state, formAction, isPending] = useActionState(
        async (_prev: typeof initialState, formData: FormData) => {
            const result = await setupAdminAction(formData);
            return result ?? initialState;
        },
        initialState
    );

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <Input
                type="text"
                name="username"
                placeholder="Admin username"
                autoComplete="username"
                required
            />
            <Input
                type="password"
                name="password"
                placeholder="Password (at least 8 characters)"
                autoComplete="new-password"
                required
                minLength={8}
            />
            {state.error && <p className="text-sm font-medium text-rose-500">{state.error}</p>}
            <Button type="submit" loading={isPending} className="mt-2 w-full">
                Create Admin Account
            </Button>
        </form>
    );
}
