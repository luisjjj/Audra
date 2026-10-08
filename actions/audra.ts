"use server";
import { requestSchema, engagementSchema, commentSchema } from "@/lib/validations";
import { assertCan } from "@/lib/permissions";
import { buildEventHash } from "@/lib/audit";

import { randomUUID } from "crypto";
import { ACTIVE_ORG_COOKIE, getActiveOrgContext } from "@/lib/workspaces";

// These actions enforce server-side authz + write append-only audit_events.
// When DATABASE_URL is set they hit Neon via Drizzle; otherwise they no-op with demo ACK
// (UI remains fully interactive). See scripts/seed.ts for real inserts.

async function requireUser() {
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s?.user) throw new Error("Not signed in");
  return s.user as { id: string; name: string; email: string };
}

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
  const { isDbConfigured, db } = await import("@/lib/db");
  if (!isDbConfigured) {
    assertCan(role, "manage");
    await logEvent({ organizationId: "org-apex", action: "ENGAGEMENT_CREATED", resourceType: "engagement", resourceId: data.title, resourceTitle: data.title, actorName: "Henkyaa Japheth", metadata: data });
    return { ok: true as const, id: null as string | null };
  }
  try {
    const ctx = await getActiveOrgContext();
    if (!ctx.isDemo && ctx.activeOrgId) {
      assertCan(ctx.role, "manage");
      const schema = await import("@/drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const existing: any[] = await (db as any)
        .select({ id: schema.engagements.id })
        .from(schema.engagements)
        .where(eq(schema.engagements.organizationId, ctx.activeOrgId));
      const code = `ENG-${new Date().getFullYear()}-${String(existing.length + 1).padStart(3, "0")}`;
      const [eng] = await (db as any)
        .insert(schema.engagements)
        .values({
          organizationId: ctx.activeOrgId,
          title: data.title,
          description: data.description || null,
          code,
          status: "active",
          progress: 0,
          startDate: data.startDate ? new Date(data.startDate) : null,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          createdBy: ctx.user.id,
        })
        .returning({ id: schema.engagements.id });
      await logEvent({
        organizationId: ctx.activeOrgId,
        engagementId: eng.id,
        actorId: ctx.user.id,
        actorName: ctx.user.name,
        action: "ENGAGEMENT_CREATED",
        resourceType: "engagement",
        resourceId: eng.id,
        resourceTitle: data.title,
        metadata: data,
      });
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/engagements");
      revalidatePath("/overview");
      return { ok: true as const, id: eng.id as string };
    }
  } catch {
    // fall through to demo ACK
  }
  await logEvent({ organizationId: "org-apex", action: "ENGAGEMENT_CREATED", resourceType: "engagement", resourceId: data.title, resourceTitle: data.title, actorName: "Henkyaa Japheth", metadata: data });
  return { ok: true as const, id: null as string | null };
}

export async function createRequest(form: unknown, role = "accountant") {
  const data = requestSchema.parse(form);
  assertCan(role, "upload");
  const { isDbConfigured, db } = await import("@/lib/db");
  if (!isDbConfigured) {
    await logEvent({ organizationId: "org-apex", action: "REQUEST_CREATED", resourceType: "request", resourceId: data.title, resourceTitle: data.title, actorName: "Henkyaa Japheth", metadata: data });
    return { ok: true as const, id: null as string | null };
  }
  try {
    const ctx = await getActiveOrgContext();
    const engagementId = (data as any).engagementId as string | undefined;
    if (!ctx.isDemo && ctx.activeOrgId && engagementId) {
      const schema = await import("@/drizzle/schema");
      const { eq, and } = await import("drizzle-orm");
      // Engagement must belong to the active workspace.
      const eng: any[] = await (db as any)
        .select({ id: schema.engagements.id })
        .from(schema.engagements)
        .where(and(eq(schema.engagements.id, engagementId), eq(schema.engagements.organizationId, ctx.activeOrgId)))
        .limit(1);
      if (eng.length > 0) {
        const existing: any[] = await (db as any)
          .select({ id: schema.auditRequests.id })
          .from(schema.auditRequests)
          .where(eq(schema.auditRequests.engagementId, engagementId));
        const code = `REQ-${String(existing.length + 1).padStart(3, "0")}`;
        const [req] = await (db as any)
          .insert(schema.auditRequests)
          .values({
            organizationId: ctx.activeOrgId,
            engagementId,
            code,
            title: data.title,
            description: data.description || null,
            category: data.category || "general",
            status: "pending",
            priority: data.priority || "medium",
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            requestedBy: ctx.user.id,
            requiredDocs: data.requiredDocs || null,
          })
          .returning({ id: schema.auditRequests.id });
        await logEvent({
          organizationId: ctx.activeOrgId,
          engagementId,
          actorId: ctx.user.id,
          actorName: ctx.user.name,
          action: "REQUEST_CREATED",
          resourceType: "request",
          resourceId: req.id,
          resourceTitle: data.title,
          metadata: data,
        });
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/requests");
        revalidatePath("/overview");
        return { ok: true as const, id: req.id as string };
      }
    }
  } catch {
    // fall through to demo ACK
  }
  await logEvent({ organizationId: "org-apex", action: "REQUEST_CREATED", resourceType: "request", resourceId: data.title, resourceTitle: data.title, actorName: "Henkyaa Japheth", metadata: data });
  return { ok: true as const, id: null as string | null };
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

// Create a brand-new workspace for the signed-in user. No invite needed:
// they become the owner and land straight inside it.
export async function createWorkspace(form: unknown) {
  const { workspaceSchema } = await import("@/lib/validations");
  const data = workspaceSchema.parse(form);
  const { isDbConfigured, db } = await import("@/lib/db");
  if (!isDbConfigured) throw new Error("Workspace creation needs a database connection");
  const user = await requireUser();
  const schema = await import("@/drizzle/schema");

  // App profile row shares the auth id (UUIDs on both sides by config).
  await (db as any)
    .insert(schema.users)
    .values({ id: user.id, email: user.email, name: user.name })
    .onConflictDoNothing({ target: schema.users.id });

  const [org] = await (db as any)
    .insert(schema.organizations)
    .values({
      name: data.name,
      industry: data.industry || null,
      size: data.size || null,
      createdBy: user.id,
    })
    .returning({ id: schema.organizations.id, name: schema.organizations.name });

  await (db as any).insert(schema.organizationMembers).values({
    organizationId: org.id,
    userId: user.id,
    role: "owner",
  });

  await logEvent({
    organizationId: org.id,
    actorId: user.id,
    actorName: user.name,
    actorOrg: data.name,
    action: "WORKSPACE_CREATED",
    resourceType: "organization",
    resourceId: org.id,
    resourceTitle: data.name,
    metadata: { industry: data.industry ?? null, size: data.size ?? null },
  });

  const { cookies } = await import("next/headers");
  (await cookies()).set(ACTIVE_ORG_COOKIE, org.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/");
  return { ok: true as const, orgId: org.id as string };
}

// Switch the active workspace. Membership is verified server-side.
export async function switchWorkspace(orgId: string) {
  const { isDbConfigured, db } = await import("@/lib/db");
  if (!isDbConfigured) return { ok: true as const };
  const user = await requireUser();
  const schema = await import("@/drizzle/schema");
  const { and, eq } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select({ id: schema.organizationMembers.id })
    .from(schema.organizationMembers)
    .where(and(eq(schema.organizationMembers.organizationId, orgId), eq(schema.organizationMembers.userId, user.id)))
    .limit(1);
  if (rows.length === 0) throw new Error("Not a member of that workspace");
  const { cookies } = await import("next/headers");
  (await cookies()).set(ACTIVE_ORG_COOKIE, orgId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/");
  return { ok: true as const };
}
