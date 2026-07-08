"use server";

import { revalidatePath } from "next/cache";
import { put, list } from "@vercel/blob";
import { mkdir, readdir, writeFile } from "fs/promises";
import { join } from "path";
import { getCurrentUser } from "@/lib/session";
import { getPageBySlug, updatePageContent } from "@/lib/pages";
import { mergeContentFromForm } from "@/lib/merge-content";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
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

export async function uploadAudioAction(
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
    if (!file.type.startsWith("audio/")) return { error: "File must be an audio file" };
    if (file.size > MAX_AUDIO_BYTES) return { error: "File exceeds 50 MB" };

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

export async function listUploadedAudioAction(
    slug: string
): Promise<{ audios: { url: string; name: string }[] } | { error: string }> {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: "Unauthorized" };

    const page = await getPageBySlug(slug);
    if (!page) return { error: "Not found" };

    if (!currentUser.isAdmin && page.user_id !== currentUser.userId) return { error: "Forbidden" };

    const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;

    if (USE_BLOB) {
        try {
            const { blobs } = await list({ prefix: `uploads/${slug}/` });
            const audios = blobs
                .filter((b) => AUDIO_EXT.test(b.pathname))
                .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
                .map((blob) => ({
                    url: blob.url,
                    name: blob.pathname.split("/").pop() ?? blob.pathname,
                }));
            return { audios };
        } catch {
            return { error: "Failed to load file list" };
        }
    }

    try {
        const uploadDir = join(process.cwd(), "public", "uploads", slug);
        const files = await readdir(uploadDir).catch(() => [] as string[]);
        const audios = files
            .filter((f) => AUDIO_EXT.test(f))
            .sort((a, b) => b.localeCompare(a))
            .map((f) => ({ url: `/uploads/${slug}/${f}`, name: f }));
        return { audios };
    } catch {
        return { error: "Failed to load file list" };
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

    const updated = mergeContentFromForm(page.content, formData);

    await updatePageContent(page.id, updated);
    revalidatePath(`/${slug}`);
    revalidatePath(`/${slug}/edit`);

    return { error: null, savedAt: Date.now() };
}
