import { Pool } from "pg";
import { readFileSync } from "fs";

const isLocalDb = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL ?? "");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocalDb ? undefined : { rejectUnauthorized: false },
});

const sql = readFileSync(new URL("../lib/schema.sql", import.meta.url), "utf8");
await pool.query(sql);
await pool.end();
console.log("schema applied");
