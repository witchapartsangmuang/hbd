import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { getCurrentUser } from "@/lib/session";
import { getPageBySlug } from "@/lib/pages";

const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const page = await getPageBySlug(slug);
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!currentUser.isAdmin && page.user_id !== currentUser.userId)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0)
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!file.type.startsWith("video/"))
        return NextResponse.json({ error: "File must be a video" }, { status: 400 });
    if (file.size > MAX_VIDEO_BYTES)
        return NextResponse.json({ error: "File exceeds 200 MB" }, { status: 400 });

    try {
        console.log("upload-video: USE_BLOB =", USE_BLOB);
        if (USE_BLOB) {
            const blob = await put(`uploads/${slug}/${file.name}`, file, {
                access: "public",
                addRandomSuffix: true,
            });
            return NextResponse.json({ url: blob.url });
        }

        const ext = file.name.split(".").pop() ?? "bin";
        const base = file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[^a-zA-Z0-9._-]/g, "_")
            .slice(0, 60);
        const filename = `${Date.now()}-${base}.${ext}`;
        const uploadDir = join(process.cwd(), "public", "uploads", slug);
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
        return NextResponse.json({ url: `/uploads/${slug}/${filename}` });
    } catch (err) {
        console.error("upload-video failed", err);
        return NextResponse.json({ error: "Upload failed, please try again" }, { status: 500 });
    }
}
