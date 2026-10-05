import Link from "next/link";
import { PageWrap, Reveal } from "@/components/ui";
import { DEMO_ENGAGEMENTS } from "@/lib/demo";
import { Bar } from "@/components/charts";

export default function Engagements() {
  return (
    <PageWrap>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="mono-meta text-neutral-500">WORK · ENGAGEMENTS</p><h1 className="font-display text-4xl font-black md:text-5xl">Engagements</h1></div>
        <Link href="/settings" className="card-brutal-sm rounded-2xl bg-ink px-5 py-2.5 text-sm font-black text-white">+ New engagement</Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {DEMO_ENGAGEMENTS.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.05}>
            <div className={`card-brutal rounded-3xl p-6 ${i === 0 ? "bg-white" : "bg-white/80"}`}>
              <div className="flex items-start justify-between">
                <div><p className="mono-meta text-neutral-500">ENG-{e.id.toUpperCase()} · {e.status.toUpperCase()}</p><p className="mt-1 text-xl font-black">{e.title}</p><p className="text-xs text-neutral-500">{e.org} · {e.firm}</p></div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">{e.progress}%</span>
              </div>
              <div className="mt-4"><Bar value={e.progress} /><p className="mono-meta mt-2 text-neutral-500">{e.done} / {e.total} requests complete · Due {e.due}</p></div>
              <Link href={`/engagements/${e.id}`} className="card-brutal-sm mt-4 block rounded-2xl bg-ink py-2.5 text-center text-sm font-black text-white hover:-translate-y-[1px] transition">Open Engagement →</Link>
            </div>
          </Reveal>
        ))}
      </div>
    </PageWrap>
  );
}
