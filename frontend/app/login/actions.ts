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
    return { error: "กรุณากรอก username และ password" };
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return { error: "username หรือ password ไม่ถูกต้อง" };
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return { error: "username หรือ password ไม่ถูกต้อง" };
  }

  if (!isUserActiveNow(user)) {
    return { error: "บัญชีนี้อยู่นอกช่วงเวลาที่อนุญาตให้เข้าใช้งาน" };
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
