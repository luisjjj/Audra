import { z } from "zod";

export const requestSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  category: z.string().default("general"),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(["low","medium","high","urgent"]).default("medium"),
  requiredDocs: z.string().optional(),
  engagementId: z.string().min(1).optional(),
});

export const engagementSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
});

export const commentSchema = z.object({
  body: z.string().min(1).max(5000),
  resourceType: z.enum(["document","request","task","filing"]),
  resourceId: z.string().uuid().or(z.string().min(1)),
  parentId: z.string().optional(),
});

export const inviteSchema = z.object({
  email: z.string().email().optional(),
  orgName: z.string().min(2).max(200).optional(),
  role: z.string().default("member"),
  scopes: z.array(z.string()).default(["requests","evidence","comments","activity"]),
  engagementId: z.string().optional(),
});

export const filingSchema = z.object({
  title: z.string().min(3),
  year: z.string().optional(),
  status: z.string().default("upcoming"),
  dueDate: z.string().optional(),
  owner: z.string().optional(),
});

export const workspaceSchema = z.object({
  name: z.string().min(2).max(200),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
});

export const workspaceUpdateSchema = z.object({
  name: z.string().min(2).max(200),
  industry: z.string().max(100).optional(),
  timezone: z.string().max(50).optional(),
});

export const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  company: z.string().min(2).max(200),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
});
