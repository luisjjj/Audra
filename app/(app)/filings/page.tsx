import { PageWrap, Reveal, StatusPill } from "@/components/ui";
import { DEMO_FILINGS } from "@/lib/demo";

export default function Filings() {
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">WORK · FILING TRACKING (NOT E-FILING)</p>
      <h1 className="font-display text-4xl font-black md:text-5xl">Filings</h1>
      <p className="text-sm text-neutral-500">Tracking workspace only — MVP does not file with any government authority.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {DEMO_FILINGS.map((f, i) => (
          <Reveal key={f.id} delay={i * 0.05}>
            <div className="card-brutal rounded-3xl bg-white p-6">
              <div className="flex items-start justify-between"><div><p className="text-lg font-black">{f.title}</p><p className="mono-meta text-neutral-500">{f.year} · OWNER {f.owner.toUpperCase()}</p></div><StatusPill status={f.status} /></div>
              <p className="mt-3 text-sm">Due: <b>{f.due}</b> · Evidence: <b>{f.docs} documents</b></p>
              <button className="card-brutal-sm mt-4 min-h-[44px] w-full rounded-2xl bg-ink py-2 text-sm font-black text-white">Open →</button>
            </div>
          </Reveal>
        ))}
      </div>
    </PageWrap>
  );
}
