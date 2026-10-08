import { PageWrap } from "@/components/ui";

export default function Settings() {
  const Card = ({ t, children }: any) => (
    <div className="card-brutal rounded-3xl bg-white p-6"><p className="font-black">{t}</p><div className="mt-3">{children}</div></div>
  );
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">SETTINGS</p>
      <h1 className="font-display text-4xl font-black md:text-5xl">Settings</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card t="Workspace"><div className="space-y-2 text-sm"><input aria-label="Company name" defaultValue="Apex Manufacturing Ltd." className="w-full rounded-xl border border-neutral-200 px-3 py-2" /><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><input aria-label="Industry" defaultValue="Manufacturing" className="rounded-xl border border-neutral-200 px-3 py-2" /><input aria-label="Timezone" defaultValue="UTC+1 Lagos" className="rounded-xl border border-neutral-200 px-3 py-2" /></div></div></Card>
        <Card t="Members · Roles · Invitations"><p className="text-sm text-neutral-500">You control who can see and do what — from owners to viewers, including outside collaborators.</p><button className="mt-2 min-h-[44px] rounded-xl bg-ink px-4 py-2 text-sm font-black text-white">Manage people →</button></Card>
        <Card t="Security"><p className="mono-meta">Sessions · Password · Access history</p><p className="mt-2 text-sm">Your documents stay private. Only people you invite can access them.</p></Card>
        <Card t="History"><p className="mono-meta">COMPLETE RECORD</p><p className="mt-2 text-sm">Every action in your workspace is recorded and can never be edited or deleted.</p></Card>
        <div className="md:col-span-2 card-brutal rounded-3xl bg-paper p-6"><p className="font-black">Integrations — coming soon</p><div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-6">{["QuickBooks","Sage","Xero","M365","Drive","Tax"].map((x)=>(<div key={x} className="rounded-2xl border border-dashed border-neutral-300 bg-white p-3 text-center text-xs font-black">{x}<p className="mono-meta font-normal">COMING SOON</p></div>))}</div></div>
      </div>
    </PageWrap>
  );
}
