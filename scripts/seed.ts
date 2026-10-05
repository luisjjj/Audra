// Seed realistic demo data into Neon. Run: npm run db:seed (requires DATABASE_URL)
// Inserts: orgs, users, engagement, requests, documents + versions, filings, hash-chained audit_events.
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { createHash, randomUUID } from "crypto";
import * as s from "../drizzle/schema";

const url = process.env.DATABASE_URL;
if (!url) { console.error("Set DATABASE_URL first. See .env.example"); process.exit(1); }
const db: any = drizzle(neon(url), { schema: s as any });
const hash = (prev: string, payload: string, ts: string) => createHash("sha256").update(`${prev}|${payload}|${ts}`).digest("hex");

async function main() {
  console.log("Seeding Audra demo…");
  const existing = await db.select({ id: s.organizations.id }).from(s.organizations).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded — skipping.");
    return;
  }
  const now = () => new Date();
  const apexId = randomUUID(), merId = randomUUID();
  const sarah = randomUUID(), daniel = randomUUID(), michael = randomUUID(), jane = randomUUID(), henk = randomUUID();

  await db.insert(s.organizations).values([
    { id: apexId, name: "Apex Manufacturing Ltd.", industry: "Manufacturing", size: "51-200" },
    { id: merId, name: "Meridian Audit Partners", industry: "Audit & Assurance", size: "11-50" },
  ]);
  await db.insert(s.users).values([
    { id: sarah, name: "Sarah Okafor", email: "sarah@apex.example" },
    { id: daniel, name: "Daniel Ibrahim", email: "daniel@apex.example" },
    { id: michael, name: "Michael Adeyemi", email: "michael@meridian.example" },
    { id: jane, name: "Jane Williams", email: "jane@meridian.example" },
    { id: henk, name: "Henkyaa Japheth", email: "henkyaa@apex.example" },
  ]);
  await db.insert(s.organizationMembers).values([
    { organizationId: apexId, userId: sarah, role: "accountant" },
    { organizationId: apexId, userId: daniel, role: "auditor" },
    { organizationId: apexId, userId: henk, role: "admin" },
    { organizationId: apexId, userId: michael, role: "external_auditor", isExternal: true, sourceOrgId: merId },
    { organizationId: apexId, userId: jane, role: "external_auditor", isExternal: true, sourceOrgId: merId },
  ]);

  const engId = randomUUID();
  await db.insert(s.engagements).values({ id: engId, organizationId: apexId, title: "2026 External Audit", code: "ENG-2026-01", status: "active", progress: 78, description: "Statutory external audit FY2026" });
  await db.insert(s.engagementMembers).values([
    { engagementId: engId, userId: sarah, organizationId: apexId, role: "accountant", scopes: ["requests","evidence","comments","activity"] },
    { engagementId: engId, userId: michael, organizationId: merId, role: "external_auditor", scopes: ["requests","evidence","comments","activity"] },
    { engagementId: engId, userId: jane, organizationId: merId, role: "external_auditor", scopes: ["requests","evidence","comments","activity"] },
  ]);

  const reqIds = [randomUUID(), randomUUID(), randomUUID()];
  await db.insert(s.auditRequests).values([
    { id: reqIds[0], organizationId: apexId, engagementId: engId, code: "REQ-023", title: "Bank statements — Jan–Sep 2026", status: "submitted", assignedTo: sarah },
    { id: reqIds[1], organizationId: apexId, engagementId: engId, code: "REQ-024", title: "Supplier invoices — Q3 2026", status: "under_review", assignedTo: sarah },
    { id: reqIds[2], organizationId: apexId, engagementId: engId, code: "REQ-026", title: "Bank reconciliation evidence", status: "overdue", assignedTo: sarah },
  ]);

  const docId = randomUUID();
  await db.insert(s.documents).values({ id: docId, organizationId: apexId, engagementId: engId, code: "DOC-8F29", title: "Bank Statement — September 2026", category: "Bank statements", status: "approved", currentVersion: 2, uploadedBy: sarah });
  await db.insert(s.documentVersions).values([
    { documentId: docId, version: 1, fileKey: `apex/${docId}/v1.pdf`, fileName: "bank-sept-v1.pdf", uploadedBy: sarah },
    { documentId: docId, version: 2, fileKey: `apex/${docId}/v2.pdf`, fileName: "bank-sept-v2.pdf", uploadedBy: sarah, note: "Added missing page 4" },
  ]);

  // Hash-chained events
  let prev = "GENESIS";
  const events = [
    { actor: "Sarah Okafor", actorId: sarah, action: "DOCUMENT_UPLOADED", rt: "document", rid: docId, title: "Bank Statement — September 2026" },
    { actor: "Michael Adeyemi", actorId: michael, action: "DOCUMENT_VIEWED", rt: "document", rid: docId, title: "Bank Statement — September 2026" },
    { actor: "Michael Adeyemi", actorId: michael, action: "DOCUMENT_REJECTED", rt: "document", rid: docId, title: "Missing page 4" },
    { actor: "Sarah Okafor", actorId: sarah, action: "DOCUMENT_VERSION_CREATED", rt: "document", rid: docId, title: "Version 2" },
    { actor: "Michael Adeyemi", actorId: michael, action: "DOCUMENT_APPROVED", rt: "document", rid: docId, title: "Version 2 approved" },
  ];
  for (const e of events) {
    const ts = new Date().toISOString();
    const h = hash(prev, JSON.stringify(e), ts);
    await db.insert(s.auditEvents).values({ organizationId: apexId, engagementId: engId, actorId: e.actorId, actorName: e.actor, action: e.action, resourceType: e.rt, resourceId: e.rid, resourceTitle: e.title, prevHash: prev, eventHash: h });
    prev = h;
  }
  console.log("Seed complete. Last hash:", prev);
}
main().catch((e) => { console.error(e); process.exit(1); });
