"use server";

import { revalidatePath } from "next/cache";
import { put, list } from "@vercel/blob";
import { mkdir, readdir, writeFile } from "fs/promises";
import { join } from "path";
import { getCurrentUser } from "@/lib/session";
import { getPageBySlug, updatePageContent } from "@/lib/pages";
import {
    SECTION_TYPES,
    SectionInstance,
    SectionType,
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

        const valid: SectionInstance[] = [];

        for (const item of parsed) {
            if (
                item &&
                typeof item.id === "string" &&
                typeof item.type === "string" &&
                typeof item.enabled === "boolean" &&
                (SECTION_TYPES as string[]).includes(item.type)
            ) {
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

/**
 * Runs `parse` once per SectionInstance of the given `type`, keyed by instance id, so each
 * duplicate section of the same type gets its own independently-saved content bucket.
 */
function perInstance<T>(
    sections: SectionInstance[],
    type: SectionType,
    existingMap: Record<string, T> | undefined,
    parse: (prefix: string, existing: T | undefined) => T
): Record<string, T> {
    const result: Record<string, T> = {};
    for (const section of sections) {
        if (section.type !== type) continue;
        result[section.id] = parse(`${type}.${section.id}.`, existingMap?.[section.id]);
    }
    return result;
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

    const existing = page.content;
    const sections = parseSections(formData, existing.sections ?? []);

    const themeBaseColorRaw = str(formData, "theme.baseColor").trim();
    const themeBaseColor = /^#[0-9a-fA-F]{6}$/.test(themeBaseColorRaw)
        ? themeBaseColorRaw
        : (existing.theme?.baseColor ?? "#f43f5e");

    function parseJsonArray<T>(raw: string, isValid: (item: unknown) => item is T): T[] | null {
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return null;
            const valid = parsed.filter(isValid);
            return valid.length > 0 ? valid : null;
        } catch {
            return null;
        }
    }

    function isQuizQuestion(item: unknown): item is {
        question: string;
        options: string[];
        correctIndex: number;
    } {
        if (!item || typeof item !== "object") return false;
        const q = item as Record<string, unknown>;
        return (
            typeof q.question === "string" &&
            Array.isArray(q.options) &&
            q.options.every((o) => typeof o === "string") &&
            typeof q.correctIndex === "number"
        );
    }

    function isMemoryTimelineItem(item: unknown): item is {
        year: string;
        imgPath: string;
        caption: string;
    } {
        if (!item || typeof item !== "object") return false;
        const i = item as Record<string, unknown>;
        return (
            typeof i.year === "string" &&
            typeof i.imgPath === "string" &&
            typeof i.caption === "string"
        );
    }

    function isGuestbookEntry(item: unknown): item is { name: string; message: string } {
        if (!item || typeof item !== "object") return false;
        const i = item as Record<string, unknown>;
        return typeof i.name === "string" && typeof i.message === "string";
    }

    const updated = {
        ...existing,
        theme: {
            baseColor: themeBaseColor,
        },
        birthGift: perInstance(sections, "birthGift", existing.birthGift, (prefix, ex) => {
            const imgCardsRaw = str(formData, `${prefix}imgCards`);
            let imgCards = ex?.imgCards ?? [];
            if (imgCardsRaw) {
                try {
                    const parsed = JSON.parse(imgCardsRaw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        imgCards = parsed
                            .filter((c) => c && typeof c.imgPath === "string")
                            .map((c) => ({
                                imgPath: String(c.imgPath),
                                caption: typeof c.caption === "string" ? c.caption : "",
                                rotateAngle: Number.isFinite(Number(c.rotateAngle))
                                    ? Number(c.rotateAngle)
                                    : 0,
                                aspectRatio:
                                    typeof c.aspectRatio === "string" ? c.aspectRatio : "3:4",
                            }));
                    }
                } catch {}
            }
            return {
                surpriseText: str(formData, `${prefix}surpriseText`) || (ex?.surpriseText ?? ""),
                imgCards,
            };
        }),
        cake: perInstance(sections, "cake", existing.cake, (prefix, ex) => ({
            wishText: str(formData, `${prefix}wishText`) || (ex?.wishText ?? ""),
            wishTextAlign: (str(formData, `${prefix}wishTextAlign`) ||
                ex?.wishTextAlign ||
                "center") as "left" | "center",
        })),
        scratchCard: perInstance(sections, "scratchCard", existing.scratchCard, (prefix, ex) => ({
            aspectRatio: str(formData, `${prefix}aspectRatio`) || ex?.aspectRatio || "16:9",
            brushRadius: num(formData, `${prefix}brushRadius`, ex?.brushRadius ?? 56),
            revealThreshold: num(formData, `${prefix}revealThreshold`, ex?.revealThreshold ?? 50),
            revealType: (["youtube", "video", "image"].includes(
                str(formData, `${prefix}revealType`)
            )
                ? str(formData, `${prefix}revealType`)
                : (ex?.revealType ?? "youtube")) as "youtube" | "video" | "image",
            youtubeUrl: str(formData, `${prefix}youtubeUrl`) || (ex?.youtubeUrl ?? ""),
            videoSrc: str(formData, `${prefix}videoSrc`) || (ex?.videoSrc ?? ""),
            imageSrc: str(formData, `${prefix}imageSrc`) || (ex?.imageSrc ?? ""),
            headingText: str(formData, `${prefix}headingText`) || (ex?.headingText ?? ""),
            subText: str(formData, `${prefix}subText`) || (ex?.subText ?? ""),
            revealedText: str(formData, `${prefix}revealedText`) || (ex?.revealedText ?? ""),
        })),
        typingText: perInstance(sections, "typingText", existing.typingText, (prefix, ex) => ({
            message: str(formData, `${prefix}message`) || (ex?.message ?? ""),
            messageAlign: (str(formData, `${prefix}messageAlign`) ||
                ex?.messageAlign ||
                "left") as "left" | "center",
        })),
        dateOfBirth: perInstance(sections, "dateOfBirth", existing.dateOfBirth, (prefix, ex) => {
            const correctCode = str(formData, `${prefix}correctCode`).trim();
            const _dc = Number(str(formData, `${prefix}digitCount`));
            const digitCount = _dc === 4 || _dc === 8 ? _dc : 6;
            return {
                digitCount: digitCount as 4 | 6 | 8,
                formatPlaceholder:
                    digitCount === 4
                        ? ["D", "D", "M", "M"]
                        : digitCount === 8
                          ? ["D", "D", "M", "M", "Y", "Y", "Y", "Y"]
                          : ["D", "D", "M", "M", "Y", "Y"],
                emptyDigits: Array(digitCount).fill(""),
                correctCode: new RegExp(`^\\d{${digitCount}}$`).test(correctCode)
                    ? correctCode
                    : (ex?.correctCode ?? ""),
            };
        }),
        releaseBalloon: perInstance(
            sections,
            "releaseBalloon",
            existing.releaseBalloon,
            (prefix, ex) => {
                const wishes = str(formData, `${prefix}wishes`)
                    .split("\n")
                    .map((w) => w.trim())
                    .filter(Boolean);
                return {
                    wishes: wishes.length > 0 ? wishes : (ex?.wishes ?? []),
                    balloonGradients: ex?.balloonGradients ?? [],
                };
            }
        ),
        flipPhotoCard: perInstance(
            sections,
            "flipPhotoCard",
            existing.flipPhotoCard,
            (prefix, ex) => ({
                aspectRatio: str(formData, `${prefix}aspectRatio`) || ex?.aspectRatio || "3:4",
                dogImg: str(formData, `${prefix}dogImg`) || (ex?.dogImg ?? ""),
                catImg: str(formData, `${prefix}catImg`) || (ex?.catImg ?? ""),
                dogEmoji: str(formData, `${prefix}dogEmoji`),
                catEmoji: str(formData, `${prefix}catEmoji`),
                dogLabel: str(formData, `${prefix}dogLabel`) || (ex?.dogLabel ?? ""),
                catLabel: str(formData, `${prefix}catLabel`) || (ex?.catLabel ?? ""),
            })
        ),
        slideInIcon: perInstance(sections, "slideInIcon", existing.slideInIcon, (prefix, ex) => ({
            title: str(formData, `${prefix}title`) || (ex?.title ?? ""),
        })),
        cinematicBirthdayBear: perInstance(
            sections,
            "cinematicBirthdayBear",
            existing.cinematicBirthdayBear,
            (prefix, ex) => ({
                title: str(formData, `${prefix}title`) || (ex?.title ?? ""),
                subtitle: str(formData, `${prefix}subtitle`) || (ex?.subtitle ?? ""),
            })
        ),
        spinTheWheel: perInstance(sections, "spinTheWheel", existing.spinTheWheel, (prefix, ex) => {
            const prizes = str(formData, `${prefix}prizes`)
                .split("\n")
                .map((p) => p.trim())
                .filter(Boolean);
            return { prizes: prizes.length > 0 ? prizes : (ex?.prizes ?? []) };
        }),
        jigsawPhotoPuzzle: perInstance(
            sections,
            "jigsawPhotoPuzzle",
            existing.jigsawPhotoPuzzle,
            (prefix, ex) => ({
                imagePath: str(formData, `${prefix}imagePath`) || (ex?.imagePath ?? ""),
                gridSize: Math.min(
                    5,
                    Math.max(2, num(formData, `${prefix}gridSize`, ex?.gridSize ?? 3))
                ),
            })
        ),
        quizAboutYou: perInstance(
            sections,
            "quizAboutYou",
            existing.quizAboutYou,
            (prefix, ex) => ({
                questions:
                    parseJsonArray(str(formData, `${prefix}questionsJson`), isQuizQuestion) ??
                    ex?.questions ??
                    [],
            })
        ),
        candleBlow: perInstance(sections, "candleBlow", existing.candleBlow, (prefix, ex) => ({
            candleCount: num(formData, `${prefix}candleCount`, ex?.candleCount ?? 3),
            message: str(formData, `${prefix}message`) || (ex?.message ?? ""),
        })),
        giftBoxUnwrap: perInstance(
            sections,
            "giftBoxUnwrap",
            existing.giftBoxUnwrap,
            (prefix, ex) => ({
                imgPath: str(formData, `${prefix}imgPath`) || (ex?.imgPath ?? ""),
                message: str(formData, `${prefix}message`) || (ex?.message ?? ""),
            })
        ),
        envelopeOpen: perInstance(
            sections,
            "envelopeOpen",
            existing.envelopeOpen,
            (prefix, ex) => ({
                senderName: str(formData, `${prefix}senderName`) || (ex?.senderName ?? ""),
                message: str(formData, `${prefix}message`) || (ex?.message ?? ""),
            })
        ),
        polaroidShake: perInstance(
            sections,
            "polaroidShake",
            existing.polaroidShake,
            (prefix, ex) => ({
                imgPath: str(formData, `${prefix}imgPath`) || (ex?.imgPath ?? ""),
                caption: str(formData, `${prefix}caption`) || (ex?.caption ?? ""),
                aspectRatio: str(formData, `${prefix}aspectRatio`) || ex?.aspectRatio || "1:1",
                eyebrow: str(formData, `${prefix}eyebrow`) || (ex?.eyebrow ?? ""),
                heading: str(formData, `${prefix}heading`) || (ex?.heading ?? ""),
            })
        ),
        countdownToNextBirthday: perInstance(
            sections,
            "countdownToNextBirthday",
            existing.countdownToNextBirthday,
            (prefix, ex) => ({
                birthdayMonth: Math.min(
                    12,
                    Math.max(1, num(formData, `${prefix}birthdayMonth`, ex?.birthdayMonth ?? 12))
                ),
                birthdayDay: Math.min(
                    31,
                    Math.max(1, num(formData, `${prefix}birthdayDay`, ex?.birthdayDay ?? 18))
                ),
                message: str(formData, `${prefix}message`) || (ex?.message ?? ""),
            })
        ),
        memoryTimeline: perInstance(
            sections,
            "memoryTimeline",
            existing.memoryTimeline,
            (prefix, ex) => ({
                items:
                    parseJsonArray(str(formData, `${prefix}itemsJson`), isMemoryTimelineItem) ??
                    ex?.items ??
                    [],
            })
        ),
        voiceMessage: perInstance(sections, "voiceMessage", existing.voiceMessage, (prefix, ex) => ({
            audioSrc: str(formData, `${prefix}audioSrc`) || (ex?.audioSrc ?? ""),
            message: str(formData, `${prefix}message`) || (ex?.message ?? ""),
        })),
        zodiacReveal: perInstance(
            sections,
            "zodiacReveal",
            existing.zodiacReveal,
            (prefix, ex) => ({
                customMessage: str(formData, `${prefix}customMessage`) || (ex?.customMessage ?? ""),
            })
        ),
        guestbookWall: perInstance(
            sections,
            "guestbookWall",
            existing.guestbookWall,
            (prefix, ex) => ({
                wishes:
                    parseJsonArray(str(formData, `${prefix}wishesJson`), isGuestbookEntry) ??
                    ex?.wishes ??
                    [],
            })
        ),
        digitalSignature: perInstance(
            sections,
            "digitalSignature",
            existing.digitalSignature,
            (prefix, ex) => ({
                promptText: str(formData, `${prefix}promptText`) || (ex?.promptText ?? ""),
            })
        ),
        backgroundMusicPlayer: perInstance(
            sections,
            "backgroundMusicPlayer",
            existing.backgroundMusicPlayer,
            (prefix, ex) => ({
                audioSrc: str(formData, `${prefix}audioSrc`) || (ex?.audioSrc ?? ""),
                label: str(formData, `${prefix}label`) || (ex?.label ?? ""),
            })
        ),
        cinematicRabbit: perInstance(
            sections,
            "cinematicRabbit",
            existing.cinematicRabbit,
            (prefix, ex) => ({
                title: str(formData, `${prefix}title`) || (ex?.title ?? ""),
                subtitle: str(formData, `${prefix}subtitle`) || (ex?.subtitle ?? ""),
            })
        ),
        cinematicPanda: perInstance(
            sections,
            "cinematicPanda",
            existing.cinematicPanda,
            (prefix, ex) => ({
                title: str(formData, `${prefix}title`) || (ex?.title ?? ""),
                subtitle: str(formData, `${prefix}subtitle`) || (ex?.subtitle ?? ""),
            })
        ),
        fireworksFinale: perInstance(
            sections,
            "fireworksFinale",
            existing.fireworksFinale,
            (prefix, ex) => ({
                message: str(formData, `${prefix}message`) || (ex?.message ?? ""),
            })
        ),
        confettiColors: existing.confettiColors,
        sections,
    };

    await updatePageContent(page.id, updated);
    revalidatePath(`/${slug}`);
    revalidatePath(`/${slug}/edit`);

    return { error: null, savedAt: Date.now() };
}
