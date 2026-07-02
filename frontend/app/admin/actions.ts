"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { createUser, getUserByUsername, updateUserDates } from "@/lib/users";
import { createPageForUser, slugExists } from "@/lib/pages";
import { defaultContent } from "@/app/hbd/utils/content-types";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateDateRange(startDate: string, endDate: string): string | null {
  if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate)) {
    return "กรุณาระบุวันที่เริ่มและวันหมดอายุให้ครบ";
  }
  if (startDate > endDate) {
    return "วันที่เริ่มต้องไม่เกินวันหมดอายุ";
  }
  return null;
}

export async function createUserAction(
  formData: FormData
): Promise<{ error: string } | { error: null }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) {
    return { error: "Forbidden" };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");

  if (!username || !password || !slug) {
    return { error: "กรุณากรอกข้อมูลให้ครบ" };
  }
  if (password.length < 8) {
    return { error: "password ต้องมีอย่างน้อย 8 ตัวอักษร" };
  }
  if (!SLUG_PATTERN.test(slug)) {
    return { error: "slug ต้องเป็นตัวพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น" };
  }

  const dateError = validateDateRange(startDate, endDate);
  if (dateError) {
    return { error: dateError };
  }

  if (await getUserByUsername(username)) {
    return { error: "username นี้ถูกใช้ไปแล้ว" };
  }
  if (await slugExists(slug)) {
    return { error: "slug นี้ถูกใช้ไปแล้ว" };
  }

  const user = await createUser(username, password, false, startDate, endDate);
  await createPageForUser(user.id, slug, defaultContent);

  revalidatePath("/admin");
  return { error: null };
}

export async function updateUserDatesAction(
  userId: number,
  formData: FormData
): Promise<{ error: string | null }> {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) {
    return { error: "Forbidden" };
  }

  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");

  const dateError = validateDateRange(startDate, endDate);
  if (dateError) {
    return { error: dateError };
  }

  await updateUserDates(userId, startDate, endDate);
  revalidatePath("/admin");
  return { error: null };
}
