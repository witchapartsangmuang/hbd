"use server";

import { revalidatePath } from "next/cache";
import { put, list } from "@vercel/blob";
import { mkdir, readdir, writeFile } from "fs/promises";
import { join } from "path";
import { getCurrentUser } from "@/lib/session";
import { getPageBySlug, updatePageContent } from "@/lib/pages";
import {
    mergeWithDefaults,
    SECTION_TYPES,
    SectionInstance,
} from "@/components/sections/utils/content-types";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function uploadImageAction(
    slug: string,
    formData: FormData
): Promise<{ url: string } | { error: string }> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return { error: "Unauthorized" };
    }

    const page = await getPageBySlug(slug);
    if (!page) {
        return { error: "Not found" };
    }

    if (!currentUser.isAdmin && page.user_id !== currentUser.userId) {
        return { error: "Forbidden" };
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
        return { error: "No file provided" };
    }
    if (!file.type.startsWith("image/")) {
        return { error: "File must be an image" };
    }
    if (file.size > MAX_UPLOAD_BYTES) {
        return { error: "File exceeds 5 MB" };
    }

    if (USE_BLOB) {
        try {
            const blob = await put(`uploads/${slug}/${file.name}`, file, {
                access: "public",
                addRandomSuffix: true,
            });
            return { url: blob.url };
        } catch {
            return { error: "Upload failed, please try again" };
        }
    }

    // Local fallback
    try {
        const ext = file.name.split(".").pop() ?? "bin";
        const base = file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[^a-zA-Z0-9._-]/g, "_")
            .slice(0, 60);
        const filename = `${Date.now()}-${base}.${ext}`;
        const uploadDir = join(process.cwd(), "public", "uploads", slug);
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
        return { url: `/uploads/${slug}/${filename}` };
    } catch {
        return { error: "Upload failed, please try again" };
    }
}

export async function listUploadedImagesAction(
    slug: string
): Promise<{ images: { url: string; name: string }[] } | { error: string }> {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return { error: "Unauthorized" };
    }

    const page = await getPageBySlug(slug);
    if (!page) {
        return { error: "Not found" };
    }

    if (!currentUser.isAdmin && page.user_id !== currentUser.userId) {
        return { error: "Forbidden" };
    }

    if (USE_BLOB) {
        try {
            const { blobs } = await list({ prefix: `uploads/${slug}/` });
            const images = blobs
                .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
                .map((blob) => ({
                    url: blob.url,
                    name: blob.pathname.split("/").pop() ?? blob.pathname,
                }));
            return { images };
        } catch {
            return { error: "Failed to load file list" };
        }
    }

    // Local fallback
    try {
        const uploadDir = join(process.cwd(), "public", "uploads", slug);
        const files = await readdir(uploadDir).catch(() => [] as string[]);
        const images = files
            .filter((f) => /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(f))
            .sort((a, b) => b.localeCompare(a)) // newest first (timestamp prefix)
            .map((f) => ({ url: `/uploads/${slug}/${f}`, name: f }));
        return { images };
    } catch {
        return { error: "Failed to load file list" };
    }
}

export async function uploadVideoAction(
    slug: string,
    formData: FormData
): Promise<{ url: string } | { error: string }> {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: "Unauthorized" };

    const page = await getPageBySlug(slug);
    if (!page) return { error: "Not found" };

    if (!currentUser.isAdmin && page.user_id !== currentUser.userId) return { error: "Forbidden" };

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) return { error: "No file provided" };
    if (!file.type.startsWith("video/")) return { error: "File must be a video" };
    if (file.size > MAX_VIDEO_BYTES) return { error: "File exceeds 200 MB" };

    if (USE_BLOB) {
        try {
            const blob = await put(`uploads/${slug}/${file.name}`, file, {
                access: "public",
                addRandomSuffix: true,
            });
            return { url: blob.url };
        } catch {
            return { error: "Upload failed, please try again" };
        }
    }

    try {
        const ext = file.name.split(".").pop() ?? "bin";
        const base = file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[^a-zA-Z0-9._-]/g, "_")
            .slice(0, 60);
        const filename = `${Date.now()}-${base}.${ext}`;
        const uploadDir = join(process.cwd(), "public", "uploads", slug);
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
        return { url: `/uploads/${slug}/${filename}` };
    } catch {
        return { error: "Upload failed, please try again" };
    }
}

export async function listUploadedVideosAction(
    slug: string
): Promise<{ videos: { url: string; name: string }[] } | { error: string }> {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: "Unauthorized" };

    const page = await getPageBySlug(slug);
    if (!page) return { error: "Not found" };

    if (!currentUser.isAdmin && page.user_id !== currentUser.userId) return { error: "Forbidden" };

    const VIDEO_EXT = /\.(mp4|mov|webm|mkv|avi|m4v)$/i;

    if (USE_BLOB) {
        try {
            const { blobs } = await list({ prefix: `uploads/${slug}/` });
            const videos = blobs
                .filter((b) => VIDEO_EXT.test(b.pathname))
                .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
                .map((blob) => ({
                    url: blob.url,
                    name: blob.pathname.split("/").pop() ?? blob.pathname,
                }));
            return { videos };
        } catch {
            return { error: "Failed to load file list" };
        }
    }

    try {
        const uploadDir = join(process.cwd(), "public", "uploads", slug);
        const files = await readdir(uploadDir).catch(() => [] as string[]);
        const videos = files
            .filter((f) => VIDEO_EXT.test(f))
            .sort((a, b) => b.localeCompare(a))
            .map((f) => ({ url: `/uploads/${slug}/${f}`, name: f }));
        return { videos };
    } catch {
        return { error: "Failed to load file list" };
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
                    ...(typeof item.label === "string" && item.label.trim()
                        ? { label: item.label.trim() }
                        : {}),
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
    _prevState: { error: string | null; savedAt: number | null },
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

    const imgCardsRaw = str(formData, "imgCards");
    let imgCards = existing.birthGift.imgCards;
    if (imgCardsRaw) {
        try {
            const parsed = JSON.parse(imgCardsRaw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                imgCards = parsed
                    .filter((c) => c && typeof c.imgPath === "string")
                    .map((c) => ({
                        imgPath: String(c.imgPath),
                        caption: typeof c.caption === "string" ? c.caption : "",
                        rotateAngle: Number.isFinite(Number(c.rotateAngle)) ? Number(c.rotateAngle) : 0,
                    }));
            }
        } catch {}
    }

    const wishesRaw = str(formData, "releaseBalloon.wishes");
    const wishes = wishesRaw
        .split("\n")
        .map((w) => w.trim())
        .filter(Boolean);

    const correctCode = str(formData, "dateOfBirth.correctCode").trim();

    const updated = {
        ...existing,
        birthGift: {
            surpriseText:
                str(formData, "birthGift.surpriseText") || existing.birthGift.surpriseText,
            imgCards,
        },
        cake: {
            wishText: str(formData, "cake.wishText") || existing.cake.wishText,
            wishTextAlign: (str(formData, "cake.wishTextAlign") || existing.cake.wishTextAlign || "center") as "left" | "center",
        },
        scratchCard: {
            userWidth: num(formData, "scratchCard.userWidth", existing.scratchCard.userWidth),
            aspectRatio:
                str(formData, "scratchCard.aspectRatio") || existing.scratchCard.aspectRatio || "16:9",
            brushRadius: num(formData, "scratchCard.brushRadius", existing.scratchCard.brushRadius),
            revealThreshold: num(
                formData,
                "scratchCard.revealThreshold",
                existing.scratchCard.revealThreshold
            ),
            maxVdoWidth: num(formData, "scratchCard.maxVdoWidth", existing.scratchCard.maxVdoWidth),
            revealType: (["youtube", "video", "image"].includes(
                str(formData, "scratchCard.revealType")
            )
                ? str(formData, "scratchCard.revealType")
                : existing.scratchCard.revealType) as "youtube" | "video" | "image",
            youtubeUrl:
                str(formData, "scratchCard.youtubeUrl") || existing.scratchCard.youtubeUrl,
            videoSrc: str(formData, "scratchCard.videoSrc") || existing.scratchCard.videoSrc,
            imageSrc: str(formData, "scratchCard.imageSrc") || existing.scratchCard.imageSrc,
            headingText: str(formData, "scratchCard.headingText") || existing.scratchCard.headingText,
            subText: str(formData, "scratchCard.subText") || existing.scratchCard.subText,
            revealedText: str(formData, "scratchCard.revealedText") || existing.scratchCard.revealedText,
        },
        typingText: {
            message: str(formData, "typingText.message") || existing.typingText.message,
            messageAlign: (str(formData, "typingText.messageAlign") || existing.typingText.messageAlign || "left") as "left" | "center",
        },
        dateOfBirth: {
            ...existing.dateOfBirth,
            correctCode: /^\d{6}$/.test(correctCode)
                ? correctCode
                : existing.dateOfBirth.correctCode,
        },
        releaseBalloon: {
            ...existing.releaseBalloon,
            wishes: wishes.length > 0 ? wishes : existing.releaseBalloon.wishes,
        },
        flipPhotoCard: {
            dogImg: str(formData, "flipPhotoCard.dogImg") || existing.flipPhotoCard.dogImg,
            catImg: str(formData, "flipPhotoCard.catImg") || existing.flipPhotoCard.catImg,
            dogEmoji: str(formData, "flipPhotoCard.dogEmoji"),
            catEmoji: str(formData, "flipPhotoCard.catEmoji"),
        },
        slideInIcon: {
            title: str(formData, "slideInIcon.title") || existing.slideInIcon.title,
        },
        cinematicBirthdayBear: {
            title:
                str(formData, "cinematicBirthdayBear.title") ||
                existing.cinematicBirthdayBear.title,
            subtitle:
                str(formData, "cinematicBirthdayBear.subtitle") ||
                existing.cinematicBirthdayBear.subtitle,
        },
        sections: parseSections(formData, existing.sections),
    };

    await updatePageContent(page.id, updated);
    revalidatePath(`/${slug}`);
    revalidatePath(`/${slug}/edit`);

    return { error: null, savedAt: Date.now() };
}
