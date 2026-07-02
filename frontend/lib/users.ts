import { query } from "./db";
import { hashPassword } from "./auth";

export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  is_admin: boolean;
  start_date: Date | string | null;
  end_date: Date | string | null;
  created_at: Date;
}

export async function createUser(
  username: string,
  password: string,
  isAdmin = false,
  startDate?: string | null,
  endDate?: string | null
): Promise<UserRow> {
  const passwordHash = await hashPassword(password);
  const rows = await query<UserRow>(
    "INSERT INTO users (username, password_hash, is_admin, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [username, passwordHash, isAdmin, startDate ?? null, endDate ?? null]
  );
  return rows[0];
}

export async function updateUserAccount(
  id: number,
  fields: { username: string; password?: string; startDate: string; endDate: string }
): Promise<void> {
  if (fields.password) {
    const passwordHash = await hashPassword(fields.password);
    await query(
      "UPDATE users SET username = $1, password_hash = $2, start_date = $3, end_date = $4 WHERE id = $5",
      [fields.username, passwordHash, fields.startDate, fields.endDate, id]
    );
  } else {
    await query(
      "UPDATE users SET username = $1, start_date = $2, end_date = $3 WHERE id = $4",
      [fields.username, fields.startDate, fields.endDate, id]
    );
  }
}

export async function deleteUser(id: number): Promise<void> {
  await query("DELETE FROM users WHERE id = $1", [id]);
}

export async function getUserByUsername(username: string): Promise<UserRow | null> {
  const rows = await query<UserRow>("SELECT * FROM users WHERE username = $1", [username]);
  return rows[0] ?? null;
}

export async function getUserById(id: number): Promise<UserRow | null> {
  const rows = await query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function countAdmins(): Promise<number> {
  const rows = await query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM users WHERE is_admin = true"
  );
  return Number(rows[0]?.count ?? "0");
}

export function isUserActiveNow(user: {
  is_admin: boolean;
  start_date: Date | string | null;
  end_date: Date | string | null;
}): boolean {
  if (user.is_admin) return true;
  if (!user.start_date || !user.end_date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(user.start_date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(user.end_date);
  end.setHours(0, 0, 0, 0);

  return today >= start && today <= end;
}

export interface UserWithSlug extends UserRow {
  slug: string | null;
}

export async function listUsersWithPages(): Promise<UserWithSlug[]> {
  return query<UserWithSlug>(
    `SELECT users.*, pages.slug AS slug
     FROM users
     LEFT JOIN pages ON pages.user_id = users.id
     ORDER BY users.created_at ASC`
  );
}
