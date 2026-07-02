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
    return { error: "Please enter a username and password" };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  let user;
  try {
    user = await createUser(username, password, true);
  } catch {
    return { error: "This username is already taken" };
  }

  await createSessionCookie({ userId: user.id, isAdmin: true });
  redirect("/admin");
}
