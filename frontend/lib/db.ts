import { Pool } from "pg";

declare global {
    // eslint-disable-next-line no-var
    var _pgPool: Pool | undefined;
}

const isLocalDb = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? "");

export const pool =
    global._pgPool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isLocalDb ? undefined : { rejectUnauthorized: false },
        max: 5, // serverless deployments can spin up many concurrent instances; keep each pool small
    });

if (process.env.NODE_ENV !== "production") {
    global._pgPool = pool;
}

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
    const result = await pool.query(text, params);
    return result.rows as T[];
}
