import Link from "next/link";
import { PageWrap, Reveal, StatusPill } from "@/components/ui";
import { DEMO_ACTIVITY, DEMO_ATTENTION, DEMO_ENGAGEMENTS } from "@/lib/demo";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { ProgressRing } from "@/components/charts";

export default function Overview() {
  const eng = DEMO_ENGAGEMENTS[0];
  return (
    <PageWrap>
      <p className="mono-meta text-neutral-500">TUE 05 OCT 2026 · OVERVIEW</p>
      <h1 className="font-display mt-1 text-4xl font-black md:text-5xl">Good morning, Henkyaa.</h1>
      <p className="mt-1 text-neutral-600">Here&apos;s what needs your attention.</p>

      <Reveal>
        <div className="card-brutal mt-6 grid gap-6 rounded-3xl bg-ink p-6 text-white md:grid-cols-[1fr_auto] md:p-8">
          <div>
            <p className="mono-meta text-white/60">2026 AUDIT · {eng.org.toUpperCase()}</p>
            <p className="font-display mt-2 text-4xl font-black md:text-5xl">{eng.progress}%<span className="ml-3 align-middle text-sm font-bold tracking-widest text-white/60">ENGAGEMENT COMPLETE</span></p>
            <p className="mt-3 text-sm text-white/80">{eng.done} / {eng.total} requests completed · 6 items need attention</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full border border-white/30 bg-white/10">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${eng.progress}%` }} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/engagements/eng-2026" className="rounded-2xl bg-emerald-500 px-5 py-2.5 text-sm font-black text-ink">Open engagement →</Link>
              <Link href="/requests" className="rounded-2xl border border-white/30 px-5 py-2.5 text-sm font-bold">Review requests</Link>
            </div>
          </div>
          <ProgressRing value={eng.progress} />
        </div>
      </Reveal>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["ACTIVE ENGAGEMENTS","4"],["OPEN REQUESTS","12"],["PENDING REVIEWS","7"],["FILINGS DUE","3"]].map(([k,v],i)=>(
          <Reveal key={k} delay={i*0.06}>
            <div className={`card-brutal rounded-3xl p-5 ${i===0?"bg-emerald-600 text-white":i===1?"bg-white":i===2?"bg-white":"bg-ink text-white"}`}>
              <p className="mono-meta opacity-70">{k}</p>
              <p className="font-display mt-1 text-5xl font-black">{v}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-black">Needs your attention</h2><Link href="/requests" className="text-sm font-black underline">View all</Link></div>
          <div className="mt-3 space-y-3">
            {DEMO_ATTENTION.map((a,i)=>(
              <Reveal key={a.id} delay={i*0.05}>
                <Link href={a.link} className="card-brutal-sm group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 hover:-translate-y-[2px] transition">
                  <div className="flex gap-3">
                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${a.level==="red"?"bg-red-500":a.level==="amber"?"bg-amber-400":"bg-emerald-500"}`} />
                    <div><p className="text-sm font-black">{a.title}</p><p className="text-xs text-neutral-500">{a.sub}</p><p className="mono-meta mt-1 text-neutral-500">{a.meta}</p></div>
                  </div>
                  <ArrowUpRight className="shrink-0 transition group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" size={18} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-black">Recent activity</h2><Link href="/activity" className="text-sm font-black underline">Audit trail</Link></div>
          <div className="card-brutal mt-3 rounded-3xl bg-white p-5">
            {DEMO_ACTIVITY.slice(0,5).map((e)=>(
              <div key={e.id} className="flex gap-3 border-b border-dashed border-neutral-200 py-3 last:border-0">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-600" />
                <div><p className="mono-meta text-neutral-400">{e.ago} · {e.time}</p><p className="text-sm"><b>{e.actor}</b> <span className="rounded bg-neutral-100 px-1 font-mono text-[11px] font-bold">{e.action}</span><br/>{e.target}</p></div>
              </div>
            ))}
            <Link href="/activity" className="mt-2 inline-flex items-center gap-1 text-sm font-black">Full trail <ArrowRight size={14}/></Link>
          </div>
          <div className="card-brutal mt-4 rounded-3xl bg-emerald-50 p-5">
            <p className="mono-meta">UP NEXT</p>
            <p className="mt-1 text-sm font-bold">VAT Q3 2026 review · <Clock size={12} className="inline" /> 16 days left</p>
            <p className="text-xs text-neutral-600">3 evidence docs linked · owner Sarah Okafor</p>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
