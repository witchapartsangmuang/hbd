"use server";

import { redirect } from "next/navigation";
import { getUserByUsername, isUserActiveNow } from "@/lib/users";
import { verifyPassword } from "@/lib/auth";
import { createSessionCookie } from "@/lib/session";
import { getPageForUser } from "@/lib/pages";

export async function loginAction(formData: FormData): Promise<{ error: string } | never> {
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!username || !password) {
        return { error: "Please enter your username and password" };
    }

    const user = await getUserByUsername(username);
    if (!user) {
        return { error: "Invalid username or password" };
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
        return { error: "Invalid username or password" };
    }

    if (!isUserActiveNow(user)) {
        return { error: "This account is outside its allowed access period" };
    }

    await createSessionCookie({ userId: user.id, isAdmin: user.is_admin });

    if (user.is_admin) {
        redirect("/admin");
    }

    const page = await getPageForUser(user.id);
    if (!page) {
        redirect("/login?error=no-page");
    }
    redirect(`/${page.slug}/edit`);
}
