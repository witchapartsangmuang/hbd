import {
    HbdContent,
    SECTION_TYPES,
    SectionInstance,
    SectionType,
} from "@/components/sections/utils/content-types";

// Every section editor panel is always mounted in the edit form, so a text
// field that the admin cleared arrives as an empty string — and must save as
// empty. The existing value is only used when the key is absent from the
// FormData entirely (e.g. a stale form built before the field existed).
function strOr(formData: FormData, key: string, fallback: string): string {
    const value = formData.get(key);
    return value === null ? fallback : String(value);
}

/** Strict read for constrained fields that validate/coerce their own value. */
function str(formData: FormData, key: string): string {
    return String(formData.get(key) ?? "");
}

function num(formData: FormData, key: string, fallback: number): number {
    const value = Number(formData.get(key));
    return Number.isFinite(value) ? value : fallback;
}

/** Newline-separated list field; an intentionally emptied textarea saves as []. */
function linesOr(formData: FormData, key: string, fallback: string[]): string[] {
    const raw = formData.get(key);
    if (raw === null) return fallback;
    return String(raw)
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
}

/**
 * JSON-array field written by an Add/Remove list UI (never free-typed), so an
 * intentionally emptied list saves as [] rather than falling back; only
 * malformed JSON keeps the existing value.
 */
function jsonListOr<T>(
    formData: FormData,
    key: string,
    isValid: (item: unknown) => item is T,
    fallback: T[]
): T[] {
    const raw = formData.get(key);
    if (raw === null) return fallback;
    try {
        const parsed = JSON.parse(String(raw));
        if (Array.isArray(parsed)) return parsed.filter(isValid);
    } catch {
        // keep existing on malformed JSON
    }
    return fallback;
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

function isGuestbookEntry(item: unknown): item is { name: string; message: string } {
    if (!item || typeof item !== "object") return false;
    const i = item as Record<string, unknown>;
    return typeof i.name === "string" && typeof i.message === "string";
}

/**
 * Pure merge of an edit-form submission into a page's existing content.
 * Extracted from the save server action so the (large) field-by-field merge
 * rules can be unit-tested without touching auth, DB, or Next.js APIs.
 */
export function mergeContentFromForm(existing: HbdContent, formData: FormData): HbdContent {
    const sections = parseSections(formData, existing.sections ?? []);

    const themeBaseColorRaw = str(formData, "theme.baseColor").trim();
    const themeBaseColor = /^#[0-9a-fA-F]{6}$/.test(themeBaseColorRaw)
        ? themeBaseColorRaw
        : (existing.theme?.baseColor ?? "#f43f5e");

    return {
        ...existing,
        theme: {
            baseColor: themeBaseColor,
        },
        share: {
            title: strOr(formData, "share.title", existing.share?.title ?? ""),
            description: strOr(formData, "share.description", existing.share?.description ?? ""),
            imagePath: strOr(formData, "share.imagePath", existing.share?.imagePath ?? ""),
        },
        birthGift: perInstance(sections, "birthGift", existing.birthGift, (prefix, ex) => {
            const imgCardsRaw = formData.get(`${prefix}imgCards`);
            let imgCards = ex?.imgCards ?? [];
            if (imgCardsRaw !== null) {
                try {
                    const parsed = JSON.parse(String(imgCardsRaw));
                    if (Array.isArray(parsed)) {
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
                surpriseText: strOr(formData, `${prefix}surpriseText`, ex?.surpriseText ?? ""),
                imgCards,
            };
        }),
        cake: perInstance(sections, "cake", existing.cake, (prefix, ex) => ({
            wishText: strOr(formData, `${prefix}wishText`, ex?.wishText ?? ""),
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
            youtubeUrl: strOr(formData, `${prefix}youtubeUrl`, ex?.youtubeUrl ?? ""),
            videoSrc: strOr(formData, `${prefix}videoSrc`, ex?.videoSrc ?? ""),
            imageSrc: strOr(formData, `${prefix}imageSrc`, ex?.imageSrc ?? ""),
            headingText: strOr(formData, `${prefix}headingText`, ex?.headingText ?? ""),
            subText: strOr(formData, `${prefix}subText`, ex?.subText ?? ""),
            revealedText: strOr(formData, `${prefix}revealedText`, ex?.revealedText ?? ""),
        })),
        typingText: perInstance(sections, "typingText", existing.typingText, (prefix, ex) => ({
            message: strOr(formData, `${prefix}message`, ex?.message ?? ""),
            messageAlign: (str(formData, `${prefix}messageAlign`) || ex?.messageAlign || "left") as
                "left" | "center",
        })),
        secretCode: perInstance(sections, "secretCode", existing.secretCode, (prefix, ex) => {
            const correctCode = str(formData, `${prefix}correctCode`).trim();
            const _dc = Number(str(formData, `${prefix}digitCount`));
            const digitCount = _dc === 2 || _dc === 6 || _dc === 8 ? _dc : 4;
            const _ar = str(formData, `${prefix}aspectRatio`);
            const aspectRatio = ["1:1", "3:4", "4:3", "9:16", "16:9"].includes(_ar)
                ? _ar
                : (ex?.aspectRatio ?? "3:4");
            return {
                digitCount: digitCount as 2 | 4 | 6 | 8,
                correctCode: new RegExp(`^\\d{${digitCount}}$`).test(correctCode)
                    ? correctCode
                    : (ex?.correctCode ?? ""),
                hint: strOr(formData, `${prefix}hint`, ex?.hint ?? ""),
                revealImage: strOr(formData, `${prefix}revealImage`, ex?.revealImage ?? ""),
                aspectRatio,
            };
        }),
        releaseBalloon: perInstance(
            sections,
            "releaseBalloon",
            existing.releaseBalloon,
            (prefix, ex) => {
                const balloonCount = num(formData, `${prefix}balloonCount`, ex?.balloonCount ?? 5);
                return {
                    wishes: linesOr(formData, `${prefix}wishes`, ex?.wishes ?? []),
                    balloonGradients: ex?.balloonGradients ?? [],
                    balloonCount: Math.min(10, Math.max(1, balloonCount)),
                };
            }
        ),
        flipPhotoCard: perInstance(
            sections,
            "flipPhotoCard",
            existing.flipPhotoCard,
            (prefix, ex) => ({
                aspectRatio: str(formData, `${prefix}aspectRatio`) || ex?.aspectRatio || "3:4",
                dogImg: strOr(formData, `${prefix}dogImg`, ex?.dogImg ?? ""),
                catImg: strOr(formData, `${prefix}catImg`, ex?.catImg ?? ""),
                dogEmoji: str(formData, `${prefix}dogEmoji`),
                catEmoji: str(formData, `${prefix}catEmoji`),
                dogLabel: strOr(formData, `${prefix}dogLabel`, ex?.dogLabel ?? ""),
                catLabel: strOr(formData, `${prefix}catLabel`, ex?.catLabel ?? ""),
                subtitle: strOr(formData, `${prefix}subtitle`, ex?.subtitle ?? ""),
                frontText: strOr(formData, `${prefix}frontText`, ex?.frontText ?? ""),
            })
        ),
        slideInIcon: perInstance(sections, "slideInIcon", existing.slideInIcon, (prefix, ex) => ({
            title: strOr(formData, `${prefix}title`, ex?.title ?? ""),
        })),
        cinematicBirthdayBear: perInstance(
            sections,
            "cinematicBirthdayBear",
            existing.cinematicBirthdayBear,
            (prefix, ex) => ({
                title: strOr(formData, `${prefix}title`, ex?.title ?? ""),
                subtitle: strOr(formData, `${prefix}subtitle`, ex?.subtitle ?? ""),
            })
        ),
        spinTheWheel: perInstance(
            sections,
            "spinTheWheel",
            existing.spinTheWheel,
            (prefix, ex) => ({
                prizes: linesOr(formData, `${prefix}prizes`, ex?.prizes ?? []),
            })
        ),
        jigsawPhotoPuzzle: perInstance(
            sections,
            "jigsawPhotoPuzzle",
            existing.jigsawPhotoPuzzle,
            (prefix, ex) => ({
                imagePath: strOr(formData, `${prefix}imagePath`, ex?.imagePath ?? ""),
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
                questions: jsonListOr(
                    formData,
                    `${prefix}questionsJson`,
                    isQuizQuestion,
                    ex?.questions ?? []
                ),
            })
        ),
        giftBoxUnwrap: perInstance(
            sections,
            "giftBoxUnwrap",
            existing.giftBoxUnwrap,
            (prefix, ex) => {
                const imagesRaw = formData.get(`${prefix}images`);
                let images = ex?.images ?? [];
                if (imagesRaw !== null) {
                    try {
                        const parsed = JSON.parse(String(imagesRaw));
                        if (Array.isArray(parsed)) {
                            images = parsed
                                .filter((c) => c && typeof c.imgPath === "string")
                                .map((c) => ({
                                    imgPath: String(c.imgPath),
                                    caption: typeof c.caption === "string" ? c.caption : "",
                                    aspectRatio:
                                        typeof c.aspectRatio === "string" ? c.aspectRatio : "3:4",
                                }));
                        }
                    } catch {}
                }
                return {
                    images,
                    message: strOr(formData, `${prefix}message`, ex?.message ?? ""),
                };
            }
        ),
        envelopeOpen: perInstance(
            sections,
            "envelopeOpen",
            existing.envelopeOpen,
            (prefix, ex) => ({
                senderName: strOr(formData, `${prefix}senderName`, ex?.senderName ?? ""),
                message: strOr(formData, `${prefix}message`, ex?.message ?? ""),
            })
        ),
        polaroidShake: perInstance(
            sections,
            "polaroidShake",
            existing.polaroidShake,
            (prefix, ex) => ({
                imgPath: strOr(formData, `${prefix}imgPath`, ex?.imgPath ?? ""),
                caption: strOr(formData, `${prefix}caption`, ex?.caption ?? ""),
                aspectRatio: str(formData, `${prefix}aspectRatio`) || ex?.aspectRatio || "1:1",
                eyebrow: str(formData, `${prefix}eyebrow`),
                heading: str(formData, `${prefix}heading`),
            })
        ),
        countdownToNextBirthday: perInstance(
            sections,
            "countdownToNextBirthday",
            existing.countdownToNextBirthday,
            (prefix, ex) => ({
                birthdayYear: Math.min(
                    3000,
                    Math.max(
                        1970,
                        num(
                            formData,
                            `${prefix}birthdayYear`,
                            ex?.birthdayYear ?? new Date().getFullYear()
                        )
                    )
                ),
                birthdayMonth: Math.min(
                    12,
                    Math.max(1, num(formData, `${prefix}birthdayMonth`, ex?.birthdayMonth ?? 12))
                ),
                birthdayDay: Math.min(
                    31,
                    Math.max(1, num(formData, `${prefix}birthdayDay`, ex?.birthdayDay ?? 18))
                ),
                message: strOr(formData, `${prefix}message`, ex?.message ?? ""),
            })
        ),
        memoryTimeline: perInstance(
            sections,
            "memoryTimeline",
            existing.memoryTimeline,
            (prefix, ex) => {
                const raw = formData.get(`${prefix}itemsJson`);
                let items = ex?.items ?? [];
                if (raw !== null) {
                    try {
                        const parsed = JSON.parse(String(raw));
                        if (Array.isArray(parsed)) {
                            items = parsed
                                .filter(
                                    (c) =>
                                        c &&
                                        typeof c.year === "string" &&
                                        typeof c.imgPath === "string" &&
                                        typeof c.caption === "string"
                                )
                                .map((c) => ({
                                    year: String(c.year),
                                    imgPath: String(c.imgPath),
                                    caption: String(c.caption),
                                    aspectRatio:
                                        typeof c.aspectRatio === "string" ? c.aspectRatio : "4:3",
                                }));
                        }
                    } catch {
                        // keep existing on malformed JSON
                    }
                }
                return { items };
            }
        ),
        guestbookWall: perInstance(
            sections,
            "guestbookWall",
            existing.guestbookWall,
            (prefix, ex) => ({
                wishes: jsonListOr(
                    formData,
                    `${prefix}wishesJson`,
                    isGuestbookEntry,
                    ex?.wishes ?? []
                ),
            })
        ),
        digitalSignature: perInstance(
            sections,
            "digitalSignature",
            existing.digitalSignature,
            (prefix, ex) => ({
                promptText: strOr(formData, `${prefix}promptText`, ex?.promptText ?? ""),
                eyebrow: strOr(formData, `${prefix}eyebrow`, ex?.eyebrow ?? "Seal It With Love"),
                heading: strOr(formData, `${prefix}heading`, ex?.heading ?? "Sign the Card ✍️"),
            })
        ),
        backgroundMusicPlayer: perInstance(
            sections,
            "backgroundMusicPlayer",
            existing.backgroundMusicPlayer,
            (prefix, ex) => ({
                audioSrc: strOr(formData, `${prefix}audioSrc`, ex?.audioSrc ?? ""),
                songName: strOr(formData, `${prefix}songName`, ex?.songName ?? ""),
                singerName: strOr(formData, `${prefix}singerName`, ex?.singerName ?? ""),
                coverImagePath: strOr(
                    formData,
                    `${prefix}coverImagePath`,
                    ex?.coverImagePath ?? ""
                ),
                startAtSeconds: Math.max(
                    0,
                    num(formData, `${prefix}startAtSeconds`, ex?.startAtSeconds ?? 0)
                ),
            })
        ),
        cinematicRabbit: perInstance(
            sections,
            "cinematicRabbit",
            existing.cinematicRabbit,
            (prefix, ex) => ({
                title: strOr(formData, `${prefix}title`, ex?.title ?? ""),
                subtitle: strOr(formData, `${prefix}subtitle`, ex?.subtitle ?? ""),
            })
        ),
        cinematicPanda: perInstance(
            sections,
            "cinematicPanda",
            existing.cinematicPanda,
            (prefix, ex) => ({
                title: strOr(formData, `${prefix}title`, ex?.title ?? ""),
                subtitle: strOr(formData, `${prefix}subtitle`, ex?.subtitle ?? ""),
            })
        ),
        confettiColors: existing.confettiColors,
        sections,
    };
}
