import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/drizzle/schema";

const url = process.env.DATABASE_URL;

export const isDbConfigured = !!url;

// Lazy DB: if no URL, export null-safe proxy that throws with helpful message.
// UI falls back to demo data layer (lib/demo.ts) when unconfigured.
export const db = url ? drizzle(neon(url), { schema }) : (null as unknown as ReturnType<typeof drizzle<typeof schema>>);

export async function checkDb() {
  if (!url) return { configured: false };
  try {
    const sql = neon(url);
    await sql`select 1`;
    return { configured: true, ok: true };
  } catch (e: any) {
    return { configured: true, ok: false, error: String(e?.message ?? e) };
  }
}
