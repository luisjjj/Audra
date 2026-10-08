import Link from "next/link";
import { PageWrap } from "@/components/ui";
import { updateWorkspace } from "@/actions/audra";
import { getActiveOrgContext, getWorkspaceSettings } from "@/lib/workspaces";

export default async function Settings() {
  const ctx = await getActiveOrgContext();
  const real = !ctx.isDemo && !!ctx.activeOrgId;
  const ws = real ? await getWorkspaceSettings(ctx.activeOrgId!) : null;
  const canManage = real && ["owner", "admin"].includes(ctx.role);

  const Card = ({ t, children }: any) => (
    <div className="card-brutal rounded-3xl bg-white p-6"><p className="font-black">{t}</p><div className="mt-3">{children}</div></div>
  );

  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">SETTINGS</p>
      <h1 className="font-display text-4xl font-black md:text-5xl">Settings</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card t="Workspace">
          {ws ? (
            <form action={updateWorkspace} className="space-y-2 text-sm">
              <div><label htmlFor="set-name" className="mono-meta text-neutral-500">COMPANY NAME</label><input id="set-name" name="name" defaultValue={ws.name} disabled={!canManage} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 disabled:bg-neutral-50 disabled:text-neutral-500" /></div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div><label htmlFor="set-industry" className="mono-meta text-neutral-500">INDUSTRY</label><input id="set-industry" name="industry" defaultValue={ws.industry} disabled={!canManage} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 disabled:bg-neutral-50 disabled:text-neutral-500" /></div>
                <div><label htmlFor="set-timezone" className="mono-meta text-neutral-500">TIMEZONE</label><input id="set-timezone" name="timezone" defaultValue={ws.timezone} disabled={!canManage} className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 disabled:bg-neutral-50 disabled:text-neutral-500" /></div>
              </div>
              {canManage
                ? <button type="submit" className="min-h-[44px] rounded-xl bg-ink px-4 py-2 text-sm font-black text-white">Save changes</button>
                : <p className="text-xs text-neutral-500">Only owners and admins can edit workspace settings.</p>}
            </form>
          ) : (
            <div className="space-y-2 text-sm"><input aria-label="Company name" defaultValue="Apex Manufacturing Ltd." className="w-full rounded-xl border border-neutral-200 px-3 py-2" /><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><input aria-label="Industry" defaultValue="Manufacturing" className="rounded-xl border border-neutral-200 px-3 py-2" /><input aria-label="Timezone" defaultValue="UTC+1 Lagos" className="rounded-xl border border-neutral-200 px-3 py-2" /></div></div>
          )}
        </Card>
        <Card t="Members · Roles · Invitations">
          <p className="text-sm text-neutral-500">{ws ? `${ws.memberCount} member${ws.memberCount === 1 ? "" : "s"} in this workspace. You control who can see and do what.` : "You control who can see and do what — from owners to viewers, including outside collaborators."}</p>
          <Link href="/people" className="mt-2 inline-flex min-h-[44px] items-center rounded-xl bg-ink px-4 py-2 text-sm font-black text-white">Manage people →</Link>
        </Card>
        <Card t="Security"><p className="mono-meta">Sessions · Password · Access history</p><p className="mt-2 text-sm">Your documents stay private. Only people you invite can access them.</p></Card>
        <Card t="History"><p className="mono-meta">COMPLETE RECORD</p><p className="mt-2 text-sm">{ws ? `${ws.eventCount} event${ws.eventCount === 1 ? "" : "s"} recorded. Every action in this workspace is kept and can never be edited or deleted.` : "Every action in your workspace is recorded and can never be edited or deleted."}</p></Card>
        <div className="md:col-span-2 card-brutal rounded-3xl bg-paper p-6"><p className="font-black">Integrations — coming soon</p><div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-6">{["QuickBooks","Sage","Xero","M365","Drive","Tax"].map((x)=>(<div key={x} className="rounded-2xl border border-dashed border-neutral-300 bg-white p-3 text-center text-xs font-black">{x}<p className="mono-meta font-normal">COMING SOON</p></div>))}</div></div>
      </div>
    </PageWrap>
  );
}
