import { query } from "./db";
import { HbdContent } from "@/components/sections/utils/content-types";

export interface PageRow {
    id: number;
    slug: string;
    user_id: number;
    content: HbdContent;
    created_at: Date;
    updated_at: Date;
    view_count: number;
    first_viewed_at: Date | null;
    last_viewed_at: Date | null;
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
    const rows = await query<PageRow>("SELECT * FROM pages WHERE slug = $1", [slug]);
    return rows[0] ?? null;
}

export async function getPageForUser(userId: number): Promise<PageRow | null> {
    const rows = await query<PageRow>("SELECT * FROM pages WHERE user_id = $1", [userId]);
    return rows[0] ?? null;
}

export async function slugExists(slug: string): Promise<boolean> {
    const rows = await query<{ exists: boolean }>(
        "SELECT EXISTS(SELECT 1 FROM pages WHERE slug = $1) AS exists",
        [slug]
    );
    return rows[0]?.exists ?? false;
}

export async function createPageForUser(
    userId: number,
    slug: string,
    content: object = {}
): Promise<PageRow> {
    const rows = await query<PageRow>(
        "INSERT INTO pages (slug, user_id, content) VALUES ($1, $2, $3) RETURNING *",
        [slug, userId, JSON.stringify(content)]
    );
    return rows[0];
}

export async function recordPageView(pageId: number): Promise<void> {
    await query(
        `UPDATE pages
         SET view_count = view_count + 1,
             first_viewed_at = COALESCE(first_viewed_at, now()),
             last_viewed_at = now()
         WHERE id = $1`,
        [pageId]
    );
}

export async function updatePageContent(pageId: number, content: HbdContent): Promise<void> {
    await query("UPDATE pages SET content = $1, updated_at = now() WHERE id = $2", [
        JSON.stringify(content),
        pageId,
    ]);
}
