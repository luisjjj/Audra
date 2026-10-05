// Server-side permission enforcement. Never rely solely on hiding buttons.
export type Role = string;

const RANK: Record<string, number> = {
  viewer: 0, member: 1, accountant: 2, reviewer: 2, auditor: 3, admin: 4, owner: 5,
  external_auditor: 2, external_accountant: 2, client: 1, consultant: 1,
};

export function rank(role: string) { return RANK[role] ?? 1; }

export function can(role: string, action: "view"|"upload"|"review"|"approve"|"invite"|"manage"|"comment") {
  const r = rank(role);
  switch (action) {
    case "view": return r >= 0;
    case "upload": return r >= 1;
    case "comment": return r >= 1;
    case "review": return r >= 2;
    case "approve": return r >= 3;
    case "invite": return r >= 4;
    case "manage": return r >= 4;
    default: return false;
  }
}

export function scopeAllows(scopes: string[] | undefined, needed: string) {
  if (!scopes || scopes.length === 0) return true; // internal full access
  return scopes.includes(needed);
}

export function assertCan(role: string, action: Parameters<typeof can>[1]) {
  if (!can(role, action)) {
    const e = new Error(`Forbidden: role ${role} cannot ${action}`);
    (e as any).status = 403;
    throw e;
  }
}
