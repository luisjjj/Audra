// One-off Neon connectivity check. Reads DATABASE_URL from .env.local (never logs it).
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

function loadUrl() {
  const raw = readFileSync(".env.local", "utf8");
  const m = raw.match(/^DATABASE_URL="([\s\S]*?)"\s*$/m);
  if (!m) throw new Error("DATABASE_URL not found in .env.local");
  return m[1];
}

const url = loadUrl();

async function main() {
  const sql = neon(url);
  const rows = await sql`select 1 as ok, current_database() as db, current_user as usr`;
  console.log("Neon OK:", JSON.stringify(rows));
}

main().catch((e) => {
  console.error("Neon check failed:", e?.message ?? e);
  process.exit(1);
});
