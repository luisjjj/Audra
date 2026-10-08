import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { randomUUID } from "crypto";
import { db, isDbConfigured } from "@/lib/db";
import * as schema from "@/drizzle/schema";

// Better Auth configured for Neon via Drizzle. Server-side only.
// IDs are UUIDs so an auth user maps 1:1 onto app `users` / membership rows.
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-replace-in-prod-0123456789",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  advanced: { database: { generateId: () => randomUUID() } },
  ...(isDbConfigured
    ? { database: drizzleAdapter(db as any, { provider: "pg", schema: schema as any }) }
    : {}),
  session: { expiresIn: 60 * 60 * 24 * 7 },
});

export type Session = typeof auth.$Infer.Session;
