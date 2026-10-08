import { PageWrap, Reveal, EmptyState } from "@/components/ui";
import { DEMO_FILINGS } from "@/lib/demo";
import { StatusPill } from "@/components/ui";
import { getActiveOrgContext, getOrgFilings } from "@/lib/workspaces";

export default async function Filings() {
  const ctx = await getActiveOrgContext();
  const items = ctx.isDemo || !ctx.activeOrgId ? DEMO_FILINGS : await getOrgFilings(ctx.activeOrgId);
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">FILINGS</p>
      <h1 className="font-display text-4xl font-black md:text-5xl">Filings</h1>
      <p className="text-sm text-neutral-500">Track every filing — owner, deadline and supporting evidence in one place.</p>
      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No filings tracked yet"
            body="Filings you track will appear here with owners, deadlines and linked evidence."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.05}>
              <div className="card-brutal rounded-3xl bg-white p-6">
                <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-lg font-black">{f.title}</p><p className="mono-meta text-neutral-500">{f.year} · OWNER {f.owner.toUpperCase()}</p></div><StatusPill status={f.status} /></div>
                <p className="mt-3 text-sm">Due: <b>{f.due}</b> · Evidence: <b>{f.docs} documents</b></p>
                <button className="card-brutal-sm mt-4 min-h-[44px] w-full rounded-2xl bg-ink py-2 text-sm font-black text-white">Open →</button>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </PageWrap>
  );
}
