"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import {
    createUser,
    getUserByUsername,
    getUserById,
    updateUserAccount,
    deleteUser,
} from "@/lib/users";
import { createPageForUser, slugExists } from "@/lib/pages";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function validateDateRange(startDate: string, endDate: string): string | null {
    if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(endDate)) {
        return "Please provide both a start date and an end date";
    }
    if (startDate > endDate) {
        return "Start date must not be after end date";
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
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const slug = String(formData.get("slug") ?? "")
        .trim()
        .toLowerCase();
    const startDate = String(formData.get("startDate") ?? "");
    const endDate = String(formData.get("endDate") ?? "");

    if (!username || !password || !slug) {
        return { error: "Please fill in all fields" };
    }
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }
    if (password !== confirmPassword) {
        return { error: "Password and confirm password do not match" };
    }
    if (!SLUG_PATTERN.test(slug)) {
        return { error: "Slug may only contain lowercase letters, numbers, and hyphens" };
    }

    const dateError = validateDateRange(startDate, endDate);
    if (dateError) {
        return { error: dateError };
    }

    if (await getUserByUsername(username)) {
        return { error: "This username is already taken" };
    }
    if (await slugExists(slug)) {
        return { error: "This slug is already taken" };
    }

    const user = await createUser(username, password, false, startDate, endDate);
    await createPageForUser(user.id, slug);

    revalidatePath("/admin");
    return { error: null };
}

export async function updateUserAction(
    userId: number,
    formData: FormData
): Promise<{ error: string | null }> {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        return { error: "Forbidden" };
    }

    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const startDate = String(formData.get("startDate") ?? "");
    const endDate = String(formData.get("endDate") ?? "");

    if (!username) {
        return { error: "Please enter a username" };
    }
    if (password && password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    const dateError = validateDateRange(startDate, endDate);
    if (dateError) {
        return { error: dateError };
    }

    const existingWithUsername = await getUserByUsername(username);
    if (existingWithUsername && existingWithUsername.id !== userId) {
        return { error: "This username is already taken" };
    }

    await updateUserAccount(userId, {
        username,
        password: password || undefined,
        startDate,
        endDate,
    });
    revalidatePath("/admin");
    return { error: null };
}

export async function deleteUserAction(userId: number): Promise<{ error: string | null }> {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        return { error: "Forbidden" };
    }

    const target = await getUserById(userId);
    if (!target) {
        return { error: "User not found" };
    }
    if (target.is_admin) {
        return { error: "Admin accounts cannot be deleted" };
    }

    await deleteUser(userId);
    revalidatePath("/admin");
    return { error: null };
}
