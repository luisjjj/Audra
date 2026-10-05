import { headers } from "next/headers";
import { DEMO_USER } from "@/lib/demo";

// In production with DATABASE_URL set, resolve Better Auth session here.
// In demo mode (no DB), return the seeded user so every page works immediately.
export async function getSession() {
  if (!process.env.DATABASE_URL) {
    return {
      user: { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email },
      org: { id: "org-apex", name: DEMO_USER.org },
      role: DEMO_USER.role,
      demo: true as const,
    };
  }
  try {
    const { auth } = await import("@/lib/auth");
    const s = await auth.api.getSession({ headers: await headers() });
    if (!s) return null;
    return { ...s, demo: false as const, role: "admin", org: { id: "org-apex", name: "Apex Manufacturing Ltd." } };
  } catch {
    return {
      user: { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email },
      org: { id: "org-apex", name: DEMO_USER.org },
      role: DEMO_USER.role,
      demo: true as const,
    };
  }
}
