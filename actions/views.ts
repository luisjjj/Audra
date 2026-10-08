"use server";
import {
  DEMO_ACTIVITY,
  DEMO_DOCS,
  DEMO_ENGAGEMENTS,
  DEMO_REQUESTS,
} from "@/lib/demo";
import {
  ACTIVE_ORG_COOKIE,
  getActiveOrgContext,
  getDocById,
  getOrgDocuments,
  getOrgEngagements,
  getOrgMembers,
  getOrgRequests,
  getRecentTrail,
} from "@/lib/workspaces";

// View-model actions for client pages. Demo workspace -> demo constants,
// real workspace -> rows scoped to the active org. Everything JSON-safe.

// ---------- Requests ----------
export async function getRequestsView() {
  const ctx = await getActiveOrgContext();
  if (ctx.isDemo) return { isDemo: true as const, items: DEMO_REQUESTS, engagements: [] as { id: string; title: string }[] };
  if (!ctx.activeOrgId) return { isDemo: false as const, items: [] as Awaited<ReturnType<typeof getOrgRequests>>, engagements: [] as { id: string; title: string }[] };
  const [items, engs] = await Promise.all([
    getOrgRequests(ctx.activeOrgId),
    getOrgEngagements(ctx.activeOrgId, ctx.activeOrg!.name),
  ]);
  return { isDemo: false as const, items, engagements: engs.map((e) => ({ id: e.id, title: e.title })) };
}

// ---------- Documents ----------
export async function getDocumentsView() {
  const ctx = await getActiveOrgContext();
  if (ctx.isDemo) return { isDemo: true as const, items: DEMO_DOCS };
  if (!ctx.activeOrgId) return { isDemo: false as const, items: [] as Awaited<ReturnType<typeof getOrgDocuments>> };
  return { isDemo: false as const, items: await getOrgDocuments(ctx.activeOrgId) };
}

// ---------- Activity ----------
export async function getActivityView(limit = 30) {
  const ctx = await getActiveOrgContext();
  if (ctx.isDemo) return { isDemo: true as const, items: DEMO_ACTIVITY };
  if (!ctx.activeOrgId) return { isDemo: false as const, items: [] as Awaited<ReturnType<typeof getRecentTrail>> };
  return { isDemo: false as const, items: await getRecentTrail(ctx.activeOrgId, limit) };
}

// ---------- Single engagement (detail tabs + timeline) ----------
export async function getEngagementView(id: string) {
  const ctx = await getActiveOrgContext();
  if (ctx.isDemo) {
    const eng = DEMO_ENGAGEMENTS.find((e) => e.id === id) ?? DEMO_ENGAGEMENTS[0];
    return { isDemo: true as const, eng, requests: DEMO_REQUESTS, docs: DEMO_DOCS, members: [], trail: DEMO_ACTIVITY };
  }
  if (!ctx.activeOrgId) return { isDemo: false as const, eng: null };
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, and } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select()
    .from(schema.engagements)
    .where(and(eq(schema.engagements.id, id), eq(schema.engagements.organizationId, ctx.activeOrgId)))
    .limit(1);
  if (rows.length === 0) return { isDemo: false as const, eng: null };
  const [engagements, requests, docs, members, trail] = await Promise.all([
    getOrgEngagements(ctx.activeOrgId, ctx.activeOrg!.name),
    getOrgRequests(ctx.activeOrgId),
    getOrgDocuments(ctx.activeOrgId),
    getOrgMembers(ctx.activeOrgId, ctx.activeOrg!.name),
    getRecentTrail(ctx.activeOrgId, 12),
  ]);
  const eng = engagements.find((e) => e.id === id) ?? null;
  return {
    isDemo: false as const,
    eng,
    requests: requests.filter((r) => r.engagementId === id),
    docs: docs.filter((d) => d.engagementId === id),
    members: members.slice(0, 8),
    trail: trail.filter((t) => !t.engagement || t.engagement === eng?.title || t.engagement === "Workspace").slice(0, 8),
  };
}

// ---------- Organizations (switcher + page) ----------
export async function getOrgsView() {
  const ctx = await getActiveOrgContext();
  if (ctx.isDemo) {
    return {
      isDemo: true as const,
      orgs: ctx.orgs,
      activeOrgId: ctx.activeOrgId,
      cookie: ACTIVE_ORG_COOKIE,
    };
  }
  return { isDemo: false as const, orgs: ctx.orgs, activeOrgId: ctx.activeOrgId, cookie: ACTIVE_ORG_COOKIE };
}

// ---------- Single document (scoped) ----------
export async function getDocView(id: string) {
  const ctx = await getActiveOrgContext();
  if (ctx.isDemo) return { isDemo: true as const, data: null };
  if (!ctx.activeOrgId) return { isDemo: false as const, data: null };
  return { isDemo: false as const, data: await getDocById(ctx.activeOrgId, id) };
}
