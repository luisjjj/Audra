import { cookies, headers } from "next/headers";
import { DEMO_USER } from "@/lib/demo";

export const DEMO_ORG_ID = "org-apex";
export const ACTIVE_ORG_COOKIE = "audra_org";

export type OrgSummary = { id: string; name: string };

export type OrgContext =
  | {
      isDemo: true;
      user: { id: string; name: string; email: string };
      orgs: OrgSummary[];
      activeOrgId: string;
      activeOrg: OrgSummary;
      role: string;
      needsWorkspace: false;
    }
  | {
      isDemo: false;
      user: { id: string; name: string; email: string };
      orgs: OrgSummary[];
      activeOrgId: string | null;
      activeOrg: OrgSummary | null;
      role: string;
      needsWorkspace: boolean;
    };

function demoContext(): OrgContext {
  return {
    isDemo: true,
    user: { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email },
    orgs: [{ id: DEMO_ORG_ID, name: DEMO_USER.org }],
    activeOrgId: DEMO_ORG_ID,
    activeOrg: { id: DEMO_ORG_ID, name: DEMO_USER.org },
    role: DEMO_USER.role,
    needsWorkspace: false,
  };
}

// Resolve who is browsing and which workspace is active.
// No DATABASE_URL or no session -> demo workspace (explore mode).
export async function getActiveOrgContext(): Promise<OrgContext> {
  if (!process.env.DATABASE_URL) return demoContext();
  try {
    const { auth } = await import("@/lib/auth");
    const s = await auth.api.getSession({ headers: await headers() });
    if (!s?.user) return demoContext();

    const { db } = await import("@/lib/db");
    const schema = await import("@/drizzle/schema");
    const { eq } = await import("drizzle-orm");

    const memberships: any[] = await (db as any)
      .select({
        orgId: schema.organizationMembers.organizationId,
        role: schema.organizationMembers.role,
        orgName: schema.organizations.name,
      })
      .from(schema.organizationMembers)
      .innerJoin(schema.organizations, eq(schema.organizationMembers.organizationId, schema.organizations.id))
      .where(eq(schema.organizationMembers.userId, (s.user as any).id));

    const orgs: OrgSummary[] = memberships.map((m) => ({ id: m.orgId, name: m.orgName }));
    if (orgs.length === 0) {
      return {
        isDemo: false,
        user: { id: (s.user as any).id, name: (s.user as any).name ?? "Member", email: (s.user as any).email ?? "" },
        orgs: [],
        activeOrgId: null,
        activeOrg: null,
        role: "member",
        needsWorkspace: true,
      };
    }

    const store = await cookies();
    const wanted = store.get(ACTIVE_ORG_COOKIE)?.value;
    const active = orgs.find((o) => o.id === wanted) ?? orgs[0];
    const role = memberships.find((m) => m.orgId === active.id)?.role ?? "member";

    return {
      isDemo: false,
      user: { id: (s.user as any).id, name: (s.user as any).name ?? "Member", email: (s.user as any).email ?? "" },
      orgs,
      activeOrgId: active.id,
      activeOrg: active,
      role,
      needsWorkspace: false,
    };
  } catch {
    return demoContext();
  }
}

export function timeAgo(d: Date | string): string {
  const t = new Date(d).getTime();
  const s = Math.max(1, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export type TrailItem = {
  id: string;
  time: string;
  ago: string;
  actor: string;
  org: string;
  action: string;
  target: string;
  meta: string;
  engagement: string;
  resourceType: string;
  resourceId: string;
};

// Real audit trail for a workspace, shaped like the demo feed.
export async function getRecentTrail(orgId: string, limit = 6): Promise<TrailItem[]> {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, desc } = await import("drizzle-orm");

  const rows: any[] = await (db as any)
    .select()
    .from(schema.auditEvents)
    .where(eq(schema.auditEvents.organizationId, orgId))
    .orderBy(desc(schema.auditEvents.createdAt))
    .limit(limit);

  const engIds = Array.from(new Set(rows.map((r) => r.engagementId).filter(Boolean)));
  const engNames: Record<string, string> = {};
  if (engIds.length > 0) {
    const { inArray } = await import("drizzle-orm");
    const engs: any[] = await (db as any)
      .select({ id: schema.engagements.id, title: schema.engagements.title })
      .from(schema.engagements)
      .where(inArray(schema.engagements.id, engIds));
    for (const e of engs) engNames[e.id] = e.title;
  }

  return rows.map((r) => {
    const created = r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt);
    const hh = String(created.getHours()).padStart(2, "0");
    const mm = String(created.getMinutes()).padStart(2, "0");
    const ss = String(created.getSeconds()).padStart(2, "0");
    return {
      id: r.id,
      time: `${hh}:${mm}:${ss}`,
      ago: timeAgo(created),
      actor: r.actorName,
      org: r.actorOrg ?? "",
      action: String(r.action).replaceAll("_", " "),
      target: r.resourceTitle ?? r.resourceId,
      meta: r.resourceType ? `${r.resourceType} · ${r.resourceId}` : String(r.resourceId),
      engagement: (r.engagementId && engNames[r.engagementId]) || "Workspace",
      resourceType: r.resourceType ?? "",
      resourceId: String(r.resourceId ?? ""),
    };
  });
}

function fmtDate(d: unknown): string {
  if (!d) return "No due date";
  const dt = d instanceof Date ? d : new Date(d as string);
  if (Number.isNaN(dt.getTime())) return "No due date";
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtSize(bytes: unknown): string {
  const n = typeof bytes === "number" ? bytes : null;
  if (n == null) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

async function userNames(ids: string[]): Promise<Record<string, string>> {
  const uniq = Array.from(new Set(ids.filter(Boolean)));
  if (uniq.length === 0) return {};
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { inArray } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select({ id: schema.users.id, name: schema.users.name })
    .from(schema.users)
    .where(inArray(schema.users.id, uniq));
  const map: Record<string, string> = {};
  for (const r of rows) map[r.id] = r.name;
  return map;
}

export type RealEngagement = {
  id: string; code: string; title: string; org: string; firm: string; progress: number;
  done: number; total: number; due: string; status: string; period: string; desc: string;
};

export async function getOrgEngagements(orgId: string, orgName: string): Promise<RealEngagement[]> {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, desc } = await import("drizzle-orm");
  const engs: any[] = await (db as any)
    .select()
    .from(schema.engagements)
    .where(eq(schema.engagements.organizationId, orgId))
    .orderBy(desc(schema.engagements.createdAt));
  const reqs: any[] = await (db as any)
    .select({ engagementId: schema.auditRequests.engagementId, status: schema.auditRequests.status })
    .from(schema.auditRequests)
    .where(eq(schema.auditRequests.organizationId, orgId));
  const byEng: Record<string, { done: number; total: number }> = {};
  for (const r of reqs) {
    const e = (byEng[r.engagementId] ??= { done: 0, total: 0 });
    e.total += 1;
    if (["approved", "completed"].includes(r.status)) e.done += 1;
  }
  return engs.map((e) => {
    const c = byEng[e.id] ?? { done: 0, total: 0 };
    const period = e.startDate || e.dueDate ? `${fmtDate(e.startDate)} — ${fmtDate(e.dueDate)}` : "Ongoing";
    return {
      id: e.id, code: e.code ?? e.id.toUpperCase(), title: e.title, org: orgName, firm: "Internal",
      progress: e.progress ?? 0, done: c.done, total: c.total,
      due: fmtDate(e.dueDate), status: e.status ?? "active", period, desc: e.description ?? "",
    };
  });
}

export type RealRequest = {
  id: string; code: string; title: string; from: string; assignee: string;
  status: string; due: string; priority: string; category: string; engagement: string; engagementId: string; desc: string;
};

export async function getOrgRequests(orgId: string): Promise<RealRequest[]> {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, desc } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select()
    .from(schema.auditRequests)
    .where(eq(schema.auditRequests.organizationId, orgId))
    .orderBy(desc(schema.auditRequests.createdAt));
  const engIds = Array.from(new Set(rows.map((r) => r.engagementId).filter(Boolean)));
  const engNames: Record<string, string> = {};
  if (engIds.length > 0) {
    const { inArray } = await import("drizzle-orm");
    const engs: any[] = await (db as any)
      .select({ id: schema.engagements.id, title: schema.engagements.title })
      .from(schema.engagements)
      .where(inArray(schema.engagements.id, engIds));
    for (const e of engs) engNames[e.id] = e.title;
  }
  const names = await userNames(rows.flatMap((r) => [r.assignedTo, r.requestedBy]));
  return rows.map((r) => ({
    id: r.id, code: r.code, title: r.title,
    from: names[r.requestedBy] ?? "Workspace",
    assignee: names[r.assignedTo] ?? "Unassigned",
    status: r.status ?? "pending", due: fmtDate(r.dueDate),
    priority: r.priority ?? "medium", category: r.category ?? "general",
    engagement: engNames[r.engagementId] ?? "Workspace", engagementId: r.engagementId ?? "",
    desc: r.description ?? "",
  }));
}

export type RealDocument = {
  id: string; code: string; title: string; by: string; date: string; version: number;
  reviewed: boolean; approved: boolean; category: string; engagement: string; engagementId: string; size: string;
};

export async function getOrgDocuments(orgId: string): Promise<RealDocument[]> {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, desc, inArray } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select()
    .from(schema.documents)
    .where(eq(schema.documents.organizationId, orgId))
    .orderBy(desc(schema.documents.updatedAt));
  const docIds = rows.map((r) => r.id);
  const engNames: Record<string, string> = {};
  const engIds = Array.from(new Set(rows.map((r) => r.engagementId).filter(Boolean)));
  if (engIds.length > 0) {
    const engs: any[] = await (db as any)
      .select({ id: schema.engagements.id, title: schema.engagements.title })
      .from(schema.engagements)
      .where(inArray(schema.engagements.id, engIds));
    for (const e of engs) engNames[e.id] = e.title;
  }
  const latestSize: Record<string, number> = {};
  if (docIds.length > 0) {
    const vers: any[] = await (db as any)
      .select()
      .from(schema.documentVersions)
      .where(inArray(schema.documentVersions.documentId, docIds))
      .orderBy(desc(schema.documentVersions.version));
    for (const v of vers) if (!(v.documentId in latestSize)) latestSize[v.documentId] = v.fileSize;
  }
  const names = await userNames(rows.map((r) => r.uploadedBy));
  return rows.map((r) => ({
    id: r.id, code: r.code, title: r.title,
    by: names[r.uploadedBy] ?? "Workspace",
    date: fmtDate(r.updatedAt), version: r.currentVersion ?? 1,
    reviewed: ["under_review", "changes_requested", "approved"].includes(r.status ?? ""),
    approved: r.status === "approved",
    category: r.category ?? "other",
    engagement: (r.engagementId && engNames[r.engagementId]) || "Workspace",
    engagementId: r.engagementId ?? "",
    size: fmtSize(latestSize[r.id]),
  }));
}

export async function getDocById(orgId: string, docId: string) {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, and, desc } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select()
    .from(schema.documents)
    .where(and(eq(schema.documents.id, docId), eq(schema.documents.organizationId, orgId)))
    .limit(1);
  if (rows.length === 0) return null;
  const d = rows[0];
  let engName = "Workspace";
  if (d.engagementId) {
    const er: any[] = await (db as any)
      .select({ title: schema.engagements.title })
      .from(schema.engagements)
      .where(eq(schema.engagements.id, d.engagementId))
      .limit(1);
    if (er.length > 0) engName = er[0].title;
  }
  const vers: any[] = await (db as any)
    .select()
    .from(schema.documentVersions)
    .where(eq(schema.documentVersions.documentId, docId))
    .orderBy(desc(schema.documentVersions.version));
  const names = await userNames([d.uploadedBy, ...vers.map((v) => v.uploadedBy)]);
  const comments: any[] = await (db as any)
    .select()
    .from(schema.comments)
    .where(and(eq(schema.comments.organizationId, orgId), eq(schema.comments.resourceId, docId)))
    .orderBy(desc(schema.comments.createdAt))
    .limit(20);
  const commentNames = await userNames(comments.map((c) => c.authorId));
  return {
    doc: {
      id: d.id, code: d.code, title: d.title,
      by: names[d.uploadedBy] ?? "Workspace",
      date: fmtDate(d.updatedAt), version: d.currentVersion ?? 1,
      reviewed: ["under_review", "changes_requested", "approved"].includes(d.status ?? ""),
      approved: d.status === "approved",
      category: d.category ?? "other", engagement: engName, size: fmtSize(vers[0]?.fileSize),
    },
    versions: vers.map((v) => ({
      version: v.version, fileName: v.fileName,
      by: names[v.uploadedBy] ?? "Workspace",
      date: fmtDate(v.createdAt), note: v.note ?? null,
    })),
    comments: comments.map((c) => ({
      id: c.id, author: commentNames[c.authorId] ?? "Member",
      body: c.body, date: fmtDate(c.createdAt),
    })),
  };
}

export type RealFiling = {
  id: string; title: string; year: string; status: string; due: string; owner: string; docs: number;
};

export async function getOrgFilings(orgId: string): Promise<RealFiling[]> {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, desc, inArray } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select()
    .from(schema.filings)
    .where(eq(schema.filings.organizationId, orgId))
    .orderBy(desc(schema.filings.createdAt));
  const counts: Record<string, number> = {};
  if (rows.length > 0) {
    const links: any[] = await (db as any)
      .select({ filingId: schema.filingDocuments.filingId })
      .from(schema.filingDocuments)
      .where(inArray(schema.filingDocuments.filingId, rows.map((r) => r.id)));
    for (const l of links) counts[l.filingId] = (counts[l.filingId] ?? 0) + 1;
  }
  return rows.map((f) => ({
    id: f.id, title: f.title, year: f.year ?? "", status: f.status ?? "upcoming",
    due: fmtDate(f.dueDate), owner: f.owner ?? "—", docs: counts[f.id] ?? 0,
  }));
}

export type RealPerson = {
  id: string; name: string; role: string; org: string; type: string; email: string;
};

export async function getOrgMembers(orgId: string, orgName: string): Promise<RealPerson[]> {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select({
      userId: schema.organizationMembers.userId,
      role: schema.organizationMembers.role,
      isExternal: schema.organizationMembers.isExternal,
      name: schema.users.name,
      email: schema.users.email,
    })
    .from(schema.organizationMembers)
    .innerJoin(schema.users, eq(schema.organizationMembers.userId, schema.users.id))
    .where(eq(schema.organizationMembers.organizationId, orgId));
  return rows.map((r) => ({
    id: r.userId, name: r.name, role: r.role, org: orgName,
    type: r.isExternal ? "EXTERNAL" : "INTERNAL", email: r.email,
  }));
}

export type RealNotification = { id: string; title: string; body: string; time: string; read: boolean };

export type WorkspaceSettings = {
  id: string;
  name: string;
  industry: string;
  size: string;
  timezone: string;
  memberCount: number;
  eventCount: number;
};

export async function getWorkspaceSettings(orgId: string): Promise<WorkspaceSettings | null> {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, count } = await import("drizzle-orm");
  const orgs: any[] = await (db as any)
    .select()
    .from(schema.organizations)
    .where(eq(schema.organizations.id, orgId))
    .limit(1);
  if (orgs.length === 0) return null;
  const o = orgs[0];
  const [m] = (await (db as any)
    .select({ n: count() })
    .from(schema.organizationMembers)
    .where(eq(schema.organizationMembers.organizationId, orgId))) as { n: number }[];
  const [e] = (await (db as any)
    .select({ n: count() })
    .from(schema.auditEvents)
    .where(eq(schema.auditEvents.organizationId, orgId))) as { n: number }[];
  return {
    id: o.id,
    name: o.name,
    industry: o.industry ?? "",
    size: o.size ?? "",
    timezone: o.timezone ?? "UTC",
    memberCount: m?.n ?? 0,
    eventCount: e?.n ?? 0,
  };
}
export async function getUserNotifications(userId: string): Promise<RealNotification[]> {
  const { db } = await import("@/lib/db");
  const schema = await import("@/drizzle/schema");
  const { eq, desc } = await import("drizzle-orm");
  const rows: any[] = await (db as any)
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, userId))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(20);
  return rows.map((n) => ({
    id: n.id, title: n.title, body: n.body ?? "", time: timeAgo(n.createdAt), read: !!n.read,
  }));
}
