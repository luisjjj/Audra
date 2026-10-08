import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { getActiveOrgContext } from "@/lib/workspaces";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getActiveOrgContext();
  if (!ctx.isDemo && ctx.needsWorkspace) redirect("/signup?setup=1");
  const activeName = ctx.isDemo || !ctx.activeOrg ? "Apex Manufacturing Ltd." : ctx.activeOrg.name;
  return (
    <Shell
      userName={ctx.isDemo ? "Henkyaa Japheth" : ctx.user.name}
      userRole={ctx.isDemo ? "Admin" : ctx.role}
      orgs={ctx.orgs}
      activeOrgId={ctx.activeOrgId}
      activeOrgName={activeName}
    >
      {children}
    </Shell>
  );
}
