"use server";
import { requestSchema, engagementSchema, commentSchema } from "@/lib/validations";
import { assertCan } from "@/lib/permissions";
import { buildEventHash } from "@/lib/audit";

// These actions enforce server-side authz + write append-only audit_events.
// When DATABASE_URL is set they hit Neon via Drizzle; otherwise they no-op with demo ACK
// (UI remains fully interactive). See scripts/seed.ts for real inserts.

async function logEvent(input: any) {
  const { db, isDbConfigured } = await import("@/lib/db");
  if (!isDbConfigured) return { demo: true, hash: "demo-hash" };
  const { auditEvents } = await import("@/drizzle/schema");
  const { desc } = await import("drizzle-orm");
  const last: any[] = await (db as any).select().from(auditEvents).orderBy(desc(auditEvents.createdAt)).limit(1);
  const ts = new Date().toISOString();
  const { prevHash, eventHash } = await buildEventHash({
    getLastHash: async () => last[0]?.eventHash ?? null,
    payload: input,
    timestamp: ts,
  });
  await (db as any).insert(auditEvents).values({ ...input, prevHash, eventHash });
  return { prevHash, eventHash };
}

export async function createEngagement(form: unknown, role = "admin") {
  const data = engagementSchema.parse(form);
  assertCan(role, "manage");
  await logEvent({ organizationId: "org-apex", action: "ENGAGEMENT_CREATED", resourceType: "engagement", resourceId: data.title, resourceTitle: data.title, actorName: "Henkyaa Japheth", metadata: data });
  return { ok: true };
}

export async function createRequest(form: unknown, role = "accountant") {
  const data = requestSchema.parse(form);
  assertCan(role, "upload");
  await logEvent({ organizationId: "org-apex", action: "REQUEST_CREATED", resourceType: "request", resourceId: data.title, resourceTitle: data.title, actorName: "Henkyaa Japheth", metadata: data });
  return { ok: true };
}

export async function transitionRequest(id: string, to: string, role = "auditor") {
  if (["approved", "completed"].includes(to)) assertCan(role, "approve");
  else assertCan(role, "review");
  await logEvent({ organizationId: "org-apex", action: to === "completed" ? "REQUEST_COMPLETED" : "REQUEST_REVIEWED", resourceType: "request", resourceId: id, actorName: "Michael Adeyemi", newState: { status: to } });
  return { ok: true };
}

export async function createComment(form: unknown, role = "member") {
  const data = commentSchema.parse(form);
  assertCan(role, "comment");
  await logEvent({ organizationId: "org-apex", action: "COMMENT_CREATED", resourceType: data.resourceType, resourceId: String(data.resourceId), actorName: "Henkyaa Japheth", metadata: { body: data.body.slice(0, 200) } });
  return { ok: true };
}
