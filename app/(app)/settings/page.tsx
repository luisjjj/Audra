import { PageWrap } from "@/components/ui";

export default function Settings() {
  const Card = ({ t, children }: any) => (
    <div className="card-brutal rounded-3xl bg-white p-6"><p className="font-black">{t}</p><div className="mt-3">{children}</div></div>
  );
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">SYSTEM · SETTINGS</p>
      <h1 className="font-display text-4xl font-black md:text-5xl">Settings</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card t="Workspace"><div className="space-y-2 text-sm"><input aria-label="Company name" defaultValue="Apex Manufacturing Ltd." className="w-full rounded-xl border border-neutral-200 px-3 py-2" /><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><input aria-label="Industry" defaultValue="Manufacturing" className="rounded-xl border border-neutral-200 px-3 py-2" /><input aria-label="Timezone" defaultValue="UTC+1 Lagos" className="rounded-xl border border-neutral-200 px-3 py-2" /></div></div></Card>
        <Card t="Members · Roles · Invitations"><p className="text-sm text-neutral-500">Owner / Admin / Accountant / Auditor / Reviewer / Member / Viewer + external roles. Enforced server-side.</p><button className="mt-2 min-h-[44px] rounded-xl bg-ink px-4 py-2 text-sm font-black text-white">Manage people →</button></Card>
        <Card t="Security"><p className="mono-meta">SESSIONS · PASSWORD · ACCESS HISTORY</p><p className="mt-2 text-sm">Signed URLs only · no public docs · permission changes logged.</p></Card>
        <Card t="Audit"><p className="mono-meta">RETENTION · HASH-CHAIN STATUS: OK ✓</p><p className="mt-2 text-sm">Demo trail: 7 events · head 9f2c…a1 · append-only, no edits or deletes.</p></Card>
        <div className="md:col-span-2 card-brutal rounded-3xl bg-paper p-6"><p className="font-black">Integrations — coming soon</p><div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-6">{["QuickBooks","Sage","Xero","M365","Drive","Tax"].map((x)=>(<div key={x} className="rounded-2xl border border-dashed border-neutral-300 bg-white p-3 text-center text-xs font-black">{x}<p className="mono-meta font-normal">PLACEHOLDER</p></div>))}</div></div>
      </div>
    </PageWrap>
  );
}
