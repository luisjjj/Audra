// Verify Audra tables + seed counts. Reads DATABASE_URL from .env.local (never logs it).
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

function loadUrl() {
  const raw = readFileSync(".env.local", "utf8");
  const m = raw.match(/^DATABASE_URL="([\s\S]*?)"\s*$/m);
  if (!m) throw new Error("DATABASE_URL not found in .env.local");
  return m[1];
}

async function main() {
  const sql = neon(loadUrl());
  const tables = await sql`select table_name from information_schema.tables where table_schema='public' order by table_name`;
  console.log("TABLES:", tables.map((t: any) => t.table_name).join(","));
  for (const t of ["user", "session", "account", "verification", "organizations", "users", "engagements", "audit_requests", "documents", "audit_events"]) {
    const c = await sql(`select count(*)::int as n from "${t}"`);
    console.log(t, "=", (c as any)[0].n);
  }
  const chain = await sql`select action, event_hash, prev_hash from audit_events order by created_at limit 5`;
  console.log("CHAIN HEAD:", JSON.stringify(chain.map((e: any) => ({ a: e.action, h: String(e.event_hash).slice(0, 8), p: String(e.prev_hash).slice(0, 8) }))));
}

main().catch((e) => {
  console.error("Verify failed:", e?.message ?? e);
  process.exit(1);
});
