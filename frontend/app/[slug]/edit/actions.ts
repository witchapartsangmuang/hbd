"use server";

import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/session";
import { getPageBySlug, updatePageContent } from "@/lib/pages";
import { mergeWithDefaults, SECTION_TYPES, SectionInstance } from "@/app/hbd/utils/content-types";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function uploadImageAction(formData: FormData): Promise<{ url: string } | { error: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "ไม่พบไฟล์" };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "ไฟล์ต้องเป็นรูปภาพ" };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "ไฟล์ใหญ่เกิน 5MB" };
  }

  try {
    const blob = await put(`uploads/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return { url: blob.url };
  } catch {
    return { error: "อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้ง" };
  }
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "");
}

function num(formData: FormData, key: string, fallback: number): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function parseSections(formData: FormData, fallback: SectionInstance[]): SectionInstance[] {
  const raw = str(formData, "sections");
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;

    const seenTypes = new Set<string>();
    const valid: SectionInstance[] = [];

    for (const item of parsed) {
      if (
        item &&
        typeof item.id === "string" &&
        typeof item.type === "string" &&
        typeof item.enabled === "boolean" &&
        (SECTION_TYPES as string[]).includes(item.type) &&
        !seenTypes.has(item.type)
      ) {
        seenTypes.add(item.type);
        valid.push({
          id: item.id,
          type: item.type,
          enabled: item.enabled,
          ...(typeof item.label === "string" && item.label.trim() ? { label: item.label.trim() } : {}),
        });
      }
    }

    return valid.length > 0 ? valid : fallback;
  } catch {
    return fallback;
  }
}

export async function saveContentAction(
  slug: string,
  formData: FormData
): Promise<{ error: string | null; savedAt: number | null }> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "Unauthorized", savedAt: null };
  }

  const page = await getPageBySlug(slug);
  if (!page) {
    return { error: "Not found", savedAt: null };
  }

  if (!currentUser.isAdmin && page.user_id !== currentUser.userId) {
    return { error: "Forbidden", savedAt: null };
  }

  const existing = mergeWithDefaults(page.content);

  const imgCards = existing.birthGift.imgCards.map((card, i) => ({
    imgPath: str(formData, `imgCard.${i}.imgPath`) || card.imgPath,
    caption: str(formData, `imgCard.${i}.caption`) || card.caption,
    rotateAngle: num(formData, `imgCard.${i}.rotateAngle`, card.rotateAngle),
  }));

  const wishesRaw = str(formData, "releaseBalloon.wishes");
  const wishes = wishesRaw
    .split("\n")
    .map((w) => w.trim())
    .filter(Boolean);

  const correctCode = str(formData, "dateOfBirth.correctCode").trim();

  const updated = {
    ...existing,
    birthGift: {
      surpriseText: str(formData, "birthGift.surpriseText") || existing.birthGift.surpriseText,
      imgCards,
    },
    cake: {
      wishText: str(formData, "cake.wishText") || existing.cake.wishText,
    },
    scratchCard: {
      userWidth: num(formData, "scratchCard.userWidth", existing.scratchCard.userWidth),
      userHeight: num(formData, "scratchCard.userHeight", existing.scratchCard.userHeight),
      brushRadius: num(formData, "scratchCard.brushRadius", existing.scratchCard.brushRadius),
      revealThreshold: num(formData, "scratchCard.revealThreshold", existing.scratchCard.revealThreshold),
      maxVdoWidth: num(formData, "scratchCard.maxVdoWidth", existing.scratchCard.maxVdoWidth),
    },
    typingText: {
      message: str(formData, "typingText.message") || existing.typingText.message,
    },
    dateOfBirth: {
      ...existing.dateOfBirth,
      correctCode: /^\d{6}$/.test(correctCode) ? correctCode : existing.dateOfBirth.correctCode,
    },
    releaseBalloon: {
      ...existing.releaseBalloon,
      wishes: wishes.length > 0 ? wishes : existing.releaseBalloon.wishes,
    },
    flipPhotoCard: {
      dogImg: str(formData, "flipPhotoCard.dogImg") || existing.flipPhotoCard.dogImg,
      catImg: str(formData, "flipPhotoCard.catImg") || existing.flipPhotoCard.catImg,
    },
    slideInIcon: {
      title: str(formData, "slideInIcon.title") || existing.slideInIcon.title,
    },
    cinematicBirthdayBear: {
      title: str(formData, "cinematicBirthdayBear.title") || existing.cinematicBirthdayBear.title,
      subtitle: str(formData, "cinematicBirthdayBear.subtitle") || existing.cinematicBirthdayBear.subtitle,
    },
    sections: parseSections(formData, existing.sections),
  };

  await updatePageContent(page.id, updated);
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/edit`);

  return { error: null, savedAt: Date.now() };
}
