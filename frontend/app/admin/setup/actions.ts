"use server";

import { redirect } from "next/navigation";
import { countAdmins, createUser } from "@/lib/users";
import { createSessionCookie } from "@/lib/session";

export async function setupAdminAction(
  formData: FormData
): Promise<{ error: string } | never> {
  if ((await countAdmins()) > 0) {
    redirect("/login");
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "กรุณากรอก username และ password" };
  }
  if (password.length < 8) {
    return { error: "password ต้องมีอย่างน้อย 8 ตัวอักษร" };
  }

  let user;
  try {
    user = await createUser(username, password, true);
  } catch {
    return { error: "username นี้ถูกใช้ไปแล้ว" };
  }

  await createSessionCookie({ userId: user.id, isAdmin: true });
  redirect("/admin");
}
