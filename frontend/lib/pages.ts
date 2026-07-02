import { query } from "./db";
import { HbdContent } from "@/app/hbd/utils/content-types";

export interface PageRow {
  id: number;
  slug: string;
  user_id: number;
  content: HbdContent;
  created_at: Date;
  updated_at: Date;
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
  content: HbdContent
): Promise<PageRow> {
  const rows = await query<PageRow>(
    "INSERT INTO pages (slug, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [slug, userId, JSON.stringify(content)]
  );
  return rows[0];
}

export async function updatePageContent(pageId: number, content: HbdContent): Promise<void> {
  await query(
    "UPDATE pages SET content = $1, updated_at = now() WHERE id = $2",
    [JSON.stringify(content), pageId]
  );
}
