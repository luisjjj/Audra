import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const orgRoleEnum = pgEnum("org_role", ["owner","admin","accountant","auditor","reviewer","member","viewer"]);
export const extRoleEnum = pgEnum("ext_role", ["external_auditor","external_accountant","client","reviewer","consultant","viewer"]);
export const engagementStatusEnum = pgEnum("engagement_status", ["active","completed","archived"]);
export const requestStatusEnum = pgEnum("request_status", ["pending","submitted","under_review","changes_requested","approved","completed","overdue"]);
export const docStatusEnum = pgEnum("doc_status", ["draft","submitted","under_review","changes_requested","approved","rejected"]);
export const filingStatusEnum = pgEnum("filing_status", ["upcoming","in_preparation","ready_for_review","submitted","accepted","needs_attention","overdue"]);
export const taskStatusEnum = pgEnum("task_status", ["todo","in_progress","done"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Better Auth tables (required by drizzleAdapter, provider pg).
// App profile/tenant data lives in `users` + organization tables above;
// auth identity lives here.
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  size: text("size"),
  logoUrl: text("logo_url"),
  timezone: text("timezone").default("UTC"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: text("role").default("member").notNull(), // orgRole + extRole as text for flexibility
  isExternal: boolean("is_external").default(false).notNull(),
  sourceOrgId: uuid("source_org_id").references(() => organizations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const engagements = pgTable("engagements", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  code: text("code").notNull(), // e.g. ENG-2026-01
  status: text("status").default("active").notNull(),
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  progress: integer("progress").default(0).notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const engagementMembers = pgTable("engagement_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  engagementId: uuid("engagement_id").references(() => engagements.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  role: text("role").default("member").notNull(),
  scopes: jsonb("scopes").$type<string[]>().default(["requests","evidence","comments","activity"]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  engagementId: uuid("engagement_id").references(() => engagements.id),
  code: text("code").notNull(), // DOC-8F29
  title: text("title").notNull(),
  category: text("category").default("other").notNull(),
  status: text("status").default("draft").notNull(),
  currentVersion: integer("current_version").default(1).notNull(),
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentVersions = pgTable("document_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id").references(() => documents.id).notNull(),
  version: integer("version").notNull(),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documentPermissions = pgTable("document_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id").references(() => documents.id).notNull(),
  userId: uuid("user_id").references(() => users.id),
  orgId: uuid("org_id").references(() => organizations.id),
  canView: boolean("can_view").default(true),
  canDownload: boolean("can_download").default(true),
});

export const auditRequests = pgTable("audit_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  engagementId: uuid("engagement_id").references(() => engagements.id).notNull(),
  code: text("code").notNull(), // REQ-012
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").default("general"),
  status: text("status").default("pending").notNull(),
  priority: text("priority").default("medium"),
  dueDate: timestamp("due_date"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  requestedBy: uuid("requested_by").references(() => users.id),
  requiredDocs: text("required_docs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const requestDocuments = pgTable("request_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").references(() => auditRequests.id).notNull(),
  documentId: uuid("document_id").references(() => documents.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  engagementId: uuid("engagement_id").references(() => engagements.id),
  title: text("title").notNull(),
  status: text("status").default("todo").notNull(),
  assigneeId: uuid("assignee_id").references(() => users.id),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  engagementId: uuid("engagement_id").references(() => engagements.id),
  resourceType: text("resource_type").notNull(), // document | request | task | filing
  resourceId: uuid("resource_id").notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  body: text("body").notNull(),
  parentId: uuid("parent_id"),
  resolved: boolean("resolved").default(false),
  mentions: jsonb("mentions").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const filings = pgTable("filings", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  title: text("title").notNull(),
  year: text("year"),
  status: text("status").default("upcoming").notNull(),
  dueDate: timestamp("due_date"),
  owner: text("owner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filingDocuments = pgTable("filing_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  filingId: uuid("filing_id").references(() => filings.id).notNull(),
  documentId: uuid("document_id").references(() => documents.id).notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  link: text("link"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  engagementId: uuid("engagement_id").references(() => engagements.id),
  email: text("email").notNull(),
  orgName: text("org_name"),
  role: text("role").default("member").notNull(),
  scopes: jsonb("scopes").$type<string[]>().default(["requests","evidence","comments","activity"]),
  token: text("token").notNull(),
  accepted: boolean("accepted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Append-only audit events with hash chaining (tamper-evident, internal integrity only)
export const auditEvents = pgTable("audit_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  engagementId: uuid("engagement_id").references(() => engagements.id),
  actorId: uuid("actor_id").references(() => users.id),
  actorName: text("actor_name").notNull(),
  actorOrg: text("actor_org"),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  resourceTitle: text("resource_title"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  prevState: jsonb("prev_state"),
  newState: jsonb("new_state"),
  ip: text("ip"),
  prevHash: text("prev_hash"),
  eventHash: text("event_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AuditAction =
  | "USER_LOGIN" | "USER_INVITED" | "DOCUMENT_UPLOADED" | "DOCUMENT_VIEWED"
  | "DOCUMENT_DOWNLOADED" | "DOCUMENT_VERSION_CREATED" | "DOCUMENT_APPROVED"
  | "DOCUMENT_REJECTED" | "REQUEST_CREATED" | "REQUEST_SUBMITTED" | "REQUEST_REVIEWED"
  | "REQUEST_COMPLETED" | "COMMENT_CREATED" | "TASK_CREATED" | "TASK_COMPLETED"
  | "FILING_CREATED" | "FILING_UPDATED" | "PERMISSION_CHANGED" | "MEMBER_ADDED"
  | "MEMBER_REMOVED" | "ENGAGEMENT_CREATED";
